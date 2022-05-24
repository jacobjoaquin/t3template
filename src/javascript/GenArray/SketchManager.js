import { Sketch } from "../three/Sketch"
import { genTokenData, Random } from "../three/abRandom"
import { Controller } from "../three/Controller"
import { Presets } from "../three/Presets"
import { Model } from "../three/Model"


export class SketchManager {
  constructor(domElement, hash = undefined) {
    this.domElement = domElement
    this.createCanvas()                    // Temp canvas
    this.sketch = new Sketch(this.canvas)  // Temp sketch. Required for others.
    this.setupRandom(hash)
    this.model = new Model(this.sketch, this.random)
    this.presets = new Presets(this.model, this.random)
    this.controller = new Controller(this.sketch, this.model, this.presets)
  }

  // TODO: Remove these from sketch Manager?
  //       View maintenance should be done elsewhere
  hide() {
    this.domElement.style.display = 'none'
  }

  show() {
    this.domElement.style.display = 'block'
  }

  setupRandom(hash) {
    const projectNum = 123
    const tokenData = genTokenData(projectNum, hash)
    this.random = new Random(tokenData)
  }

  createCanvas() {
    this.domElement.innerHTML = ''
    this.canvas = document.createElement('canvas')
    this.domElement.append(this.canvas)
  }

  // Creates a new sketch and updates existing components to point to new sketch.
  init(autostart = false) {
    this.createCanvas()
    this.sketch = new Sketch(this.canvas)
    this.model.parent = this.sketch
    this.model.setBindings()
    this.controller.sketch = this.sketch
    this.random.compileHash()
    this.controller.randomizeWithPreset()
    this.model.refresh()
    this.controller.updateFromModel()

    if (autostart) {
      this.start()
    }
  }

  start() {
    this.sketch.start()
  }

  drawFrame() {
    this.sketch.drawFrame()
  }
}