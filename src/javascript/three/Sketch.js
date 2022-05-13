import * as THREE from "three"
import Stats from "stats.js"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
export class Sketch {
  constructor() {
    this.init()
  }

  init() {
    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom)

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
    this.stats.begin()

    this.camera.controls.update()
    this.renderer.renderer.render(this.scene, this.camera.camera)
    window.requestAnimationFrame(this.tick.bind(this))
    this.stats.end()
  }
}
