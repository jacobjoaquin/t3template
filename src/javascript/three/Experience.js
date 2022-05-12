import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"
import { Pane } from 'tweakpane';
import { genTokenData, Random } from "./ABRandom"

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const loaders = new Loaders()

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()


// Setup URL Params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlParamObj = {
  seed: urlParams.get('seed')
}

// Setup Token and Random
const projectNum = 123
const seed = urlParamObj.seed ? urlParamObj.seed : -1
const tokenData = genTokenData(projectNum, seed)
const R = new Random(tokenData)

// Paramters
const PARAMS = {
  'rot x': R.random_num(0, Math.PI * 2),
  'rot y': R.random_num(0, Math.PI * 2),
  'rot z': R.random_num(0, Math.PI * 2),
  background: R.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
  color: R.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
}

scene.background = new THREE.Color(PARAMS.background)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.3, 20, 40),
  new THREE.MeshBasicMaterial({ color: PARAMS.color, wireframe: true })
)
scene.add(torus)

torus.rotation.x = PARAMS['rot x']
torus.rotation.y = PARAMS['rot y']
torus.rotation.z = PARAMS['rot z']

// Setup Tweakpane
const pane = new Pane();

pane.addInput(PARAMS, 'rot x', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  torus.rotation.x = ev.value
})
pane.addInput(PARAMS, 'rot y', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  torus.rotation.y = ev.value
})
pane.addInput(PARAMS, 'rot z', {
  min: 0,
  max: Math.PI * 2
}).on('change', (ev) => {
  torus.rotation.z = ev.value
})

// GenArray GUI
const genArrayParams = {
  projectNum: projectNum,
  seed: urlParamObj.seed ? urlParamObj.seed : -1,
  'iterations': 10,
  go: 0
}

const genArrayFolder = pane.addFolder({
  title: 'GenArray'
})
genArrayFolder.addBlade({
  view: 'text',
  label: 'project num',
  parse: (v) => String(v),
  value: projectNum,
});
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
}).on('click', () => {
  console.log('Render Clicked')
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
