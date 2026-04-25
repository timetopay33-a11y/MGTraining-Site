/**
 * scene.js
 * --------
 * Three.js renderer, camera, orbit controls, axis gnomon, and a
 * subtle ground/volume reference. Nothing in here reads the error
 * parameters; it just owns the static scaffolding.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { L } from './transformations.js';

export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha:     true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    1,             // aspect — updated by resize()
    0.1,
    2000
  );
  camera.position.set(120, 95, 140);
  camera.lookAt(0, 0, 0);

  // OrbitControls — target the origin, with a gentle damping feel
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.7;
  controls.panSpeed = 0.7;
  controls.minDistance = 40;
  controls.maxDistance = 400;

  // Soft ambient + a single key light so the solid sample-part fill
  // picks up a hint of shading without looking rendered.
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const key = new THREE.DirectionalLight(0xffffff, 0.5);
  key.position.set(60, 120, 80);
  scene.add(key);

  // Axis gnomon — X red, Y green, Z blue. Slightly past the volume edge.
  const axes = buildAxes(L * 1.15);
  scene.add(axes);

  // Bounding box hint for the nominal volume (very faint)
  const boundsGeom = new THREE.BoxGeometry(2 * L, 2 * L, 2 * L);
  const boundsEdges = new THREE.EdgesGeometry(boundsGeom);
  const bounds = new THREE.LineSegments(
    boundsEdges,
    new THREE.LineBasicMaterial({
      color:       0x2a3138,
      transparent: true,
      opacity:     0.5,
    })
  );
  scene.add(bounds);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  return { renderer, scene, camera, controls, axes };
}

/**
 * Labeled axis gnomon. Three colored line segments originating at the
 * origin, each roughly one "volume radius" long.
 */
function buildAxes(length) {
  const group = new THREE.Group();
  group.name = 'Axes';

  const make = (color, to) => {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...to),
    ]);
    const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
    return new THREE.Line(geom, mat);
  };

  group.add(make(0xe57373, [length, 0, 0])); // X — red
  group.add(make(0x81c784, [0, length, 0])); // Y — green
  group.add(make(0x64b5f6, [0, 0, length])); // Z — blue

  // Small arrow tips at each axis end
  const tip = (color, pos, dir) => {
    const geom = new THREE.ConeGeometry(1.5, 4, 8);
    const mat = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(...pos);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir));
    return mesh;
  };

  group.add(tip(0xe57373, [length, 0, 0], [1, 0, 0]));
  group.add(tip(0x81c784, [0, length, 0], [0, 1, 0]));
  group.add(tip(0x64b5f6, [0, 0, length], [0, 0, 1]));

  return group;
}
