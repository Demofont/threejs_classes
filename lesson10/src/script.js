import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

//Debug
const gui = new dat.GUI({ closed: true})
//gui.hide()

const parameters = {
	color: 0xff0000,
	spin: () =>
	{
		gsap.to(mesh.rotation,
		{ 
			duration: 1,
			y: mesh.rotation.y + 10
		})
	}
}


gui
	.addColor(parameters, 'color')
	.onChange(() =>
	{
		material.color.set(parameters.color)
	})
gui
	.add(parameters, 'spin')

//Scene
const scene = new THREE.Scene()

//Object
const geometry = new THREE.BoxGeometry(1, 1, 1)

const material = new THREE.MeshBasicMaterial({
	color: 0xff0000, 
	//wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

//Debug
gui
	.add(mesh.position, 'y')
	.min(-3)
	.max(3)
	.step(0.01)
	.name('elevation')

gui
	.add(mesh, 'visible')

//Window size
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

//Adaptive canvas
window.addEventListener('resize', () =>
{
	//Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	//Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	//Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
})

//FullScreenMode
window.addEventListener('dblclick', () =>
{
	const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

	if(!document.fullscreenElement)
	{
		if(canvas.requestFullscreen)
		{
			canvas.requestFullscreen()
		}
		else if(canvas.webkitRequestFullscreen)
		{
			canvas.webkitRequestFullscreen()
		}
	}
	else
	{
		if(document.exitFullscreen)
		{
			document.exitFullscreen()
		}
		else if(document.webkitExitFullscreen)
		{
			document.webkitExitFullscreen()
		}
	}
})

//Grab canvas
const canvas = document.querySelector('.webgl')

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))

//Clock
const clock = new THREE.Clock()


//Animation
const tick = () =>
{
	const elapsedTime = clock.getElapsedTime()
	//Update object
	//mesh.rotation.x = elapsedTime
	//mesh.rotation.y = elapsedTime

	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	window.requestAnimationFrame(tick)
}

tick()
