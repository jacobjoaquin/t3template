import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"
import {Pane} from 'tweakpane';

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const loaders = new Loaders()

const cube = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.3, 20, 40),
  new THREE.MeshBasicMaterial({ color: "blue", wireframe: true })
)
scene.add(cube)

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()


// TweakPane
const PARAMS = {
  'cube x': 0,
  'cube y': 0,
  'cube z': 0,
}
const pane = new Pane();
pane.addInput(PARAMS, 'cube x', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  cube.rotation.x = ev.value
})
pane.addInput(PARAMS, 'cube y', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  cube.rotation.y = ev.value
})
pane.addInput(PARAMS, 'cube z', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  cube.rotation.z = ev.value
})

// GenArray GUI
const genArrayParams = {
  seed: 1000,
  'iterations': 10,
  go: 0
}

const genArrayFolder = pane.addFolder({
  title: 'GenArray'
})
genArrayFolder.addInput(genArrayParams, 'seed', {
  format: (v) => v.toFixed()
})
genArrayFolder.addInput(genArrayParams, 'iterations', {
  min: 1,
  max: 100,
  format: (v) => v.toFixed()
})
genArrayFolder.addButton({
  title: 'Render',
});


//Animate
const clock = new THREE.Clock()
let time = Date.now()

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  // Update controls
  camera.controls.update()

  // Render
  renderer.renderer.render(scene, camera.camera)

  window.requestAnimationFrame(tick)

  stats.end()
}

tick()
