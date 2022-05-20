import * as THREE from "three"
import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"

export class Sketch {
  constructor(targetCanvas) {
    this.targetCanvas = targetCanvas
    this.setup()

    // TODO: Update to call setup by App directly to allow model data to be generated
    //       before the call to setup.
    // How to use:
    //   Generate data in model
    //   Push model data to this.data
    //   Call sketch.setup() in App
  }

  setup() {
    this.canvas = this.targetCanvas
    this.scene = new THREE.Scene()
    this.sizes = new Sizes(this)
    this.camera = new Camera(this)
    this.renderer = new Renderer(this)
    this.scene.background = new THREE.Color(0x001111)
    this.clock = new THREE.Clock()

    // Setup Torus
    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.3, 20, 40),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    )
    this.scene.add(this.torus)
  }

  draw() {
    this.camera.controls.update()
    this.renderer.renderer.render(this.scene, this.camera.camera)
  }

  drawFrame() {
    requestAnimationFrame(this.draw.bind(this))
  }

  tick() {
    this.tickBefore()
    this.draw()
    requestAnimationFrame(this.tick.bind(this))
    this.tickAfter()
  }

  start() {
    this.tick()
  }

  // Temporary hooks for tick(). Override these.
  tickBefore() { }
  tickAfter() { }
}
