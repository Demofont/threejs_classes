import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()

//const geometry = new THREE.BoxGeometry(1, 1, 1)
//const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//const mesh = new THREE.Mesh(geometry, material)

//mesh.position.set(0.7, -0.6, 1)
//mesh.scale.x = 2
//mesh.scale.y = 0.5
//mesh.scale.set(0.5, 0.5, 0.5)
//mesh.rotation.reorder('YXZ')
//mesh.rotation.x = 1
//mesh.rotation.y = 2

//scene.add(mesh)

const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
group.add(cube1)

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.set(0.5, 0.5, -0.5)
group.add(cube2)

const cube3 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.set(-0.3, 0.3, -0.3)
group.add(cube3)

group.position.y = 1

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const sizes = {
	width: 800,
	height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

//camera.lookAt(mesh.position)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene,camera)
