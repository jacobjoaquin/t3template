// import { camera, renderer } from "./Experience"
import { Sketch } from "./Sketch"

export class Sizes {
  constructor(parent) {
    this.parent = parent
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.resizeWindow()
  }

  resizeWindow() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.width = window.innerWidth
      this.height = window.innerHeight

      // Update camera
      // camera.camera.aspect = this.width / this.height
      // camera.camera.updateProjectionMatrix()

      // Update renderer
      // renderer.renderer.setSize(this.width, this.height)
      // renderer.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }
}
