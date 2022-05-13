import * as THREE from "three"
// import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
// import { Loaders } from "./Loaders"
// import { genTokenData, Random } from "./ABRandom"
// import { Controller } from "./Controller"
// import { Model } from "./Model"

export class Sketch {
  constructor() {
    this.init()
  }

  init() {
    this.canvas = document.querySelector("canvas.webgl")
    this.scene = new THREE.Scene()
    // this.loaders = new Loaders()
    this.sizes = new Sizes(this)
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.scene.background = new THREE.Color(0x005599)
    this.clock = new THREE.Clock()

    // Setup Torus
    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.3, 20, 40),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    )
    this.scene.add(this.torus)
  }

  play() {
    this.tick()
  }

  tick() {
    // stats.begin()

    // const elapsedTime = this.clock.getElapsedTime()

    const currentTime = Date.now()
    // const deltaTime = currentTime - this.time
    // this.time = currentTime

    // Update controls
    this.camera.controls.update()

    // Render
    this.renderer.renderer.render(this.scene, this.camera.camera)

    window.requestAnimationFrame(this.tick.bind(this))

    // stats.end()
  }
}

// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

// // Setup URL Params
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const urlParamObj = {
//   seed: urlParams.get('seed')
// }

// // Setup Token and Random
// const projectNum = 123
// const seed = urlParamObj.seed ? urlParamObj.seed : -1
// const tokenData = genTokenData(projectNum, seed)
// const random = new Random(tokenData)

// // Setup Model and Controller
// const model = new Model(random)
// const PARAMS = model.data
// const controller = new Controller(model)

// // Setup View
// scene.background = new THREE.Color(PARAMS.background)

// // Setup Torus
// export const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(1, 0.3, 20, 40),
//   new THREE.MeshBasicMaterial({ color: PARAMS.color, wireframe: true })
// )
// scene.add(torus)

// // Refresh View with Model Data
// model.refresh()

// //Animate
// const clock = new THREE.Clock()
// let time = Date.now()

// const tick = () => {
//   stats.begin()

//   const elapsedTime = clock.getElapsedTime()

//   const currentTime = Date.now()
//   const deltaTime = currentTime - time
//   time = currentTime

//   // Update controls
//   camera.controls.update()

//   // Render
//   renderer.renderer.render(scene, camera.camera)

//   window.requestAnimationFrame(tick)

//   stats.end()

// }

// tick()
