import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Debug
const gui = new dat.GUI()

//Textures
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')

//Fonts
const fontLoader = new THREE.FontLoader()

fontLoader.load(
	'fonts/helvetiker_regular.typeface.json',
	(font) =>
	{
		const textGeometry = new THREE.TextBufferGeometry(
			'Candy Shop',
			{
				font: font,
				size: 0.5,
				height: 0.2,
				curveSegments: 6,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 4
			}
		)

		//adding bouding to text
		// textGeometry.computeBoundingBox()
		//textGeometry.translate(
		//	- (textGeometry.boundingBox.max.x - 0.02) * 0.5,
		//	- (textGeometry.boundingBox.max.y - 0.02) * 0.5,
		//	- (textGeometry.boundingBox.max.z - 0.03) * 0.5
		//)
		
		textGeometry.center()
		
		//texture
		const material = new THREE.MeshMatcapMaterial()
		//textMaterial.wireframe = true
		material.matcap = matcapTexture

		const text = new THREE.Mesh(textGeometry, material)
		scene.add(text)

		const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

		for(let i = 0; i < 100; i++)
		{
			const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
			const donut = new THREE.Mesh(donutGeometry, material)
			donut.position.x = (Math.random() - 0.5) * 10
			donut.position.y = (Math.random() - 0.5) * 10
			donut.position.z = (Math.random() - 0.5) * 10

			donut.rotation.x = Math.random() * Math.PI * 2
			donut.rotation.y = Math.random() * Math.PI * 2

			const random = Math.random()
			donut.scale.x = random
			donut.scale.y = random
			donut.scale.z = random

			scene.add(donut)
		}
	}
)

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Axes helper
//const axesHelper = new THREE.AxesHelper()
//scene.add(axesHelper)

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

	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	//Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
