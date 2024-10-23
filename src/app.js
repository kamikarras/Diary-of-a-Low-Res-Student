import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CharacterControls } from './characterControls';
import { createOnlineBoard } from './OnlineBoard'
import { GuestControls } from './guestControls';
import { KeyDisplay } from './utils';
import { Text } from 'troika-three-text';
import * as THREE from "three";
import io from "socket.io-client";



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


let users = []
let ids = []
let myId = ''

let clickableObjects = []



//-------------------intro page--------------------------------


//flower svg
const flower = document.querySelector("#intro-ground");
let flowerRect = flower.getBoundingClientRect();


const kamiTest = document.querySelector("#kami-test");
kamiTest.style.bottom = flowerRect.height - flowerRect.height * 0.504 + "px";

window.addEventListener("resize", () => {
  flowerRect = flower.getBoundingClientRect();
  kamiTest.style.bottom = flowerRect.height - flowerRect.height * 0.5 + "px";
});

//call button
const callButton = document.getElementById("intro-button");
const hello = document.getElementById("intro-hello");


callButton.addEventListener("mousedown", () => {
  callButton.src = "./assets/call-button-pressed.svg";
  kamiTest.style.display = "block";
  flower.classList.add("fadeOut");
  hello.classList.add("fadeOut");
  callButton.classList.add("fadeOut");
  kamiTest.play();
  kamiTest.style.objectFit = "fill";
  setTimeout(() => {
    
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
  // 11700
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
const clickInput = e=>{
  avatarImage.src = `./assets/${e.target.for}.svg`
  feelingLabelStrong.classList.remove('selected')
  feelingLabelKind.classList.remove('selected')
  feelingLabelCreative.classList.remove('selected')
    
  feelingLabelStrong.style.color="black"
  feelingLabelKind.style.color="black"
  feelingLabelCreative.style.color="black"
  e.target.classList.add('selected')
  e.target.style.color="white"
}

const form = document.createElement('div')
form.style.textAlign = 'center'
form.style.marginTop = '50px'


const nameLabel = document.createElement("h2");
nameLabel.innerText = "What is your name?"
nameLabel.style.display = "inline"

const nameInput = document.createElement("input");
nameInput.setAttribute("type", "text");
nameInput.style.display = "inline"
nameInput.id = "nameInput"

const feelingQuestion = document.createElement("h2");
feelingQuestion.innerText = "How are you feeling?"
feelingQuestion.style.display = "inline"
feelingQuestion.style.margin = "0px 30px 0px 100px"

const feelingInputStrong = document.createElement("input")
feelingInputStrong.setAttribute("type", "radio")
feelingInputStrong.name = "feeling"
feelingInputStrong.id = 'strong'
feelingInputStrong.value = 'strong'
feelingInputStrong.style.margin = "0px 0px 0px 10px"
feelingInputStrong.addEventListener("change",changeInput)

const feelingLabelStrong = document.createElement('label')
feelingLabelStrong.htmlFor="strong"
feelingLabelStrong.innerHTML=feelingInputStrong
feelingLabelStrong.id='strongLabel'
feelingLabelStrong.innerText='strong'
feelingLabelStrong.style.margin = "0px 0px 0px 5px"
feelingLabelStrong.addEventListener('click', clickInput)
feelingLabelStrong.classList.add('feelingLabel')


const feelingInputKind = document.createElement("input")
feelingInputKind.setAttribute("type", "radio")
feelingInputKind.name = "feeling"
feelingInputKind.id = 'kind'
feelingInputKind.value = 'kind'
feelingInputKind.style.margin = "0px 0px 0px 10px"
feelingInputKind.addEventListener("change",changeInput)

const feelingLabelKind = document.createElement('label')
feelingLabelKind.htmlFor='kind'
feelingLabelKind.innerText = 'kind'
feelingLabelKind.style.margin = "0px 0px 0px 5px"
feelingLabelKind.classList.add('feelingLabel')

feelingLabelKind.addEventListener('click', clickInput)

const feelingInputCreative = document.createElement("input")
feelingInputCreative.setAttribute("type", "radio")
feelingInputCreative.name = "feeling"
feelingInputCreative.id = 'creative'
feelingInputCreative.value = 'creative'
feelingInputCreative.style.margin = "0px 0px 0px 10px"
feelingInputCreative.addEventListener("change",changeInput)

const feelingLabelCreative = document.createElement('label')
feelingLabelCreative.htmlFor='creative'
feelingLabelCreative.innerText='creative'
feelingLabelCreative.style.margin = "0px 0px 0px 5px"
feelingLabelCreative.classList.add('feelingLabel')

feelingLabelCreative.addEventListener('click', clickInput)


const submitInput = document.createElement("input");
submitInput.setAttribute("type", "submit");
submitInput.value = "ENTER KAMI'S MIND"
submitInput.style.margin = "0px 0px 0px 50px"
submitInput.id = "submitInput"


submitInput.addEventListener("click", () => {
  const radioButtons = document.querySelectorAll('input[name="feeling"]');
  radioButtons.forEach(radio=>{
    if(radio.checked==true){
      userObj.feeling = radio.value
      if(userObj.feeling=='creative'){
        userObj.r = 0
        userObj.g = 1
        userObj.b = 0
      }else if(userObj.feeling=='kind'){
        userObj.r = 0
        userObj.g = 1
        userObj.b = 1
      }
      else if(userObj.feeling=='strong'){
        userObj.r = 1
        userObj.g = 0
        userObj.b = 1
      }
    }
  })
  if(!userObj.feeling){
    return
  }
  let myName = nameInput.value;
  userObj.name = myName
 


  document.body.innerHTML = ''

  const displayName = document.createElement('h1')
  displayName.innerText = userObj.name 
  displayName.classList.add('displayName')
  // document.body.appendChild(displayName)
  const displayFeeling = document.createElement('p')
  displayFeeling.innerText = "the " + userObj.feeling
  displayFeeling.classList.add('displayFeeling')
  // document.body.appendChild(displayFeeling)
  


 
  

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
  socket = io.connect("https://diary-of-a-low-res-student-23ca922138a4.herokuapp.com/");

  socket.on("connect", () => {
    console.log(`connected via socket`);
    myId=socket.id
    userObj.id= socket.id
    ids.push(myId)
  });


  


//onlineboard
// createOnlineBoard()
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
fumesTexture.colorSpace = THREE.SRGBColorSpace
const fumesAlphaTexture = textureLoader.load('assets/fumesAlpha.png')
const AiTexture = textureLoader.load('assets/anotomy.png')
AiTexture.colorSpace = THREE.SRGBColorSpace

const cantTexture = textureLoader.load('assets/cant.png')
const cantAlphaTexture = textureLoader.load('assets/cantAlpha.png')
cantTexture.colorSpace = THREE.SRGBColorSpace

const amberTexture = textureLoader.load('assets/amber.png')
amberTexture.colorSpace = THREE.SRGBColorSpace
const amberAlphaTexture = textureLoader.load('assets/amberAlpha.png')

const wiresTexture = textureLoader.load('assets/wires.png')
wiresTexture.colorSpace = THREE.SRGBColorSpace
const wiresAlphaTexture = textureLoader.load('assets/wiresAlpha.png')


const bagImgs1Texture = textureLoader.load('assets/bagImgs1.png')
bagImgs1Texture.colorSpace = THREE.SRGBColorSpace
const bagImgs1AlphaTexture = textureLoader.load('assets/bagImgs1Alpha.png')

const bagImgs2Texture = textureLoader.load('assets/bagImgs2.png')
bagImgs2Texture.colorSpace = THREE.SRGBColorSpace
const bagImgs2AlphaTexture = textureLoader.load('assets/bagImgs2Alpha.png')

const groundNormalTexture = textureLoader.load('assets/ground.jpg')
groundNormalTexture.colorSpace = THREE.SRGBColorSpace
groundNormalTexture.wrapS = THREE.RepeatWrapping
groundNormalTexture.wrapT = THREE.RepeatWrapping
groundNormalTexture.repeat.set(600,600)

const bricksNormalTexture = textureLoader.load('assets/bricksNormal.png')
bricksNormalTexture.colorSpace = THREE.SRGBColorSpace
bricksNormalTexture.wrapS = THREE.RepeatWrapping
bricksNormalTexture.wrapT = THREE.RepeatWrapping
bricksNormalTexture.repeat.set(10,10)

const bricksAmbientOcclusionTexture = textureLoader.load('assets/bricksAmbientOcclusion.png')
bricksAmbientOcclusionTexture.colorSpace = THREE.SRGBColorSpace
bricksAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
bricksAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
bricksAmbientOcclusionTexture.repeat.set(10,10)




// ---------------text-------------


const nameText = new Text();
nameText.fontSize = 0.14;
nameText.font =  '/assets/PixelifySans.ttf';
nameText.outlineColor = 0xffffff;
nameText.outlineWidth = 0.1
nameText.color = 0x000000;
nameText.anchorX = 'center';
nameText.anchorY = 'middle';
nameText.text = userObj.name

const feelingText = new Text();
feelingText.fontSize = 0.09;
feelingText.font =  '/assets/PixelifySans.ttf';
feelingText.outlineColor = 0xffffff;
feelingText.outlineWidth = 0.1
feelingText.color = 0x000000;
feelingText.anchorX = 'center';
feelingText.anchorY = 'middle';
feelingText.text = "the " + userObj.feeling






  // -----------------------Scene------------------

//load background
const scene = new THREE.Scene();

new RGBELoader()
  .load('assets/sky.hdr', function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture
    scene.environment = texture
  })

 
  scene.add(nameText, feelingText);
  

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.type = THREE.PCFShadowmapping

  renderer.toneMappingExposure = 0.4

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    200
  );
  camera.position.y = 2.5;
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
            let dialogueObj = {}
            dialogueObj.image = 'assets/fumes.png'
            dialogueObj.speaker = "fumes"
            dialogueObj.text= "Hello friend! \n Click anywhere to close this dialogue."
           
            toggleModal(dialogueObj)
            

        } if(currentIntersect.object==welcomeBoard){
          let dialogueObj = {}
          dialogueObj.image = 'assets/sign.png'
          dialogueObj.speaker = "sign"
          dialogueObj.text= "Welcome to Kami's memories. This is where Kami stores her memories as student at NYU in the IMA Low Res Program. \n \n made with: three.js, blender, Illustrator, socket.io, mongodb and feelings."
         
          toggleModal(dialogueObj)
          

      }
    }else if(modalOpen){
      toggleModal()
    }
})


  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 20
  controls.maxPolarAngle = Math.PI * 0.5



  //floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: "#F89938", side: THREE.DoubleSide, normalMap: groundNormalTexture, normalScale: new THREE.Vector2(0.005,0.005) })
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0.01;
  floor.receiveShadow = true;
  scene.add(floor);
  const floor2 = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: "#260", side: THREE.DoubleSide })
  );
  floor2.rotation.x = -Math.PI * 0.5;
  floor2.position.y = -.001;
  floor2.receiveShadow = true;
  scene.add(floor2);

  //welcome mat
  const welcomeMat = new THREE.Mesh(
    new THREE.PlaneGeometry(7,7),
    new THREE.MeshStandardMaterial({color:0xF15B66})
  )
  welcomeMat.rotation.x = -(Math.PI *.5)
  welcomeMat.position.y = 0.02
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
  welcomeFumes.position.x = 1
    welcomeFumes.position.y = 1
    welcomeFumes.position.z = -3
    welcomeFumes.rotation.y = -.2
    welcomeFumes.castShadow = true
    welcomeFumes.recieveShadow = true

  // clickableObjects.push(welcomeFumes)
  // scene.add(welcomeFumes)



  //I can't do this
  const cantMaterial = new THREE.MeshStandardMaterial({color:'white'})
cantMaterial.map = cantTexture
cantMaterial.transparent = true
cantMaterial.alphaMap = cantAlphaTexture
cantMaterial.side = THREE.DoubleSide

  const cantMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(4,2),
    cantMaterial
  )
cantMesh.position.x = 9
cantMesh.position.z = -28
cantMesh.position.y = 2
cantMesh.rotation.y = Math.PI *2

cantMesh.castShadow = true
cantMesh.recieveShadow = true


  scene.add(cantMesh)



    //amber
    const amberMaterial = new THREE.MeshStandardMaterial({color:'white'})
    amberMaterial.map = amberTexture
    amberMaterial.transparent = true
    amberMaterial.alphaMap = amberAlphaTexture
    amberMaterial.side = THREE.DoubleSide
    
      const amberMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5,3),
        amberMaterial
      )
    amberMesh.position.x = 14
    amberMesh.position.z = -22
    amberMesh.position.y = 1.4
    amberMesh.rotation.y = Math.PI
    
    amberMesh.castShadow = true
    amberMesh.recieveShadow = true
    
    
      scene.add(amberMesh)


          //wires photos
    const wiresMaterial = new THREE.MeshStandardMaterial({color:'white'})
    wiresMaterial.map = wiresTexture
    wiresMaterial.transparent = true
    wiresMaterial.alphaMap = wiresAlphaTexture
    wiresMaterial.side = THREE.DoubleSide
    
      const wiresMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(6,3),
        wiresMaterial
      )
    wiresMesh.position.x = -12
    wiresMesh.position.z = -23
    wiresMesh.position.y = 3
    wiresMesh.rotation.y = Math.PI *2
    
    wiresMesh.castShadow = true
    wiresMesh.recieveShadow = true
    
    
      scene.add(wiresMesh)



          //bag photos
    const bagImgs1Material = new THREE.MeshStandardMaterial({color:'white'})
    bagImgs1Material.map = bagImgs1Texture
    bagImgs1Material.transparent = true
    bagImgs1Material.alphaMap = bagImgs1AlphaTexture
    
      const bagImgs1Mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(9,2),
        bagImgs1Material
      )
    bagImgs1Mesh.position.x = -12
    bagImgs1Mesh.position.z = 10
    bagImgs1Mesh.position.y = 3
    bagImgs1Mesh.rotation.y = Math.PI *-0.5
    
    bagImgs1Mesh.castShadow = true
    bagImgs1Mesh.recieveShadow = true

    const bagImgs2Material = new THREE.MeshStandardMaterial({color:'white'})
    bagImgs2Material.map = bagImgs2Texture
    bagImgs2Material.transparent = true
    bagImgs2Material.alphaMap = bagImgs2AlphaTexture
    
      const bagImgs2Mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(9,2),
        bagImgs2Material
      )
    bagImgs2Mesh.position.x = -23
    bagImgs2Mesh.position.z = 10
    bagImgs2Mesh.position.y = 3
    bagImgs2Mesh.rotation.y = Math.PI*0.5
    
    bagImgs2Mesh.castShadow = true
    bagImgs2Mesh.recieveShadow = true
    
    
      scene.add(bagImgs1Mesh, bagImgs2Mesh)



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
    // clickableObjects.push(welcomeBoard)

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

  // scene.add(welcomeSign)

  //welcome text


loader.load('models/welcomeText.glb', function (gltf) {
  const welcomeText = gltf.scene;
  welcomeText.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
      if(object.material){
        object.material.dithering = true
        object.material.color.convertSRGBToLinear();
      }
    
  });

  welcomeText.position.x = 0
  welcomeText.position.z = -5.5
  welcomeText.position.y = 1
  // welcomeText.rotation.y = Math.PI *1.5

  scene.add(welcomeText);

});



  //wiree text


  loader.load('models/wireText.glb', function (gltf) {
    const wireText = gltf.scene;
    wireText.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        
    });
  
    wireText.position.x = -16.5
    wireText.position.z = -20
    wireText.position.y = 0
    wireText.rotation.y = Math.PI *.25
  
    scene.add(wireText);
  
  });



const aiMapMaterial = new THREE.MeshStandardMaterial({color:'white',side: THREE.DoubleSide})
aiMapMaterial.map=AiTexture
const aiMap = new THREE.Mesh(
  new THREE.PlaneGeometry(16,8),
  aiMapMaterial
)
aiMap.position.y = 5
aiMap.position.z = -30
aiMap.position.x = 30
aiMap.rotation.y = Math.PI * -0.25

scene.add(aiMap)




  //tree


  loader.load('models/tree1.glb', function (gltf) {
    const tree11 = gltf.scene;
    tree11.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree11.position.x = 4
    tree11.position.z = 45
  
    scene.add(tree11);
  
  });

  loader.load('models/tree1.glb', function (gltf) {
    const tree12 = gltf.scene;
    tree12.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree12.position.x = 7
    tree12.position.z = 54
    tree12.rotation.y = Math.PI 
  
    scene.add(tree12);
  
  });

  loader.load('models/tree1.glb', function (gltf) {
    const tree13 = gltf.scene;
    tree13.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree13.position.x = 15
    tree13.position.z = 50
    tree13.rotation.y = Math.PI *0.5
  
    scene.add(tree13);
  
  });
  
  


  loader.load('models/tree1.glb', function (gltf) {
    const tree14 = gltf.scene;
    tree14.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree14.position.z = 4
    tree14.position.x = -45
  
    scene.add(tree14);
  
  });

  loader.load('models/tree1.glb', function (gltf) {
    const tree15 = gltf.scene;
    tree15.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree15.position.z = 7
    tree15.position.x = -35
    tree15.rotation.y = Math.PI 
  
    scene.add(tree15);
  
  });

  loader.load('models/tree1.glb', function (gltf) {
    const tree16 = gltf.scene;
    tree16.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        if(object.material){
          object.material.dithering = true
          object.material.color.convertSRGBToLinear();
        }
      
    });
  
    tree16.position.z = 15
    tree16.position.x = -40
    tree16.rotation.y = Math.PI *0.5
  
    scene.add(tree16);
  
  });
  
  



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
    kamiInBed.position.z = -28
    kamiInBed.rotation.y = Math.PI *1.5

    scene.add(kamiInBed);

});






//building scene

let buildingMaterial = new THREE.MeshStandardMaterial({ color: "#aaa", side: THREE.DoubleSide, normalMap: bricksNormalTexture, normalScale: new THREE.Vector2(0.1,0.1), aoMap: bricksAmbientOcclusionTexture})

  loader.load('models/buildings.glb', function (gltf) {
    const buildings = gltf.scene;
    buildings.traverse(function (object) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material = buildingMaterial;
    });

    buildings.scale.set(0.5,0.15,0.5)



    scene.add(buildings);

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

//sewing scene

loader.load('models/sewing.glb', function (gltf) {
  const sewing = gltf.scene;
  sewing.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  sewing.position.x = -17.5
  sewing.position.y = 0.2
  sewing.position.z = 8
  sewing.rotation.y = Math.PI 

  scene.add(sewing);

});

//dinner scene

loader.load('models/dinner.glb', function (gltf) {
  const dinner = gltf.scene;
  dinner.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  dinner.position.x = 12
  dinner.position.z = -22
  dinner.rotation.y = Math.PI * .5

  scene.add(dinner);

});

//bag scene

loader.load('models/bag.glb', function (gltf) {
  const bag = gltf.scene;
  bag.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  bag.scale.set(3,3,3)
  bag.position.x = -18
  bag.position.z = 10
  bag.rotation.y = Math.PI * .5

  scene.add(bag);

});

let gf;

let mixer = null;
//network gf scene
loader.load('models/networkGF.glb', function (gltf) {
  gf = gltf.scene;
  const animations = gltf.animations
  gf.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;

  });

  gf.position.x = 14
  gf.position.y = 9
  gf.position.z = 14
  gf.lookAt(0,0,0)

  mixer = new THREE.AnimationMixer(gf)

  animations.forEach(animation=>{
      mixer.clipAction(animation).play()
  })



  scene.add(gf);

});
//network gf text scene

loader.load('models/gfText.glb', function (gltf) {
  const gfText = gltf.scene;
  gfText.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  gfText.position.x = 14
  gfText.position.z = 16
  gfText.rotation.y = Math.PI *1.3

  scene.add(gfText);

});



//ponk scene

loader.load('models/ponk.glb', function (gltf) {
  const ponk = gltf.scene;
  ponk.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  // ponk.scale.set(3,3,3)
  ponk.position.x = 28
  ponk.position.z = -5
  ponk.rotation.y = Math.PI * -.5

  scene.add(ponk);

});


//ponk text scene

loader.load('models/ponkText.glb', function (gltf) {
  const ponkText = gltf.scene;
  ponkText.traverse(function (object) {
      object.castShadow = true;
      object.receiveShadow = true;
  });

  ponkText.position.x = 20.2
  ponkText.position.z = -5.5
  ponkText.position.y = 5
  ponkText.rotation.y = Math.PI *1.5

  scene.add(ponkText);

});

//fence system

let fencePost = new THREE.InstancedMesh(
  new THREE.BoxGeometry(0.3,2,0.3),
  new THREE.MeshStandardMaterial({color:'white'}),
  240
)
// fencePost.position.y = 1
fencePost.position.z = -30
fencePost.position.x = -30

for(let i=-10;i<60;i+=2){
//------
const dummy = new THREE.Matrix4()
const x = i
const y = 1
const z = 0
dummy.setPosition(x,y,z)

fencePost.setMatrixAt(i,dummy)

}
for(let i=1;i<60;i+=2){
  //------
  if(i>16&&i<34){

  }else{
    const dummy = new THREE.Matrix4()
    const x = 60
    const y = 1
    const z = i
    dummy.setPosition(x,y,z)

    fencePost.setMatrixAt(i+60,dummy)
  }
  
  
  }

  for(let i=1;i<60;i+=2){
    //------
    const dummy = new THREE.Matrix4()
    const x = i
    const y = 1
    const z = 60
    dummy.setPosition(x,y,z)
    
    fencePost.setMatrixAt(i+120,dummy)
    
    }

    for(let i=1;i<60;i+=2){
      //------
      const dummy = new THREE.Matrix4()
      const x = 0
      const y = 1
      const z = i
      dummy.setPosition(x,y,z)
      
      fencePost.setMatrixAt(i+180,dummy)
      
      }



scene.add(fencePost)

const fenceBoardNorth = new THREE.Mesh(
  new THREE.BoxGeometry(60,.2,.1),
  new THREE.MeshStandardMaterial({color:"white"})
)
fenceBoardNorth.position.x = 0
fenceBoardNorth.position.z = -30
fenceBoardNorth.position.y =1.5

scene.add(fenceBoardNorth)


const fenceBoardSouth = new THREE.Mesh(
  new THREE.BoxGeometry(60,.2,.1),
  new THREE.MeshStandardMaterial({color:"white"})
)
fenceBoardSouth.position.x = 0
fenceBoardSouth.position.z = 30
fenceBoardSouth.position.y =1.5

scene.add(fenceBoardSouth)


const fenceBoardWest = new THREE.Mesh(
  new THREE.BoxGeometry(.1,.2,60),
  new THREE.MeshStandardMaterial({color:"white"})
)
fenceBoardWest.position.x = -30
fenceBoardWest.position.z = 0
fenceBoardWest.position.y =1.5

scene.add(fenceBoardWest)


const fenceBoardEast1 = new THREE.Mesh(
  new THREE.BoxGeometry(.1,.2,24),
  new THREE.MeshStandardMaterial({color:"white"})
)
fenceBoardEast1.position.x = 30
fenceBoardEast1.position.z = 17
fenceBoardEast1.position.y =1.5

scene.add(fenceBoardEast1)


const fenceBoardEast2 = new THREE.Mesh(
  new THREE.BoxGeometry(.1,.2,16),
  new THREE.MeshStandardMaterial({color:"white"})
)
fenceBoardEast2.position.x = 30
fenceBoardEast2.position.z = -22
fenceBoardEast2.position.y =1.5

scene.add(fenceBoardEast2)



//flower instancedMesh system

let geometry = null
let material = null
let flowerMesh = null;

//flower scene

const generateFlowers = (flowers)=>{
  if(flowerMesh!==null){
    geometry.dispose()
    material.dispose()
    scene.remove(flowerMesh)
}

  const positions = new Float32Array(flowers.positions)
  const colors = new Float32Array(flowers.colors)
  

  loader.load('models/flower.glb', function (gltf) {
    const flowerModel = gltf.scene;
    flowerModel.traverse(function (object) {
      
      object.castShadow = true;
      object.receiveShadow = true;
  });
    const mesh = flowerModel.getObjectByName("cat")
    mesh.castShadow = true;
      mesh.receiveShadow = true;
    
    geometry = mesh.geometry.clone()
    material = mesh.material

    flowerMesh = new THREE.InstancedMesh(geometry,material,positions.length)
    flowerMesh.castShadow = true;
      flowerMesh.receiveShadow = true;


      for(let i=0;i<positions.length;i+=3){
        const dummy = new THREE.Matrix4()
        const color = new THREE.Color()
        const x = positions[i]
        const y = Math.random(0) *0.3
        const z = positions[i+2]
        dummy.setPosition(x,y,z)

        if(colors[i+1]=='1'&&colors[i+2]=='0'){
          
          flowerMesh.setColorAt(i, color.set(0.5,0.1,1));
        }else{
          flowerMesh.setColorAt(i, color.set(colors[i],colors[i+1],colors[i+2]));
        }
        flowerMesh.setMatrixAt(i,dummy)
      }
      scene.add(flowerMesh)  
      
    });

}





window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})




  

  //lights
  const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
  const sun = new THREE.DirectionalLight(0xffffee, 3)
  sun.castShadow = true;
  sun.position.set(0, 10, 5);
  let side = 50
  sun.shadow.camera.left = side
  sun.shadow.camera.top = side
  sun.shadow.camera.right = -side
  sun.shadow.camera.bottom = -side


  const ponkLight = new THREE.PointLight(0xff00ff, 3)
  ponkLight.position.x = 28
  ponkLight.position.y = 2
  ponkLight.position.z = -5

  scene.add(sun, ambientLight, ponkLight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.render(scene, camera);

  const clock = new THREE.Clock();



// MODEL WITH ANIMATIONS
var characterControls


loader.load(`models/${userObj.feeling}.glb`, function (gltf) {
    model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
        if (object.isMesh) object.receiveShadow = true;
        if(object.material && object.material.name=="Material.003"&&userObj.feeling=="creative"){
          object.material.color.set(0.2,0,1)

        }
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
   

let running = false;
// CONTROL KEYS
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls && running==false) {
        characterControls.switchRunToggle()
        userObj.shift = true
        running=true
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
        else if(event.key.toLowerCase()=='f'){
          socket.emit('plantFlower',userObj)

        }
        
    }
}, false);
document.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase()=='shift' && characterControls) {
    characterControls.switchRunToggle()
    userObj.shift = true
    running=false
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
    
  if(mixer)
    {
        mixer.update(mixerUpdateDelta)
    }
  if(gf&&model){
    gf.lookAt(model.position)
  }

    // rayaster 
    raycaster.setFromCamera(mouse,camera)
    const intersects = raycaster.intersectObjects(clickableObjects)

    if(intersects.length){
      if(currentIntersect===null){
          canvas.style.cursor = "pointer";
      }
      currentIntersect = intersects[0]
  }
  else{
      if(currentIntersect){
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

    // welcomeFumes.position.y = Math.sin(eTime) * 0.1 +1.5


    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);


if(socket && model){
  nameText.position.set(model.position.x, 3.5, model.position.z);
  nameText.lookAt(camera.position)
  feelingText.position.set(model.position.x, 3.3, model.position.z);
  feelingText.lookAt(camera.position)
  userObj.position=model.position
  socket.emit('data',userObj)
  
  userObj.shift= false

  
}

}

document.body.appendChild(renderer.domElement);

animate();






//   tick();
socket.on('usersAll', data=>{
  onlineList.innerHTML = ''
  const myUserLI = document.createElement('li')
  myUserLI.innerText = userObj.name + " - the " + userObj.feeling
  onlineList.appendChild(myUserLI)
    data.forEach(user=>{
      if(!ids.includes(user.id)){ 
        ids.push(user.id)
        loader.load(`models/${user.feeling}.glb`, function (gltf) {

         user.model = gltf.scene;
         user.nameText = new Text()
         user.nameText.fontSize = 0.14;
         user.nameText.font = '/assets/PixelifySans.ttf';
         user.nameText.outlineColor = 0xffffff;
         user.nameText.outlineWidth = 0.1
         user.nameText.color = 0x000000;
         user.nameText.anchorX = 'center';
         user.nameText.anchorY = 'middle';
         user.nameText.text = user.name

         user.feelingText = new Text();
         user.feelingText.fontSize = 0.09;
         user.feelingText.font =  '/assets/PixelifySans.ttf';
         user.feelingText.outlineColor = 0xffffff;
         user.feelingText.outlineWidth = 0.1
         user.feelingText.color = 0x000000;
         user.feelingText.anchorX = 'center';
         user.feelingText.anchorY = 'middle';
         user.feelingText.text = "the " + user.feeling

          user.model.traverse(function (object) {
              if (object.isMesh) object.castShadow = true;
              if (object.isMesh) object.receiveShadow = true;

              if(object.material && object.material.name=="Material.003"&&user.feeling=="creative"){
                object.material.color.set(0.2,0,1)
      
              }

          });
      
          user.position = user.model.position
          
          scene.add(user.model, user.nameText, user.feelingText);


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
          if(user.id==u.id && u.model && u.nameText){
            u.position = user.position
            u.model.position.x = user.position.x
            u.model.position.y = user.position.y
            u.model.position.z = user.position.z
            u.shift = user.shift

            u.keys=user.keys

            u.nameText.position.set(user.position.x, 3.5, user.position.z)
            u.feelingText.position.set(user.position.x, 3.35, user.position.z)
            u.nameText.lookAt(camera.position)
            u.feelingText.lookAt(camera.position)
          } 
     
          const userLI = document.createElement('li')
          userLI.innerText = user.name + " - the " + user.feeling
          onlineList.appendChild(userLI)
        })
      }
    })
  
  })

  socket.emit('getFlowers',userObj)

  socket.on('allFlowers',data=>{


      generateFlowers(data)

  })


  socket.on('remove',id=>{
    for(let i=0;i<users.length; i++){
      if(users[i].id==id){

        scene.remove(users[i].model)
        scene.remove(users[i].nameText)
        scene.remove(users[i].feelingText)
        users.splice(i,1)
      }
    }
  })
};



  



