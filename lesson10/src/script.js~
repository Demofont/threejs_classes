import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Scene
const scene = new THREE.Scene()

//Object
//const geometry = new THREE.BoxGeometry(1, 1, 1)

const geometry = new THREE.BufferGeometry()

const count = 50
const positionsArray = new Float32Array(count * 3 * 3)

for(let i = 0; i < count * 3 * 3; i++)
{
	positionsArray[i] = (Math.random() - 0.5) * 4
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

//const geometry = new THREE.Geometry()

//const vertex1 = new THREE.Vector3(0, 0, 0)
//geometry.vertices.push(vertex1)

//const vertex2 = new THREE.Vertex3(0, 1, 0)
//geometry.vertices.push(vertex2)

//const vertex3 = new THREE.Vertex3(1, 0, 0)
//geometry.verteces.push(vertex3)

//const face = new THREE.Face3(0, 1, 2)
//geometry.faces.push(face)

const material = new THREE.MeshBasicMaterial({
	color: 0xff0000, 
	wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

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
controls.enablePan = false

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
