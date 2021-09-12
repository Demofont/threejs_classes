import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

//Debug
const gui = new dat.GUI({ width: 360, closed: true })

//Grab canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()

//Objects
const object1 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

//Raycaster
const raycaster = new THREE.Raycaster()

let currentIntersect = null

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

//Mouse
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) =>
	{
		mouse.x = _event.clientX / sizes.width * 2 -1
		mouse.y = - (event.clientY / sizes.height) * 2 + 1
	})

window.addEventListener('click', () =>
	{
		if(currentIntersect)
		{
			if(currentIntersect.object === object1)
			{
				console.log('click on object 1')
			}
			else if(currentIntersect.object === object2)
			{
				console.log('click on object 2')
			}
			else
			{
				console.log('click on object 3')
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
	
	//Animate objects
	object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
	object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
	object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

	//Cast a ray
	
	raycaster.setFromCamera(mouse, camera)

	const objectsToTest = [object1, object2, object3]
	const intersects = raycaster.intersectObjects(objectsToTest)

	for(const intersect of intersects)
	{
		intersect.object.material.color.set('#0000ff')
	}

	for(const object of objectsToTest)
	{
		if(!intersects.find(intersect => intersect.object === object))
		{
			object.material.color.set('#ff0000')
		}
	}
	
	//Event

	if(intersects.length)
	{
		if(currentIntersect === null)
		{
			console.log('mouse enter')
		}

		currentIntersect = intersects[0]
	}
	else
	{
		if(currentIntersect)
		{
			console.log('mouse leave')
		}

		currentIntersect = null
	}

	//const rayOrigin = new THREE.Vector3(-3, 0, 0)
	//const rayDirection = new THREE.Vector3(1, 0, 0)
	//rayDirection.normalize()

	//raycaster.set(rayOrigin, rayDirection)

	//const objectsToTest = [object1, object2, object3]
	//const intersects = raycaster.intersectObjects(objectsToTest)

	//for(const object of objectsToTest)
	//{
	//	object.material.color.set('#ff0000')
	//}

	//for(const intersect of intersects)
	//{
	//	intersect.object.material.color.set('#0000ff')
	//}

	//Update controls
	controls.update()

	//Render
	renderer.render(scene,camera)

	//Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
