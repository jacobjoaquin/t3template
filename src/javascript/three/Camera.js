import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// import { canvas, scene, sizes } from "./Experience"

export class Camera {
  constructor(parent) {
    this.parent = parent
    this.camera
    this.controls

    this.setCamera()
    this.setCameraControls()
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.parent.sizes.width / this.parent.sizes.height,
      0.1,
      100
    )
    this.camera.position.z = 4
    this.parent.scene.add(this.camera)
  }

  setCameraControls() {
    this.controls = new OrbitControls(this.camera, this.parent.canvas)
    this.controls.enableDamping = true
  }
}
