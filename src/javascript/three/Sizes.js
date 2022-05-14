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
      this.parent.camera.camera.aspect = this.width / this.height
      this.parent.camera.camera.updateProjectionMatrix()

      // Update renderer
      this.parent.renderer.renderer.setSize(this.width, this.height)
      this.parent.renderer.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }
}
