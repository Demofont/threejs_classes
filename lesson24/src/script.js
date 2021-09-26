import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

//Debug
const gui = new dat.GUI({ closed: true })
const debugObject = {}

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Textures
const texureLoader = new THREE.TextureLoader()

//Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

//Material
const material = new THREE.RawShaderMaterial({
	vertexShader: testVertexShader,
	fragmentShader: testFragmentShader
})

//Mesh
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

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(2, 0, 2)
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
