import * as THREE from 'three'


let open = false;

//call button
const callButton= document.getElementById('intro-button')
callButton.addEventListener("mousedown",()=>{
    callButton.src = '/static/call-button-pressed.svg'
})

callButton.addEventListener("mouseup",()=>{
    callButton.src = '/static/call-button-unpressed.svg'
})

//flower svg
const flower = document.querySelector('#intro-ground')
let flowerRect = flower.getBoundingClientRect();
let bodyRect = document.body.getBoundingClientRect();

console.log(flowerRect.top - bodyRect.top)

const kamiTest= document.querySelector('#kami-test')
kamiTest.style.bottom = flowerRect.height + 'px'
console.log(kamiTest.style)

window.addEventListener('resize',()=>{
    flowerRect = flower.getBoundingClientRect();
    console.log('first: ' +kamiTest.style.bottom)
    console.log('flower: ' +flowerRect.height)
    kamiTest.style.bottom = flowerRect.height - (flowerRect.height*0.5) + 'px'
    console.log('second: ' + kamiTest.style.bottom)
})

if(open){
    // Canvas
    const canvas = document.querySelector('canvas.webgl')
    
    
    // Scene
    const scene = new THREE.Scene()
}
