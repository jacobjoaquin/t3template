import { Sketch } from "../three/Sketch"
import { genTokenData, Random } from "../three/abRandom"
import { Presets } from "../three/Presets"
import { Model } from "../three/Model"
import { GenArrayDelays } from "./App"


export class SketchThumbnailGenerator {
  constructor(domElement, sketchManager, width = 200, height = 200) {
    this.domElement = domElement
    this.sketchManager = sketchManager
    this.width = width
    this.height = height
  }

  setupDom() {
    this.canvasContainer = document.createElement('div')
    this.canvasContainer.className = 'grid-div'
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'webgl-grid'
    this.canvasContainer.append(this.canvas)
    document.body.append(this.canvasContainer)
  }

  createCanvasComponent() {
    const canvasContainer = document.createElement('div')
    canvasContainer.className = 'grid-div'
    const canvas = document.createElement('canvas')
    canvas.className = 'webgl-grid'
    canvasContainer.append(canvas)
    return canvasContainer
  }

  createImgNodeComponent() {
    const div = document.createElement('div')
    div.className = 'grid-div'
    const imgNode = new Image()
    imgNode.style.width = this.width + 'px'
    imgNode.style.height = this.height + 'px'
    div.appendChild(imgNode)
    this.domElement.append(div)

    imgNode.onclick = () => {
      this.domElement.style.display = 'none'
      this.sketchManager.random.generateNewToken(this.random.tokenData.hash)
      this.sketchManager.init(true)
      this.sketchManager.show()
    }

    return imgNode
  }

  createPresetAdapter(presets, presetData) {
    // Create virtual random adapter controllers
    // This virtual controller uses the constraints from the visible GUI preset interval sliders.
    const controllerNames = Object.keys(this.sketchManager.controller.presetParams)
    const guiPresetController = {}

    for (const cn of controllerNames) {
      const key = 'preset_' + cn

      guiPresetController[cn] = {
        func: presets.random.random_num.bind(presets.random),
        args: [presetData[key].min, presetData[key].max]
      }
    }

    presets.presets['guiPresetController'] = guiPresetController
    presets.select('guiPresetController')
  }

  async generate(presetData, hash) {
    return new Promise(gResolve => {
      // Setup card and append to viewport
      // This doesn't require being added to Document.
      const canvasContainer = this.createCanvasComponent()
      const canvas = canvasContainer.querySelector("canvas")

      // Create new sketch and components.
      const sketch = new Sketch(canvas)
      const projectNum = 123
      const tokenData = genTokenData(projectNum, hash)
      this.random = new Random(tokenData)
      const model = new Model(sketch, this.random)
      const presets = new Presets(model, this.random)

      // Override updateDimensions() function and update size
      sketch.sizes.updateDimensions = () => {
        sketch.sizes.width = this.width
        sketch.sizes.height = this.height
      }
      sketch.sizes.updateAll()

      // Setup adapter
      this.createPresetAdapter(presets, presetData)
      model.refresh()

      // Create imgNode component
      const imgNode = this.createImgNodeComponent()

      // Draws the frame then resolves
      function drawTheFrame() {
        return new Promise((resolve) => {
          sketch.drawFrame()
          requestAnimationFrame(resolve)
        })
      }
      
      // Create image then copy to image
      async function createTheThumbnail() {
        await drawTheFrame()
        imgNode.src = canvas.toDataURL()
        canvas.remove()
        canvasContainer.remove()
        gResolve()
      }

      createTheThumbnail()
    })
  }
}
