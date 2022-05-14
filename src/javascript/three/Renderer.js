import * as THREE from "three"

export class Renderer {
  constructor(parent) {
    this.parent = parent
    this.renderer

    this.setRenderer()
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.parent.canvas,
      antialias: true,
    })
    this.renderer.setSize(this.parent.sizes.width, this.parent.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}
