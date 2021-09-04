import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Debug
const gui = new dat.GUI()

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Textures
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/9.png')

//Particles
//Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
//const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++)
{
	
	positions[i] = (Math.random() - 0.5) * 10
//	colors[i] = Math.random()
}

particlesGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(positions, 3)
)
//particlesGeometry.setAttribute(
//	'color',
//	new THREE.BufferAttribute(colors, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial({
	size: 0.1,
	sizeAttenuation: true
})
particlesMaterial.color = new THREE.Color('#ffffff')
//particlesMaterial.map = particleTexture
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
//particlesMaterial.alphaTest = 0.001
//particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
//particlesMaterial.blendin = THREE.AdditiveBlending
//particlesMaterial.vertexColors = true


//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

//Lights
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.3
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

	//Update Particles
	//particles.rotation.y = elapsedTime * 0.2
	
	//for(let i = 0; i < count; i++)
	//{
	//	const i3 = i * 3

	//	const x = particlesGeometry.attributes.position.array[i3]
	//	particlesGeometry.attributes.position.array[i3+ 1] = Math.sin(elapsedTime + x)
	//}
	//particlesGeometry.attributes.position.needsUpdate = true
	
	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	//Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
