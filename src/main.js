const THREE = require("../node_modules/three/build/three.min.js");

// SCENE, CAMERA, RENDERER
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
camera.position.z = 5;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('tabIndex', '0');
renderer.domElement.focus();

// LIGHTS
let ambientLight = new THREE.AmbientLight(0x444444, 0.1);
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1000, 0);
scene.add(ambientLight);
scene.add(light);

// FLOOR
let floorGeometry = new THREE.BoxGeometry(5, 1, 5);
let floorMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -1.4, 0);
scene.add(floor);

// GAME OBJECTS
let ballGeometry = new THREE.SphereGeometry(1, 32, 32);
let ballMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
let ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// GAME LOOP
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
