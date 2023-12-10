import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { CharacterControls } from './characterControls';
import { GuestControls } from './guestControls';
import { KeyDisplay } from './utils';
import * as THREE from "three";
import io from "socket.io-client";
import { RGB_BPTC_UNSIGNED_Format } from "three";

let socketOpen=false;
const loader = new GLTFLoader();
let userObj = {
  keys:{
    w: false,
    a: false,
    s: false,
    d: false
  },
  shift:false
}

let socket = null

let model = null

let models = []
let users = []
let ids = []
let myId = ''

//-------------------intro page--------------------------------


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


callButton.addEventListener("mousedown", () => {
  callButton.src = "./static/call-button-pressed.svg";
  kamiTest.style.display = "block";
  kamiTest.play();
  kamiTest.style.objectFit = "fill";
  setTimeout(() => {
    flower.classList.add("scaleUp");
    document.body.innerHTML = "";
    document.body.appendChild(nameLabel);
    document.body.appendChild(nameInput);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(feelingInputStrong);
    document.body.appendChild(feelingLabelStrong);
    document.body.appendChild(feelingInputKind);
    document.body.appendChild(feelingLabelKind);
    document.body.appendChild(feelingInputCreative);
    document.body.appendChild(feelingLabelCreative);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(submitInput);
  }, 
  // 11500
  0
  );
});

callButton.addEventListener("mouseup", () => {
  callButton.src = "./static/call-button-unpressed.svg";
});






//-----------------input form-------------------------




const nameLabel = document.createElement("h1");
nameLabel.innerText = "What is your name?"

const nameInput = document.createElement("input");
nameInput.setAttribute("type", "text");

const feelingInputStrong = document.createElement("input")
feelingInputStrong.setAttribute("type", "radio")
feelingInputStrong.name = "feeling"
feelingInputStrong.id = 'strong'
feelingInputStrong.value = 'strong'

const feelingLabelStrong = document.createElement('label')
feelingLabelStrong.for='strong'
feelingLabelStrong.innerText='strong'

const feelingInputKind = document.createElement("input")
feelingInputKind.setAttribute("type", "radio")
feelingInputKind.name = "feeling"
feelingInputKind.id = 'kind'
feelingInputKind.value = 'kind'

const feelingLabelKind = document.createElement('label')
feelingLabelKind.for='kind'
feelingLabelKind.innerText = 'kind'

const feelingInputCreative = document.createElement("input")
feelingInputCreative.setAttribute("type", "radio")
feelingInputCreative.name = "feeling"
feelingInputCreative.id = 'creative'
feelingInputCreative.value = 'creative'

const feelingLabelCreative = document.createElement('label')
feelingLabelCreative.for='creative'
feelingLabelCreative.innerText='creative'


const submitInput = document.createElement("input");
submitInput.setAttribute("type", "submit");


submitInput.addEventListener("click", () => {
  const radioButtons = document.querySelectorAll('input[name="feeling"]');
  radioButtons.forEach(radio=>{
    if(radio.checked==true){
      console.log(radio)
      userObj.feeling = radio.value
    }
  })
  let myName = nameInput.value;
  userObj.name = myName


  document.body.innerHTML = ''

  const displayName = document.createElement('h1')
  displayName.innerText = userObj.name + " the " + userObj.feeling
  displayName.classList.add('displayName')
  document.body.appendChild(displayName)

 
  

  open();
});




const open = () => {

  socket = io.connect("http://localhost:5173");

  socket.on("connect", () => {
    console.log(`connected via socket`);
    myId=socket.id
    userObj.id= socket.id
    ids.push(myId)
  });

  socketOpen = true
  
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
  scene.background = new THREE.Color(0xDDDDFF)

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

 

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

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

loader.load('models/kami.glb', function (gltf) {
    model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
    });

    userObj.position = model.position
    scene.add(model);


    socket.emit("user", userObj);

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
        userObj.shift = true
        console.log(userObj.shift)
    } else {
        (keysPressed)[event.key.toLowerCase()] = true
        if(event.key.toLowerCase()=='w'){
          userObj.keys.w = true
        }else if(event.key.toLowerCase()=='a'){
          userObj.keys.a = true
        }else if(event.key.toLowerCase()=='s'){
          userObj.keys.s = true
        }else if(event.key.toLowerCase()=='d'){
          userObj.keys.d = true
        }
        
    }
}, false);
document.addEventListener('keyup', (event) => {
  if (event.shiftKey && characterControls) {

  }
    keyDisplayQueue.up(event.key);
    (keysPressed)[event.key.toLowerCase()] = false
    if(event.key.toLowerCase()=='w'){
      userObj.keys.w = false
    }else if(event.key.toLowerCase()=='a'){
      userObj.keys.a = false.keys
    }else if(event.key.toLowerCase()=='s'){
      userObj.keys.s = false
    }else if(event.key.toLowerCase()=='d'){
      userObj.keys.d = false
    }
}, false);







// ANIMATE
function animate() {

    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    users.forEach(user=>{
      if(user.guestControls){
        if(user.shift==true){
          user.guestControls.switchRunToggle()
          user.shift = false

        }
        user.guestControls.update(mixerUpdateDelta, user.keys);
      }
    })

    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);


if(socket && model){
  userObj.position=model.position
console.log('model pos: '+ model.position)
  socket.emit('data',userObj)
  userObj.shift= false

  socket.on('usersAll', data=>{
    // console.log(users)
      data.forEach(user=>{
        if(!ids.includes(user.id)){
          ids.push(user.id)
          loader.load('models/kami.glb', function (gltf) {
           user.model = gltf.scene;
            user.model.traverse(function (object) {
                if (object.isMesh) object.castShadow = true;
            });
        
            user.position = user.model.position
            
            scene.add(user.model);


            user.gltfAnimations = gltf.animations;
            user.mixer = new THREE.AnimationMixer(user.model);
            user.animationsMap = new Map()
            user.gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
            user.animationsMap.set(a.name, user.mixer.clipAction(a))
            })
            user.guestControls = new GuestControls(user.model, user.mixer, user.animationsMap, 'idle')


    
        });
    
          users.push(user)
        }
        if(user.id!=myId){
          users.forEach(u=>{
            if(user.id==u.id){
              console.log(u.model)
              u.position = user.position
              u.model.position.x = user.position.x
              u.model.position.y = user.position.y
              u.model.position.z = user.position.z
              u.shift = user.shift

              u.keys=user.keys
            } 
          })
        }
      })
    
    })
}

}
document.body.appendChild(renderer.domElement);
animate();






//   tick();
};


  



