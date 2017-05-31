const THREE = require("../node_modules/three/build/three.min.js");

// SCENE, CAMERA, RENDERER
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
camera.position.z = 20;
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

// HALFPIPE
var halfPipeGeometry = new THREE.CylinderGeometry(10, 10, 30, 32, 1, true, 0, -Math.PI);
let halfPipe = new THREE.MeshBasicMaterial({color: 0x00ff00});
halfPipeMaterial.side = THREE.DoubleSide;
let halfPipe = new THREE.Mesh(halfPipeGeometry, halfPipeMaterial);
halfPipe.position.set(0, 0, -20);
halfPipe.rotation.set(0.5*Math.PI, 0.5*Math.PI, 0);
scene.add(halfPipe);

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
