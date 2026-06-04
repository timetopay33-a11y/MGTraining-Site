/**
 * grid.js
 * ----------------------------------------------------------------
 * 3-D lattice wireframe for the CMM working volume.
 *
 * The grid is built as a set of "logical lines": each line is a
 * straight path through the volume, sampled at N+1 points. In the
 * ideal machine the points are collinear; after transformation
 * they bow, shear, twist, etc.
 *
 * We keep two Float32 buffers of matching layout — one for the
 * undistorted reference grid (displayed as a semi-transparent
 * cyan lattice) and one for the distorted grid (amber). Both are
 * rendered with THREE.LineSegments, updated in place.
 * ----------------------------------------------------------------
 */

import * as THREE from 'three';
import { transformBuffer } from './transformations.js';

/**
 * Build the logical grid.
 *
 * @param {number} range       Overall size of the working volume (units)
 * @param {number} divisions   Grid planes per axis (N+1 lines per row)
 * @param {number} segs        Samples per logical line (more = smoother)
 * @returns {Object} grid descriptor
 */
export function buildGrid({ range = 10, divisions = 5, segs = 24 } = {}) {
  const half = range / 2;

  // Where the grid planes intersect each axis
  const planes = [];
  for (let i = 0; i <= divisions; i++) {
    planes.push(-half + (i / divisions) * range);
  }

  // ----------------------------------------------------------
  // Construct flat point buffer.
  //
  // Layout: lines are stored sequentially; each line contains
  // (segs+1) points. For rendering with LineSegments we need
  // pairs of vertices per segment, so the GPU buffer has
  //     numLines * segs * 2 vertices   (= * 6 floats)
  // while the "ideal point buffer" has
  //     numLines * (segs+1) vertices   (= * 3 floats)
  // We keep both for cheap reuse.
  // ----------------------------------------------------------

  const pointsPerLine = segs + 1;

  // Gather logical lines first so we can count.
  const lines = [];

  // X-parallel lines: iterate over (y,z) planes
  for (const y of planes) {
    for (const z of planes) {
      const pts = new Float32Array(pointsPerLine * 3);
      for (let s = 0; s < pointsPerLine; s++) {
        pts[s * 3]     = -half + (s / segs) * range;
        pts[s * 3 + 1] = y;
        pts[s * 3 + 2] = z;
      }
      lines.push(pts);
    }
  }
  // Y-parallel
  for (const x of planes) {
    for (const z of planes) {
      const pts = new Float32Array(pointsPerLine * 3);
      for (let s = 0; s < pointsPerLine; s++) {
        pts[s * 3]     = x;
        pts[s * 3 + 1] = -half + (s / segs) * range;
        pts[s * 3 + 2] = z;
      }
      lines.push(pts);
    }
  }
  // Z-parallel
  for (const x of planes) {
    for (const y of planes) {
      const pts = new Float32Array(pointsPerLine * 3);
      for (let s = 0; s < pointsPerLine; s++) {
        pts[s * 3]     = x;
        pts[s * 3 + 1] = y;
        pts[s * 3 + 2] = -half + (s / segs) * range;
      }
      lines.push(pts);
    }
  }

  // ----------------------------------------------------------
  // Allocate the LineSegments buffer once and populate the
  // ideal version. Each logical line of (segs+1) points becomes
  // segs * 2 vertices in the segment buffer.
  // ----------------------------------------------------------
  const segVertsPerLine = segs * 2;
  const totalSegVerts   = lines.length * segVertsPerLine;

  const idealSegBuf     = new Float32Array(totalSegVerts * 3);
  const distortedSegBuf = new Float32Array(totalSegVerts * 3);

  fillSegmentBuffer(idealSegBuf, lines, segs);
  // Start distorted buffer as a copy of ideal
  distortedSegBuf.set(idealSegBuf);

  // Working buffer holding distorted *logical* points (before
  // fan-out to segment pairs). Reused every update.
  const logicalDistorted = lines.map(
    (l) => new Float32Array(l.length)
  );

  return {
    range, half, divisions, segs,
    pointsPerLine,
    lines,                 // Array<Float32Array>  ideal logical points
    logicalDistorted,      // Array<Float32Array>  distorted logical points (reused)
    idealSegBuf,
    distortedSegBuf,
  };
}

/**
 * Populate a segment-pair buffer from logical lines.
 * Each line of N+1 points yields N pairs (2N vertices).
 */
function fillSegmentBuffer(dst, lines, segs) {
  let w = 0;
  for (const line of lines) {
    for (let s = 0; s < segs; s++) {
      const a = s * 3;
      const b = (s + 1) * 3;
      dst[w++] = line[a];     dst[w++] = line[a + 1]; dst[w++] = line[a + 2];
      dst[w++] = line[b];     dst[w++] = line[b + 1]; dst[w++] = line[b + 2];
    }
  }
}

/**
 * Recompute the distorted segment buffer from the current error
 * state. Returns nothing; mutates grid.distortedSegBuf in place.
 */
export function updateDistortedBuffer(grid, errors, amp = 1) {
  // 1) transform each logical line's points
  for (let i = 0; i < grid.lines.length; i++) {
    transformBuffer(
      grid.lines[i],
      grid.logicalDistorted[i],
      errors,
      grid.half,
      amp
    );
  }
  // 2) fan logical points out to segment-pair vertices
  fillSegmentBuffer(grid.distortedSegBuf, grid.logicalDistorted, grid.segs);
}

/**
 * Create THREE.LineSegments objects for both ideal and distorted
 * grids using a single shared buffer each.
 */
export function createGridMeshes(grid) {
  const idealGeom = new THREE.BufferGeometry();
  idealGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(grid.idealSegBuf, 3)
  );
  const idealMat = new THREE.LineBasicMaterial({
    color: 0x3fb8ff,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const idealMesh = new THREE.LineSegments(idealGeom, idealMat);
  idealMesh.renderOrder = 0;

  const distGeom = new THREE.BufferGeometry();
  distGeom.setAttribute(
    'position',
    new THREE.BufferAttribute(grid.distortedSegBuf, 3)
  );
  const distMat = new THREE.LineBasicMaterial({
    color: 0xffb347,
    transparent: true,
    opacity: 0.85,
  });
  const distMesh = new THREE.LineSegments(distGeom, distMat);
  distMesh.renderOrder = 1;

  return { idealMesh, distMesh };
}

/**
 * Tell Three.js that our buffer contents changed so the GPU
 * re-uploads. Cheaper than recreating geometries.
 */
export function markBufferDirty(mesh) {
  mesh.geometry.attributes.position.needsUpdate = true;
  mesh.geometry.computeBoundingSphere();
}
