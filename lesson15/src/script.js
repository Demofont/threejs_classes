import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

//Debug
const gui = new dat.GUI()

//Textures
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const environmentMapTexture = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg',
])

//Sharpness
//doorColorTexture.generateMipmaps = false
//doorColorTexture.minFilter = THREE.NearestFilter
//doorColorTexture.magFilter = THREE.NearestFilter

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.2

//Debug
gui.add(material, 'roughness').min(0).max(1).step(0.0001)


//Objescts
const sphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 64, 64),
	material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)
	
const cube = new THREE.Mesh(
	new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
	material
)
cube.geometry.setAttribute(
	'uv2', 
	new THREE.BufferAttribute(cube.geometry.attributes.uv.array, 2)
)

const torus = new THREE.Mesh(
	new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
	material
)
torus.position.x = 1.5
torus.geometry.setAttribute(
	'uv2',
	new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)

const plane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(10, 10),
	material
)

plane.rotation.x = Math.PI * 1.5
plane.position.y = -1.5

scene.add(sphere, cube, torus, plane)

//Lights
//const ambientLight = new THREE.AmbientLight()
//ambientLight.color = new THREE.Color(0xffffff)
//ambientLight.intensity = 0.5
//scene.add(ambientLight)

//const directionalLight = new THREE.DirectionalLight()
//directionalLight.color = new THREE.Color(0xff0000)
//directionalLight.intensity = 0.3
//directionalLight.position.set(1, 0.25, 0)
//scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 1, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 1, 3, 3)
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(cube.position)
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

//Light Helpers
//const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
//scene.add(hemisphereLightHelper)

//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
//scene.add(directionalLightHelper)

//const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
//scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

window.requestAnimationFrame(() =>
{
	spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

window.requestAnimationFrame(() =>
{
	rectAreaLightHelper.position.copy(rectAreaLight.postion)
	rectAreaLightHelper.update()
})

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
camera.lookAt(cube.position)
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

	//Update objects
	sphere.rotation.y = 0.1 * elapsedTime
	cube.rotation.y = 0.1 * elapsedTime
	torus.rotation.y = 0.1 * elapsedTime

	sphere.rotation.x = 0.15 * elapsedTime
	cube.rotation.x = 0.15 * elapsedTime
	torus.rotation.x = 0.15 * elapsedTime

	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	//Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
