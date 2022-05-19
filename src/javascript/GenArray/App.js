import { Sketch } from "../three/Sketch"
import { genTokenData, Random } from "../three/abRandom"
import { Controller } from "../three/Controller"
import { Presets } from "../three/Presets"
import { Model } from "../three/Model"
import { canvasToImgNode } from "../Util"
import { SketchManager } from "./SketchManager"

// FIXME: Use async loop instead of delays
const delays = {
  loop: 350,
  loader: 100,
  img: 50
}

function addGenArrayToController(controller) {
  // GenArray
  const genArrayParams = {
    projectNum: 123,
    hash: 0,
    'iterations': 5,
  }

  const genArrayFolder = controller.pane.addFolder({
    title: 'GenArray'
  })
  genArrayFolder.addInput(genArrayParams, 'iterations', {
    min: 1,
    max: 100,
    presetKey: 'genArray_iterations',
    format: (v) => v.toFixed()
  })
  genArrayFolder.addButton({
    title: 'Render',
  }).on('click', () => {
    const presets = controller.pane.exportPreset()
    dpaViewMulti.innerHTML = ''
    sketchManager.hide()
    dpaViewMulti.style.display = 'block'
    const nOutputs = presets.genArray_iterations

    // FIXME: Rewrite for better asynchronous looping.
    //       One loop should execute at a time.
    //       When compeleted, if there ungenerated thumbnails, generate thumbnail
    for (let i = 0; i < nOutputs; i++) {
      setTimeout(() => {
        sketchThumbnailGenerator.generate(presets)
      }, i * delays.loop)
    }
  });
}


class SketchThumbnailGenerator {
  constructor(domElement, width = 200, height = 200) {
    this.domElement = domElement
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

  createCard() {
    const canvasContainer = document.createElement('div')
    canvasContainer.className = 'grid-div'
    const canvas = document.createElement('canvas')
    canvas.className = 'webgl-grid'
    canvasContainer.append(canvas)
    return canvasContainer
  }

  generate(data) {
    // Setup card and append to viewport
    // This doesn't require being added to Document.
    const canvasContainer = this.createCard()
    const canvas = canvasContainer.querySelector("canvas")

    // Create new sketch
    const sketch = new Sketch(canvas)


    const projectNum = 123
    const tokenData = genTokenData(projectNum)
    const random = new Random(tokenData)
    const model = new Model(sketch, random)
    const presets = new Presets(model, random)

    // Copy sketchManager sketch data into this thumbnail model instance
    model.data = { ...model.data, ...sketchManager.model.data }
    sketch.data = model.data // TODO: Create a proper function for this

    sketch.sizes.updateDimensions = () => {
      sketch.sizes.width = this.width
      sketch.sizes.height = this.height
    }
    sketch.sizes.updateAll()

    // Create virtual random adapter controllers
    // FIXME: Global. Always automate getting presetParams for a single source.
    const controllerNames = Object.keys(sketchManager.controller.presetParams)
    const guiPresetController = {}

    for (const cn of controllerNames) {
      const key = 'preset_' + cn

      guiPresetController[cn] = {
        func: random.random_num.bind(random),
        args: [data[key].min, data[key].max]
      }
    }

    presets.presets['guiPresetController'] = guiPresetController
    presets.select('guiPresetController')
    model.refresh()

    // Create output view
    const div = document.createElement('div')
    div.className = 'grid-div'
    const imgNode = new Image()
    imgNode.style.width = this.width + 'px'
    imgNode.style.height = this.height + 'px'
    div.appendChild(imgNode)
    this.domElement.append(div)

    imgNode.onclick = () => {
      dpaViewMulti.style.display = 'none'
      console.log(random.tokenData.hash)
      sketchManager.random.generateNewToken(random.tokenData.hash)
      sketchManager.init()
      sketchManager.show()
    }

    setTimeout(() => {
      sketch.drawFrame()
      setTimeout(() => {
        console.log(canvas)
        imgNode.src = canvas.toDataURL()
        canvas.remove()
        canvasContainer.remove()
      }, delays.img)
    }, delays.loader)
  }
}


// Create DOM for App
document.body.innerHTML = ''
const dpaApp = document.createElement('div')
dpaApp.id = 'dpa-app'
document.body.innerHTML = ''
const dpaViewSingle = document.createElement('div')
dpaViewSingle.id = 'dpa-view-single'
const dpaViewMulti = document.createElement('div')
dpaViewMulti.id = 'dpa-view-multi'
dpaViewMulti.style.display = 'none'
dpaApp.append(dpaViewSingle)
dpaApp.append(dpaViewMulti)
document.body.append(dpaApp)

// Create and Start App Components
const sketchManager = new SketchManager(dpaViewSingle)
const sketchThumbnailGenerator = new SketchThumbnailGenerator(dpaViewMulti)
addGenArrayToController(sketchManager.controller)
sketchManager.init()
sketchManager.start()
