import * as THREE from "https://esm.sh/three@0.181.2";
import { OrbitControls } from "https://esm.sh/three@0.181.2/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries} from "https://esm.sh/three@0.181.2/examples/jsm/utils/BufferGeometryUtils.js";


let scene, camera, renderer, controls, model;

function createRadiator({height = 0.8, columns = 3, links = 1}) {
  const tubeDiameter = 0.025;
  const tubeGap = 0.02;
  const sectionGap = 0.02;
  const color = 0xffffff;
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0,
    roughness: 0.35,
    transparent: true,
    opacity: 1,
  });

  const totalW  = links * tubeDiameter + (links  - 1) * sectionGap;
  const totalD  = columns * tubeDiameter + (columns - 1) * tubeGap;
  const headerH = tubeDiameter * 0.5;
  const tubeH   = height - headerH * 2;
  const headerTubeLength = totalW - tubeDiameter;

  const x0 = -totalW / 2;
  const y0 = -totalD / 2;

  const tubeGeo = new THREE.CylinderGeometry(tubeDiameter / 2, tubeDiameter / 2, tubeH, 24);
  const headerGeo = new THREE.CapsuleGeometry(tubeDiameter / 2, totalD - tubeDiameter, 6, 16);
  const headerTubeGeo = new THREE.CylinderGeometry(tubeDiameter / 2,tubeDiameter / 2,headerTubeLength, 24);

  const parts = [];

  for (let s = 0; s < links; s++) {
    const x = x0 + s * (tubeDiameter + sectionGap);

    for (let c = 0; c < columns; c++) {
      const y = y0 + c * (tubeDiameter + tubeGap) + tubeDiameter / 2;

      const geo = tubeGeo.clone();
      geo.rotateX(Math.PI / 2);
      geo.translate(x + tubeDiameter / 2, y, headerH + tubeH / 2);

      parts.push(geo);
    }

    const bottomCap = headerGeo.clone();
    bottomCap.scale(1, 1, 1.4);
    bottomCap.translate(x + tubeDiameter / 2, 0, headerH / 2);

    parts.push(bottomCap);

    const topCap = bottomCap.clone();
    topCap.translate(0, 0, height - headerH);
    parts.push(topCap);
  }

  const bottomPipe = headerTubeGeo.clone();
  bottomPipe.rotateZ(Math.PI / 2);
  bottomPipe.translate(0, 0, headerH / 2);
  bottomPipe.scale(1, (2*totalD)/(3*tubeDiameter), 1);
  parts.push(bottomPipe);

  const topPipe = bottomPipe.clone();
  topPipe.translate(0, 0, height - headerH);
  parts.push(topPipe);

  const mesh = new THREE.Mesh(mergeGeometries(parts, true), mat);

  group.add(mesh);
  return group;
}

function centerObject(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const center = new THREE.Vector3();
  box.getCenter(center);
  obj.position.sub(center);

  controls.target.set(0, 0, 0);
  controls.update();
}

export function initRadiatorViewer(canvasSelector = "#radiator-viewer") {
  const canvas = document.querySelector(canvasSelector);
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(devicePixelRatio);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.01, 50);
  camera.position.set(2, 2, 2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(3, 3, 3);
  scene.add(light);

  updateRadiator({});

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

export function updateRadiator(params) {
  if (!scene) return;
  
  if (model) scene.remove(model);

  model = createRadiator(params);
  scene.add(model);
  centerObject(model);
  zoomToFit(model);
}

function zoomToFit(object, padding = 0.4, duration = 600) {
  const box = new THREE.Box3().setFromObject(object);
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);

  const { center, radius } = sphere;

  const aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
  const fov = camera.fov * (Math.PI / 180);

  // Computes consistent distance based on both axes
  const distVert = radius / Math.sin(fov / 2);
  const distHorz = radius / Math.sin(Math.atan(Math.tan(fov / 2) * aspect));

  const distance = Math.max(distVert, distHorz) * padding;

  const start = {
    pos: camera.position.clone(),
    target: controls.target.clone()
  };

  const end = {
    pos: new THREE.Vector3(center.x + distance, center.y + distance, center.z + distance),
    target: center.clone()
  };

  const startTime = performance.now();

  function animate(t) {
    const progress = Math.min((t - startTime) / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    camera.position.lerpVectors(start.pos, end.pos, ease);
    controls.target.lerpVectors(start.target, end.target, ease);

    controls.update();

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
