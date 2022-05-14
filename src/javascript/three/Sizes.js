export class Sizes {
  constructor(parent) {
    this.parent = parent
    this.canvas = this.parent.canvas
    this.container = this.canvas.parentElement
    this.updateDimensions()
    this.addListener()
  }

  updateDimensions() {
    // const foo = getComputedStyle(this.canvas)
    // this.width = this.container.clientWidth
    // this.height = this.container.clientWidth
    this.width = 200
    this.height = 200
    // console.log(foo)
    // console.log(this.width + ", " + this.height)
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
