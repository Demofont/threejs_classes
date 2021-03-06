import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

//Loaders
const loadingBarElement = document.querySelector('.loading-bar')

const loadingManager = new THREE.LoadingManager(
	//Loaded
	() =>
	{	window.setTimeout(() =>
		{
			gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
			loadingBarElement.classList.add('ended')
			loadingBarElement.style.transform = ''
		}, 500)
	},
	//Progress
	(itemUrl, itemsLoaded, itemsTotal) =>
	{
		const progressRatio = (itemsLoaded / itemsTotal)
		loadingBarElement.style.transform = `scaleX(${progressRatio})`
	}
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

//Debug
const gui = new dat.GUI({ closed: true })
const debugObject = {}


//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Overlay
const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
	transparent: true,
	uniforms:
	{
		uAlpha: { value: 1 }
	},
	vertexShader: `
		void main()
		{
			gl_Position = vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform float uAlpha;

		void main()
		{
			gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
		}
	`

})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

//Update all materials
const updateAllMaterials = () =>
{
	scene.traverse((child) =>
	{
		if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
		{
			child.material.envMapIntensity = debugObject.envMapIntensity
			child.material.needsUpdate = true
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

//Evnironment map
const environmentMap = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

//Environment Debug
debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

//Models
gltfLoader.load(
	'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	(gltf) =>
	{
		gltf.scene.scale.set(10, 10, 10)
		gltf.scene.position.set(0, -4, 0)
		gltf.scene.rotation.y = Math.PI * 0.5
		scene.add(gltf.scene)

		//model debug
		gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

		updateAllMaterials()
	}
)

//Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, - 2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

//Light Helper
//const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightCameraHelper)

//Light Debug
gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')

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
camera.position.set(4, 1, -4)
//camera.lookAt(sphere.position)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))

renderer.physicallyCorrectLights = true

renderer.outputEncoding = THREE.sRGBEncoding

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//ToneMapping Debug
gui.add(renderer, 'toneMapping', {
	No: THREE.NoToneMapping,
	Linear: THREE.LinearToneMapping,
	Reinhard: THREE.ReinhardToneMapping,
	Cineon: THREE.CineonToneMapping,
	ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange(() =>
{
	renderer.toneMapping = Number(renderer.toneMapping)
	updateAllMaterials()

})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

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
