import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { Presets } from "./Presets"
import { Model } from "./Model"
import { canvasToImgNode } from "../Util"


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
    grid.innerHTML = ''
    sketchDev.hide()
    grid.style.display = 'block'

    const nOutputs = presets.genArray_iterations
    for (let i = 0; i < nOutputs; i++) {
      setTimeout(() => {
        sketchThumbnailGenerator.generate(presets)
      }, i * 50)
    }
  });
}

class SketchDev {
  constructor(domElement, hash = undefined) {
    this.domElement = domElement
    this.sketch = new Sketch(this.domElement)
    this.setupRandom(hash)
    this.model = new Model(this.sketch, this.random)
    this.presets = new Presets(this.model, this.random)
    this.controller = new Controller(this.sketch, this.model, this.presets)
    this.presets.select('thumbnail_test')
    this.model.refresh()
    this.controller.updateFromModel()
    this.sketch.start()
  }

  hide() {
    // TODO: Better handle parent container
    this.domElement.parentElement.style.display = 'none'
  }

  show() {
    this.domElement.parentElement.style.display = 'block'
  }

  setupRandom(hash) {
    const projectNum = 123
    const tokenData = genTokenData(projectNum, hash)
    this.random = new Random(tokenData)
  }

  reinit() {
    // Delete existing canvas
    const parent = this.domElement.parentElement
    parent.innerHTML = ''

    // Create new canvas
    const newCanvas = document.createElement('canvas')
    newCanvas.className = 'webgl'
    this.domElement = newCanvas
    parent.append(newCanvas)

    // Create new sketch
    this.sketch = new Sketch(this.domElement)

    // Update components to point to new sketch
    this.model.parent = this.sketch
    this.model.setBindings()
    this.controller.sketch = this.sketch
    console.log('reinit:' + this.random.tokenData.hash)
    this.random.compileHash()

    this.presets.select('guiPresetController')
    this.controller.randomizeWithPreset()
    // this.model.refresh()
    // this.updateFromModel()

    this.model.refresh()
    this.controller.updateFromModel()
    this.sketch.start()
  }
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

  generate(presetData) {
    this.setupDom()

    const sketch = new Sketch(this.canvas)
    sketch.sizes.updateDimensions = () => {
      sketch.sizes.width = this.width
      sketch.sizes.height = this.height
    }
    sketch.sizes.updateAll()

    const projectNum = 123
    const tokenData = genTokenData(projectNum)
    const random = new Random(tokenData)
    const model = new Model(sketch, random)
    const presets = new Presets(model, random)

    const guiPresetController = {
      'rot x': {
        func: random.random_num.bind(random),
        args: [presetData['preset_rot x'].min, presetData['preset_rot x'].max]
      },
      'rot y': {
        func: random.random_num.bind(random),
        args: [presetData['preset_rot y'].min, presetData['preset_rot y'].max]
      },
      'rot z': {
        func: random.random_num.bind(random),
        args: [presetData['preset_rot z'].min, presetData['preset_rot z'].max]
      },
      // 'background': {
      //     func: random.random_choice.bind(random),
      //     args: [['#aaaa00', '#00aaaa', '#aa00aa']]
      // }
    }

    presets.presets['guiPresetController'] = guiPresetController
    presets.select('guiPresetController')
    model.refresh()
    sketch.drawFrame()

    requestAnimationFrame(() => {
      const div = document.createElement('div')
      div.className = 'grid-div'
      this.domElement.appendChild(div)
      const imgNode = canvasToImgNode(this.canvas)
      imgNode.style.width = this.width + 'px'
      imgNode.style.height = this.height + 'px'
      div.appendChild(imgNode)
      this.domElement.append(div)

      imgNode.onclick = () => {
        grid.style.display = 'none'
        sketchDev.show()
        console.log(random.tokenData.hash)
        sketchDev.random.generateNewToken(random.tokenData.hash)
        sketchDev.reinit()
        // presets.select(guiPresetController)
        // model.refresh()

        //   showWebgl()
        //   // Don't update presets
      }

      this.canvas.remove()
      this.canvasContainer.remove()
    })
  }
}



// Setup SketchDev Component
const webglContainer = document.getElementById('webgl-container')
const webgl = document.querySelector("canvas.webgl")
const sketchDev = new SketchDev(webgl)

// sketchDev.reinit()

// Setup GenArray Component
const grid = document.createElement('div')
grid.style.display = 'none'
document.body.append(grid)
const sketchThumbnailGenerator = new SketchThumbnailGenerator(grid)
sketchThumbnailGenerator.presets = sketchDev.presets
// // Add GenArray Panel to Controller
addGenArrayToController(sketchDev.controller)
