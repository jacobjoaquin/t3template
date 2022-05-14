export class Sizes {
  constructor(parent) {
    this.parent = parent
    this.canvas = this.parent.canvas
    this.container = this.canvas.parentElement
    console.log(this.container)
    this.updateDimensions()
    this.addListener()
  }

  updateDimensions() {
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    console.log(this.width + ", " + this.height)
  }

  updateAll() {
      this.updateDimensions()

      // Update camera
      this.parent.camera.camera.aspect = this.width / this.height
      this.parent.camera.camera.updateProjectionMatrix()

      // Update renderer
      this.parent.renderer.renderer.setSize(this.width, this.height)
      this.parent.renderer.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  addListener() {
    window.addEventListener("resize", () => {
      this.updateAll()
    })
  }
}
