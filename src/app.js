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
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'


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

let clickableObjects = []

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
  callButton.src = "./assets/call-button-pressed.svg";
  kamiTest.style.display = "block";
  kamiTest.play();
  kamiTest.style.objectFit = "fill";
  setTimeout(() => {
    flower.classList.add("scaleUp");
    document.body.innerHTML = "";
    document.body.appendChild(form)
    form.appendChild(avatarImage)
    form.appendChild(nameLabel);
    form.appendChild(nameInput);
    form.appendChild(feelingQuestion)
    form.appendChild(feelingInputStrong);
    form.appendChild(feelingLabelStrong);
    form.appendChild(feelingInputKind);
    form.appendChild(feelingLabelKind);
    form.appendChild(feelingInputCreative);
    form.appendChild(feelingLabelCreative);
    form.appendChild(submitInput);
  }, 
  // 11500
  0
  );
});

callButton.addEventListener("mouseup", () => {
  callButton.src = "./assets/call-button-unpressed.svg";
});






//-----------------input form-------------------------

const avatarImage = document.createElement('img')
avatarImage.src = "./assets/blank.svg"
avatarImage.classList.add('fillAbsolute')

const changeInput = e=>{
  avatarImage.src = `./assets/${e.target.value}.svg`
}

const form = document.createElement('div')
form.style.textAlign = 'center'


const nameLabel = document.createElement("h2");
nameLabel.innerText = "What is your name?"
nameLabel.style.display = "inline"

const nameInput = document.createElement("input");
nameInput.setAttribute("type", "text");
nameInput.style.display = "inline"

const feelingQuestion = document.createElement("h2");
feelingQuestion.innerText = "How are you feeling?"
feelingQuestion.style.display = "inline"
feelingQuestion.style.margin = "0px 0px 0px 50px"

const feelingInputStrong = document.createElement("input")
feelingInputStrong.setAttribute("type", "radio")
feelingInputStrong.name = "feeling"
feelingInputStrong.id = 'strong'
feelingInputStrong.value = 'strong'
feelingInputStrong.style.margin = "0px 0px 0px 10px"
feelingInputStrong.addEventListener("change",changeInput)

const feelingLabelStrong = document.createElement('label')
feelingLabelStrong.for='strong'
feelingLabelStrong.innerText='strong'
feelingLabelStrong.style.margin = "0px 0px 0px 5px"

const feelingInputKind = document.createElement("input")
feelingInputKind.setAttribute("type", "radio")
feelingInputKind.name = "feeling"
feelingInputKind.id = 'kind'
feelingInputKind.value = 'kind'
feelingInputKind.style.margin = "0px 0px 0px 10px"
feelingInputKind.addEventListener("change",changeInput)

const feelingLabelKind = document.createElement('label')
feelingLabelKind.for='kind'
feelingLabelKind.innerText = 'kind'
feelingLabelKind.style.margin = "0px 0px 0px 5px"

const feelingInputCreative = document.createElement("input")
feelingInputCreative.setAttribute("type", "radio")
feelingInputCreative.name = "feeling"
feelingInputCreative.id = 'creative'
feelingInputCreative.value = 'creative'
feelingInputCreative.style.margin = "0px 0px 0px 10px"
feelingInputCreative.addEventListener("change",changeInput)

const feelingLabelCreative = document.createElement('label')
feelingLabelCreative.for='creative'
feelingLabelCreative.innerText='creative'
feelingLabelCreative.style.margin = "0px 0px 0px 5px"


const submitInput = document.createElement("input");
submitInput.setAttribute("type", "submit");
submitInput.value = "ENTER KAMI'S MIND"
submitInput.style.margin = "0px 0px 0px 50px"


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

let modalOpen = false
let dialogueModal = document.createElement('div')
dialogueModal.classList.add('dialogueModal')

let dialogueImage = document.createElement('img')
let dialogueTextBox = document.createElement('div')
let dialogueSpeakerHeader = document.createElement('h3')
let dialogueTextParagraph = document.createElement('p')

dialogueModal.appendChild(dialogueImage)
dialogueModal.appendChild(dialogueTextBox)
dialogueTextBox.appendChild(dialogueSpeakerHeader)
dialogueTextBox.appendChild(dialogueTextParagraph)

const toggleModal = object=>{

  if(modalOpen){
    document.body.removeChild(dialogueModal)
    modalOpen=false
  }else{

    let dialogueImageSource = object.image
    let dialogueSpeaker = object.speaker
    let dialogueText = object.text
    
    
    
    dialogueImage.src = dialogueImageSource
    dialogueImage.width = '150'
    dialogueSpeakerHeader.innerText = dialogueSpeaker
    dialogueTextParagraph.innerText = dialogueText
    

    document.body.appendChild(dialogueModal)
    modalOpen = true
  }

}






//------------------------------------3d-----------------------









const open = () => {
// https://ima-sockets-bec2149551cd.herokuapp.com/
// "http://localhost:5173"
  socket = io.connect("https://ima-sockets-bec2149551cd.herokuapp.com");

  socket.on("connect", () => {
    console.log(`connected via socket`);
    myId=socket.id
    userObj.id= socket.id
    ids.push(myId)
  });

  socketOpen = true
  


//onlineboard

const onlineBoard = document.createElement('div')
onlineBoard.classList.add('onlineBoard')
const onlineHeader = document.createElement('h3')
const onlineList = document.createElement('ul')
onlineHeader.innerText = "Online"
onlineBoard.appendChild(onlineHeader)
onlineBoard.appendChild(onlineList)

document.body.appendChild(onlineBoard)




  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Canvas
  const canvas = document.createElement("canvas");
  canvas.classList += ".webgl";
  document.body.appendChild(canvas);

//textures
const textureLoader = new THREE.TextureLoader()

const fumesTexture = textureLoader.load('assets/fumes.png')
const fumesAlphaTexture = textureLoader.load('assets/fumesAlpha.png')
const AiTexture = textureLoader.load('assets/anotomy.png')
AiTexture.colorSpace = THREE.SRGBColorSpace


  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#D5EFF8')

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

//raycaster

const raycaster = new THREE.Raycaster()

//  mouse

 const mouse = new THREE.Vector2()
window.addEventListener('mousemove',e=>{
    mouse.x = e.clientX /sizes.width *2 -1
    mouse.y = -(e.clientY /sizes.height) *2 +1

})

window.addEventListener('click',()=>{
    if(currentIntersect){
        if(currentIntersect.object===welcomeFumes){
            console.log(' clicked fumes')
            let dialogueObj = {}
            dialogueObj.image = 'assets/fumes.png'
            dialogueObj.speaker = "fumes"
            dialogueObj.text= "Hello friend! \n Click anywhere to close this dialogue."
           
            toggleModal(dialogueObj)
        }
    }else if(modalOpen){
      toggleModal()
    }
})


  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  //floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: "#F89938", side: THREE.DoubleSide })
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  //welcome mat
  const welcomeMat = new THREE.Mesh(
    new THREE.CircleGeometry(5,16),
    new THREE.MeshStandardMaterial({color:0xFFFFFF})
  )
  welcomeMat.rotation.x = -(Math.PI *.5)
  welcomeMat.position.y = 0.01
  welcomeMat.receiveShadow = true;
  scene.add(welcomeMat)

  //welcome fumes
  const fumesMaterial = new THREE.MeshStandardMaterial({color:'white'})
fumesMaterial.map = fumesTexture
fumesMaterial.transparent = true
fumesMaterial.alphaMap = fumesAlphaTexture
fumesMaterial.side = THREE.DoubleSide

  const welcomeFumes = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    fumesMaterial
  )
  welcomeFumes.position.x = -1
    welcomeFumes.position.y = 1
    welcomeFumes.position.z = -3
    welcomeFumes.rotation.y = .2
    welcomeFumes.castShadow = true
    welcomeFumes.recieveShadow = true

  clickableObjects.push(welcomeFumes)
  scene.add(welcomeFumes)

  //welcome sign
  const welcomeSign = new THREE.Group()
  welcomeSign.position.set(-3,1.5,-3.5)
  welcomeSign.rotation.y = .7
    const signMaterial = new THREE.MeshStandardMaterial({color:'#AA6B2D'})


  const welcomeBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.5,1.5,.2),
    signMaterial 
  )
    welcomeBoard.castShadow = true
    welcomeBoard.receiveShadow = true

    const welcomePaper = new THREE.Mesh(
      new THREE.BoxGeometry(2,1,.01),
      new THREE.MeshStandardMaterial({color:'white'})
    )
      welcomePaper.castShadow = true
      welcomePaper.receiveShadow = true
      welcomePaper.position.z = .1

    const welcomeStake = new THREE.Mesh(
      new THREE.BoxGeometry(.1,1,.1),
      signMaterial 
    )
    welcomeStake.position.y=-1
    welcomeStake.castShadow = true
    welcomeStake.receiveShadow = true


  welcomeSign.add(welcomeBoard,welcomeStake,welcomePaper)
  scene.add(welcomeSign)
const aiMapMaterial = new THREE.MeshStandardMaterial({color:'white'})
aiMapMaterial.map=AiTexture
const aiMap = new THREE.Mesh(
  new THREE.PlaneGeometry(8,4),
  aiMapMaterial
)
aiMap.position.y = 3
aiMap.position.z = -10

scene.add(aiMap)




  //----------------scenes---------------



  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );
  dracoLoader.setDecoderConfig({type:'js'})
  loader.setDRACOLoader( dracoLoader );

//bed scene

  loader.load('models/bed.glb', function (gltf) {
    const kamiInBed = gltf.scene;
    kamiInBed.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
    });

    kamiInBed.position.x = 4
    kamiInBed.position.z = 10
    kamiInBed.rotation.y = Math.PI *0.75

    scene.add(kamiInBed);

});


//wire scene

loader.load('models/wire.glb', function (gltf) {
  const wire = gltf.scene;
  wire.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  wire.position.x = -12
  wire.position.z = -20
  wire.rotation.y = .1

  scene.add(wire);

});

//dinner scene

loader.load('models/dinner.glb', function (gltf) {
  const dinner = gltf.scene;
  dinner.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  dinner.position.x = 12
  dinner.position.z = -10
  dinner.rotation.y = Math.PI * .5

  scene.add(dinner);

});












  

  //lights
  const ambientLight = new THREE.AmbientLight("#ffffff", 2.4);
  const sun = new THREE.DirectionalLight(0xffffee, 1)
  sun.castShadow = true;
  sun.position.set(0, 10, 5);
  scene.add(sun, ambientLight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);

  const clock = new THREE.Clock();
  console.log(clock);



// MODEL WITH ANIMATIONS
var characterControls


loader.load(`models/${userObj.feeling}.glb`, function (gltf) {
    model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
        if (object.isMesh) object.receiveShadow = true;
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
      userObj.keys.a = false
    }else if(event.key.toLowerCase()=='s'){
      userObj.keys.s = false
    }else if(event.key.toLowerCase()=='d'){
      userObj.keys.d = false
    }
}, false);




let currentIntersect = null


// ANIMATE
function animate() {
  let mixerUpdateDelta = clock.getDelta();
  let eTime= clock.getElapsedTime();
    

    // rayaster 
    raycaster.setFromCamera(mouse,camera)
    const intersects = raycaster.intersectObjects(clickableObjects)

    if(intersects.length){
      if(currentIntersect===null){
          console.log('mouse enter')
          canvas.style.cursor = "pointer";
      }
      currentIntersect = intersects[0]
  }
  else{
      if(currentIntersect){
          console.log('mouse leave')
          canvas.style.cursor = "auto";
      }
      currentIntersect = null
  }


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

    welcomeFumes.position.y = Math.sin(eTime) * 0.1 +1.5

    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);


if(socket && model){
  userObj.position=model.position
console.log('model pos: '+ model.position)
  socket.emit('data',userObj)
  userObj.shift= false

  
}

}
document.body.appendChild(renderer.domElement);
animate();






//   tick();
socket.on('usersAll', data=>{
  // console.log(users)
  onlineList.innerHTML = ''
  const myUserLI = document.createElement('li')
  myUserLI.innerText = userObj.name + " the " + userObj.feeling
  onlineList.appendChild(myUserLI)
    data.forEach(user=>{
      if(!ids.includes(user.id)){ 
        ids.push(user.id)
        loader.load(`models/${user.feeling}.glb`, function (gltf) {
         user.model = gltf.scene;
          user.model.traverse(function (object) {
              if (object.isMesh) object.castShadow = true;
              if (object.isMesh) object.receiveShadow = true;
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
          if(user.id==u.id && u.model){
            console.log(u.model)
            u.position = user.position
            u.model.position.x = user.position.x
            u.model.position.y = user.position.y
            u.model.position.z = user.position.z
            u.shift = user.shift

            u.keys=user.keys
          } 
     
          const userLI = document.createElement('li')
          userLI.innerText = user.name + " the " + user.feeling
          onlineList.appendChild(userLI)
        })
      }
    })
  
  })
  socket.on('remove',id=>{
    for(let i=0;i<users.length; i++){
      if(users[i].id==id){
        users[i].model.traverse(function (object) {
          if(object.isMesh){
          object.geomery.displose()
          object.material.displose()
          }

      });
        scene.remove(users[i].model)
        users.splice(i,1)
      }
    }
  })
};



  



