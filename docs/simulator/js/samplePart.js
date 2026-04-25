/**
 * samplePart.js
 * ----------------------------------------------------------------
 * A simple rectangular block with a handful of "measurement
 * features" (hole centers on the top and front face, plus the
 * eight corners). For each feature we render:
 *
 *   - A cyan sphere at the nominal (drawing) location
 *   - An amber sphere at the measured (distorted) location
 *   - A red line segment between them (the deviation vector)
 *
 * The part itself is also drawn twice — once as a subtle cyan
 * wireframe (nominal) and once as an amber wireframe whose
 * corners have been distorted through the error pipeline.
 *
 * @@REAL-CMM-HOOK@@
 * In a real training scenario you'd load features from a CAD
 * CMM-inspection program (e.g. a DMIS or CMM-OS file) and
 * compare simulated "measured" points to the nominal values.
 * ----------------------------------------------------------------
 */

import * as THREE from 'three';
import { transformPoint } from './transformations.js';

// ---------- Part definition ------------------------------------

// Block: center position + half-extents (so it's a 4 x 3 x 2 box
// placed asymmetrically to make distortion visible).
const BLOCK_CENTER = [0.8, 0.2, 0.6];
const BLOCK_HX = 2.4;
const BLOCK_HY = 1.5;
const BLOCK_HZ = 1.2;

// The 8 block corners
function cornerList() {
  const [cx, cy, cz] = BLOCK_CENTER;
  const out = [];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1])
        out.push([
          cx + sx * BLOCK_HX,
          cy + sy * BLOCK_HY,
          cz + sz * BLOCK_HZ,
        ]);
  return out;
}

// Edges of the block as (i,j) corner-index pairs
const BOX_EDGES = [
  [0, 1], [0, 2], [0, 4],
  [1, 3], [1, 5],
  [2, 3], [2, 6],
  [3, 7],
  [4, 5], [4, 6],
  [5, 7],
  [6, 7],
];

// Feature points — hole centers on top and front face
function featurePoints() {
  const [cx, cy, cz] = BLOCK_CENTER;
  const top = cz + BLOCK_HZ;
  const front = cy - BLOCK_HY;
  return [
    // four holes on the top face
    [cx - 1.6, cy - 0.8, top],
    [cx + 1.6, cy - 0.8, top],
    [cx - 1.6, cy + 0.8, top],
    [cx + 1.6, cy + 0.8, top],
    // two holes on the front face
    [cx - 1.6, front, cz - 0.4],
    [cx + 1.6, front, cz - 0.4],
    // two holes on the right face
    [cx + BLOCK_HX, cy - 0.6, cz + 0.4],
    [cx + BLOCK_HX, cy + 0.6, cz - 0.4],
  ];
}

/**
 * Build all Three.js objects for the sample part and return a
 * handle the caller can update in real time.
 */
export function buildSamplePart(scene) {
  const corners = cornerList();           // 8 corners, ideal
  const features = featurePoints();       // N feature centers, ideal

  // ---------- Nominal (cyan) wireframe block ----------------
  const nominalGeom = new THREE.BufferGeometry();
  const nominalPos  = new Float32Array(BOX_EDGES.length * 2 * 3);
  fillBoxEdgeBuffer(nominalPos, corners);
  nominalGeom.setAttribute('position', new THREE.BufferAttribute(nominalPos, 3));
  const nominalMesh = new THREE.LineSegments(
    nominalGeom,
    new THREE.LineBasicMaterial({
      color: 0x3fb8ff,
      transparent: true,
      opacity: 0.55,
    })
  );

  // ---------- Measured (amber) wireframe block -------------
  const measuredGeom = new THREE.BufferGeometry();
  const measuredPos  = new Float32Array(BOX_EDGES.length * 2 * 3);
  measuredPos.set(nominalPos);            // starts identical
  measuredGeom.setAttribute('position', new THREE.BufferAttribute(measuredPos, 3));
  const measuredMesh = new THREE.LineSegments(
    measuredGeom,
    new THREE.LineBasicMaterial({
      color: 0xffb347,
      linewidth: 2,
    })
  );

  // ---------- Feature points (instanced spheres) ------------
  const sphereGeom = new THREE.SphereGeometry(0.09, 14, 10);
  const nominalFeatMat = new THREE.MeshBasicMaterial({ color: 0x3fb8ff });
  const measuredFeatMat = new THREE.MeshBasicMaterial({ color: 0xffb347 });

  const nominalFeatMesh  = new THREE.InstancedMesh(sphereGeom, nominalFeatMat,  features.length);
  const measuredFeatMesh = new THREE.InstancedMesh(sphereGeom, measuredFeatMat, features.length);

  // Populate initial instance transforms
  const dummy = new THREE.Object3D();
  for (let i = 0; i < features.length; i++) {
    dummy.position.set(features[i][0], features[i][1], features[i][2]);
    dummy.updateMatrix();
    nominalFeatMesh.setMatrixAt(i, dummy.matrix);
    measuredFeatMesh.setMatrixAt(i, dummy.matrix);
  }
  nominalFeatMesh.instanceMatrix.needsUpdate  = true;
  measuredFeatMesh.instanceMatrix.needsUpdate = true;

  // ---------- Deviation vectors (red line segments) --------
  const devGeom = new THREE.BufferGeometry();
  const devPos  = new Float32Array(features.length * 2 * 3); // 2 verts per vector
  devGeom.setAttribute('position', new THREE.BufferAttribute(devPos, 3));
  const devMesh = new THREE.LineSegments(
    devGeom,
    new THREE.LineBasicMaterial({
      color: 0xff4d6d,
      transparent: true,
      opacity: 0.95,
    })
  );

  // ---------- Scene graph ----------------------------------
  const group = new THREE.Group();
  group.add(nominalMesh);
  group.add(measuredMesh);
  group.add(nominalFeatMesh);
  group.add(measuredFeatMesh);
  group.add(devMesh);
  scene.add(group);

  return {
    group,
    corners,
    features,
    nominalMesh,
    measuredMesh,
    nominalPos,
    measuredPos,
    nominalFeatMesh,
    measuredFeatMesh,
    devMesh,
    devPos,
    sphereDummy: dummy,
  };
}

/** Fill a 2-vertex-per-edge buffer from corner list and BOX_EDGES */
function fillBoxEdgeBuffer(dst, corners) {
  let w = 0;
  for (const [i, j] of BOX_EDGES) {
    dst[w++] = corners[i][0]; dst[w++] = corners[i][1]; dst[w++] = corners[i][2];
    dst[w++] = corners[j][0]; dst[w++] = corners[j][1]; dst[w++] = corners[j][2];
  }
}

/**
 * Recompute measured corners, feature positions, and deviation
 * vectors for the current error state. Returns deviation stats
 * (max and RMS) for the HUD.
 */
export function updateSamplePart(part, errors, L, amp = 1) {
  // ---------- Measured block wireframe ---------------------
  const distortedCorners = part.corners.map((c) => {
    const tmp = [0, 0, 0];
    transformPoint(tmp, c[0], c[1], c[2], errors, L, amp);
    return tmp.slice();
  });
  fillBoxEdgeBuffer(part.measuredPos, distortedCorners);
  part.measuredMesh.geometry.attributes.position.needsUpdate = true;

  // ---------- Measured feature spheres ---------------------
  const dummy = part.sphereDummy;
  let sumSq = 0;
  let maxDev = 0;
  const devPos = part.devPos;
  let w = 0;

  for (let i = 0; i < part.features.length; i++) {
    const f = part.features[i];
    const tmp = [0, 0, 0];
    transformPoint(tmp, f[0], f[1], f[2], errors, L, amp);

    // update measured instance position
    dummy.position.set(tmp[0], tmp[1], tmp[2]);
    dummy.updateMatrix();
    part.measuredFeatMesh.setMatrixAt(i, dummy.matrix);

    // deviation segment: nominal -> measured
    devPos[w++] = f[0];   devPos[w++] = f[1];   devPos[w++] = f[2];
    devPos[w++] = tmp[0]; devPos[w++] = tmp[1]; devPos[w++] = tmp[2];

    // stats
    const dx = tmp[0] - f[0];
    const dy = tmp[1] - f[1];
    const dz = tmp[2] - f[2];
    const d2 = dx * dx + dy * dy + dz * dz;
    sumSq += d2;
    if (d2 > maxDev * maxDev) maxDev = Math.sqrt(d2);
  }

  part.measuredFeatMesh.instanceMatrix.needsUpdate = true;
  part.devMesh.geometry.attributes.position.needsUpdate = true;

  const rms = Math.sqrt(sumSq / part.features.length);
  return { maxDev, rms };
}
