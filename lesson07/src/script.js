import './style.css'
import * as THREE from 'three'
//import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Cusror
const cursor = {
	x: 0,
	y: 0
}
window.addEventListener('mousemove', (event) => 
{
	cursor.x = event.clientX / sizes.width - 0.5
	cursor.y = - (event.clientY / sizes.height - 0.5)
})

//Scene
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

//Window size
const sizes = {
	width: 800,
	height: 600
}

//Grab canvas
const canvas = document.querySelector('.webgl')

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//const aspectRatio = sizes.width / sizes.height
//const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, -1, 1, 0.1, 100)
//camera.position.x = 2
//camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Clock
const clock = new THREE.Clock()

//gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

//Animation
const tick = () =>
{
	const elapsedTime = clock.getElapsedTime()
//Update object
	//mesh.rotation.x = elapsedTime
	//mesh.rotation.y = elapsedTime

//Update camera
	//camera.position.x = Math.sin(cursor.x * Math.PI *2) * 2
	//camera.position.z = Math.cos(cursor.x * Math.PI *2) * 2
	//camera.position.y = cursor.y * 3
	//camera.lookAt(mesh.position)

//Update controls
	controls.update()

//Render
	renderer.render(scene,camera)

	window.requestAnimationFrame(tick)
}

tick()
