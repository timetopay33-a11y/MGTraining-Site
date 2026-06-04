/**
 * main.js
 * ----------------------------------------------------------------
 * Entry point. Responsibilities:
 *   - Construct the Three.js scene, camera, renderer, lights
 *   - Build the grid, sample part, and UI
 *   - Drive the animation loop with a "dirty" flag so we only
 *     recompute geometry when something actually changed.
 * ----------------------------------------------------------------
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  createErrorState,
} from './transformations.js';

import {
  buildGrid,
  createGridMeshes,
  updateDistortedBuffer,
  markBufferDirty,
} from './grid.js';

import {
  buildSamplePart,
  updateSamplePart,
} from './samplePart.js';

import { buildUI } from './ui.js';

// ----------------------------------------------------------------
// Scene setup
// ----------------------------------------------------------------
const canvas = document.getElementById('scene');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = null; // let the CSS gradient show through

const camera = new THREE.PerspectiveCamera(
  35,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  200
);
camera.position.set(12, 10, 14);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 0.9;
controls.panSpeed = 0.8;

// ----------------------------------------------------------------
// Lights (minimal — the scene is mostly wireframe / unlit)
// ----------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(8, 10, 6);
scene.add(key);

// ----------------------------------------------------------------
// Axis helper (X=red, Y=green, Z=blue) & origin marker
// ----------------------------------------------------------------
const axesLength = 6.2;
const axes = new THREE.AxesHelper(axesLength);
// brighten the default axes a touch
axes.material.transparent = true;
axes.material.opacity = 0.95;
scene.add(axes);

// A subtle floor grid for spatial orientation (optional — XZ plane)
const floor = new THREE.GridHelper(20, 20, 0x1e2630, 0x141a22);
floor.position.y = -5.2;
scene.add(floor);

// ----------------------------------------------------------------
// Domain objects
// ----------------------------------------------------------------
const GRID_RANGE = 10;       // total extent of working volume
const GRID_DIVS  = 5;        // lattice planes per axis
const GRID_SEGS  = 24;       // samples per logical grid line

const errors  = createErrorState();
const toggles = {
  showIdeal:     true,
  showDistorted: true,
  showPart:      true,
  showVectors:   true,
  magnify:       false,
};

const grid = buildGrid({
  range: GRID_RANGE,
  divisions: GRID_DIVS,
  segs: GRID_SEGS,
});
const { idealMesh, distMesh } = createGridMeshes(grid);
scene.add(idealMesh);
scene.add(distMesh);

const part = buildSamplePart(scene);

// ----------------------------------------------------------------
// HUD stat elements
// ----------------------------------------------------------------
const statMaxEl = document.getElementById('stat-max');
const statRmsEl = document.getElementById('stat-rms');

// ----------------------------------------------------------------
// Dirty-flag pattern: recompute geometry only when something moves
// ----------------------------------------------------------------
let dirty = true;

function markDirty() { dirty = true; }

// UI build — sliders, toggles, preset buttons
buildUI(errors, toggles, () => { markDirty(); });

// Apply current toggle state to scene objects
function applyToggles() {
  idealMesh.visible               = toggles.showIdeal;
  distMesh.visible                = toggles.showDistorted;
  part.group.visible              = toggles.showPart;
  part.devMesh.visible            = toggles.showVectors && toggles.showPart;
}

// ----------------------------------------------------------------
// Recompute grid + part geometry from current error state
// ----------------------------------------------------------------
function recomputeGeometry() {
  const amp = toggles.magnify ? 10 : 1;
  const L   = grid.half;

  updateDistortedBuffer(grid, errors, amp);
  markBufferDirty(distMesh);

  const stats = updateSamplePart(part, errors, L, amp);

  // Update HUD numbers (3 decimals, no unit symbol)
  statMaxEl.textContent = stats.maxDev.toFixed(3);
  statRmsEl.textContent = stats.rms.toFixed(3);
}

// ----------------------------------------------------------------
// Resize
// ----------------------------------------------------------------
function onResize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
onResize();

// ----------------------------------------------------------------
// Render loop
// ----------------------------------------------------------------
function loop() {
  if (dirty) {
    applyToggles();
    recomputeGeometry();
    dirty = false;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ----------------------------------------------------------------
// Debug handle (optional): expose internals on window for
// developers poking around in the console.
// ----------------------------------------------------------------
window.__cmm = {
  scene, camera, renderer, controls,
  grid, part, errors, toggles,
  markDirty,
};
