import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Loaders } from "./Loaders"
import { genTokenData, Random } from "./ABRandom"
import { Controller } from "./Controller"
import { Model } from "./Model"

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
const random = new Random(tokenData)

// Setup Model and Controller
const model = new Model(random)
const PARAMS = model.data
const controller = new Controller(model)

// Setup View
scene.background = new THREE.Color(PARAMS.background)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.3, 20, 40),
  new THREE.MeshBasicMaterial({ color: PARAMS.color, wireframe: true })
)
scene.add(torus)


torus.rotation.x = PARAMS['rot x']
torus.rotation.y = PARAMS['rot y']
torus.rotation.z = PARAMS['rot z']


// Setup model action
model.actions = {
  'rot x': () => {
    torus.rotation.x = PARAMS['rot x']
  },
  'rot y': () => {
    torus.rotation.x = PARAMS['rot y']
  },
  'rot z': () => {
    torus.rotation.x = PARAMS['rot z']
  }
}

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
