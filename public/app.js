
const socket = io();

// console.log(FirstPersonControls)

//flower svg
const flower = document.querySelector('#intro-ground')
let flowerRect = flower.getBoundingClientRect();
let bodyRect = document.body.getBoundingClientRect();

console.log(flowerRect.top - bodyRect.top)

const kamiTest= document.querySelector('#kami-test')
kamiTest.style.bottom = flowerRect.height - (flowerRect.height*0.504) + 'px'
console.log(kamiTest.style)

window.addEventListener('resize',()=>{
    flowerRect = flower.getBoundingClientRect();
    console.log('first: ' +kamiTest.style.bottom)
    console.log('flower: ' +flowerRect.height)
    kamiTest.style.bottom = flowerRect.height - (flowerRect.height*0.5) + 'px'
    console.log('second: ' + kamiTest.style.bottom)
})

//call button
const callButton= document.getElementById('intro-button')

//input form
const nameInput = document.createElement('input')
        nameInput.setAttribute("type","text")
        const submitInput = document.createElement('input')
        submitInput.setAttribute("type","submit")

callButton.addEventListener("mousedown",()=>{
    callButton.src = './static/call-button-pressed.svg'
    kamiTest.style.display = "block"
    kamiTest.play()
    kamiTest.style.objectFit = 'fill'
    setTimeout(()=>{
        flower.classList.add('scaleUp')
        // tick()
        document.body.innerHTML = ''


        
      
        document.body.appendChild(nameInput)
        document.body.appendChild(submitInput)





    }, 1150)
})

submitInput.addEventListener('click',()=>{
        let myName = nameInput.value;
        let nameObj = { "name": myName, "feeling": 'strong' };
 
        //Send the message object to the server
        socket.emit('name', nameObj);
    open()
})

callButton.addEventListener("mouseup",()=>{
    callButton.src = './static/call-button-unpressed.svg'
})
// let controls = null
const open = ()=>{


    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    // Canvas
    const canvas = document.createElement('canvas')
    canvas.classList +='.webgl'
    document.body.appendChild(canvas)
    
    
    // Scene
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.y = 2
    camera.position.z = 5
    scene.add(camera)
    document.body.removeChild(nameInput)
    document.body.removeChild(submitInput)

        // Controls
// controls = new FirstPersonControls(camera, renderer.domElement)
// controls.movementSpeed = 150;
// 				controls.lookSpeed = 0.1;

    //placeholder character
    const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color: '#b2b6b1'}))
    box.position.y=0.5
    box.castShadow = true
    scene.add(box)

    //floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color:'green',side: THREE.DoubleSide}))
    floor.rotation.x = - Math.PI * 0.5
    floor.position.y = 0
    floor.receiveShadow = true
    scene.add(floor)

    //lights
    const ambientLight = new THREE.AmbientLight('#ffd599', 1)
    const sun = new THREE.PointLight('#ffd599', 5)
    sun.castShadow = true
    sun.position.set(4, 5, - 2)
    scene.add(sun)
    
    renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.render(scene, camera)
    tick()
}
    


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // controls.update()

    window.requestAnimationFrame(tick)
}




//sockets

socket.on("connect", (socket) => {
console.log("connected")
});


