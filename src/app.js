import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { CharacterControls } from './characterControls';
import { KeyDisplay } from './utils';
import * as THREE from "three";
import io from "socket.io-client";

// Update url when deploying 
// https://ima-sockets-bec2149551cd.herokuapp.com/
const socket = io.connect("http://localhost:7890");

const loader = new GLTFLoader();

// Load a glTF resource

//flower svg
const flower = document.querySelector("#intro-ground");
let flowerRect = flower.getBoundingClientRect();
let bodyRect = document.body.getBoundingClientRect();

console.log(flowerRect.top - bodyRect.top);

const kamiTest = document.querySelector("#kami-test");
kamiTest.style.bottom = flowerRect.height - flowerRect.height * 0.504 + "px";
console.log(kamiTest.style);

window.addEventListener("resize", () => {
  flowerRect = flower.getBoundingClientRect();
  console.log("first: " + kamiTest.style.bottom);
  console.log("flower: " + flowerRect.height);
  kamiTest.style.bottom = flowerRect.height - flowerRect.height * 0.5 + "px";
  console.log("second: " + kamiTest.style.bottom);
});

//call button
const callButton = document.getElementById("intro-button");

//input form
const nameInput = document.createElement("input");
nameInput.setAttribute("type", "text");
const submitInput = document.createElement("input");
submitInput.setAttribute("type", "submit");

callButton.addEventListener("mousedown", () => {
  callButton.src = "./assets/call-button-pressed.svg";
  kamiTest.style.display = "block";
  kamiTest.play();
  kamiTest.style.objectFit = "fill";
  setTimeout(() => {
    flower.classList.add("scaleUp");
    // tick()
    document.body.innerHTML = "";

    document.body.appendChild(nameInput);
    document.body.appendChild(submitInput);
  }, 1150);
});

submitInput.addEventListener("click", () => {
  let myName = nameInput.value;
  let nameObj = { name: myName, feeling: "strong" };

  //Send the message object to the server
  socket.emit("name", nameObj);
  open();
});

callButton.addEventListener("mouseup", () => {
  callButton.src = "./assets/call-button-unpressed.svg";
});
const open = () => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // Canvas
  const canvas = document.createElement("canvas");
  canvas.classList += ".webgl";
  document.body.appendChild(canvas);

  // Scene
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);
  document.body.removeChild(nameInput);
  document.body.removeChild(submitInput);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

//   loader.load(
//     // resource URL
//     "models/character.glb",
//     // called when the resource is loaded
//     function (gltf) {
//       scene.add(gltf.scene);

//       gltf.animations; // Array<THREE.AnimationClip>
//       gltf.scene; // THREE.Group
//       gltf.scenes; // Array<THREE.Group>
//       gltf.cameras; // Array<THREE.Camera>
//       gltf.asset; // Object
//     },
//     // called while loading is progressing
//     function (xhr) {
//       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     },
//     // called when loading has errors
//     function (error) {
//       console.log("An error happened");
//     }
//   );

  //placeholder character
//   const box = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshStandardMaterial({ color: "#b2b6b1" })
//   );
//   box.position.y = 0.5;
//   box.castShadow = true;
//   scene.add(box);

  //floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: "green", side: THREE.DoubleSide })
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  //lights
  const ambientLight = new THREE.AmbientLight("#ffd599", .9);
  const sun = new THREE.PointLight("#ffd599", 5);
  sun.castShadow = true;
  sun.position.set(4, 5, -2);
  scene.add(sun, ambientLight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);

  const clock = new THREE.Clock();
  console.log(clock);



// MODEL WITH ANIMATIONS
var characterControls
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

new GLTFLoader().load('models/kami.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
    });
    let nameGeo = new TextGeometry('hello',{
        size: 80,
		height: 5,

    })

    let nameText = new THREE.Mesh(nameGeo, new THREE.MeshBasicMaterial({color:'red'}))

    scene.add(nameText)
    scene.add(model);

    const gltfAnimations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera,  'idle')
});
         
// CONTROL KEYS
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed)[event.key.toLowerCase()] = false
}, false);

// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();











//   tick();
};

//sockets

socket.on("connect", () => {
  console.log(`connected via socket`);
});

console.log("updated");


