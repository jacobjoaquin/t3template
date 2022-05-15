export class Sizes {
  constructor(parent) {
    this.parent = parent
    this.canvas = this.parent.canvas
    this.container = this.canvas.parentElement
    this.width
    this.height
    this.updateDimensions()
    this.addListener()
  }

  updateDimensions() {
    this.width = window.innerWidth
    this.height = window.innerHeight
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
