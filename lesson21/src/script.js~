import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//Debug
const gui = new dat.GUI()

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Models
const gltfLoader = new GLTFLoader()
gltfLoader.load(
	'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	(gltf) =>
	{
		const children = [...gltf.scene.children]
		for(const child of children)
		{
			scene.add(child)
		}

		//scene.add(gltf.scene)
	}
)


//Materials
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.2


//Textures

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('textures/simpleShadow.jpg')

//Objescts
const plane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(10, 10),
	material
)
plane.rotation.x = Math.PI * 1.5
plane.position.y = -0.5

scene.add(plane)

//Lights
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight()
directionalLight.color = new THREE.Color(0xffffff)
directionalLight.intensity = 0.3
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight)

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

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
//camera.lookAt(sphere.position)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))

renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Clock
const clock = new THREE.Clock()

//Animation
const tick = () =>
{
	const elapsedTime = clock.getElapsedTime()
	
	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	//Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
