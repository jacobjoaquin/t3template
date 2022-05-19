import { Sketch } from "../three/Sketch"
import { genTokenData, Random } from "../three/abRandom"
import { Controller } from "../three/Controller"
import { Presets } from "../three/Presets"
import { Model } from "../three/Model"
import { canvasToImgNode } from "../Util"
import { SketchManager } from "./SketchManager"

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
    sketchManager.hide()
    grid.style.display = 'block'

    const nOutputs = presets.genArray_iterations

    // FIXME: Rewrite for better asynchronous looping.
    //       One loop should execute at a time.
    //       When compeleted, if there ungenerated thumbnails, generate thumbnail
    for (let i = 0; i < nOutputs; i++) {
      setTimeout(() => {
        sketchThumbnailGenerator.generate(presets)
      }, i * 50)
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

    // TODO: Redefining this here isn't necessary.
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

    // FIXME: Doesn't work with asynchronous loading of assets such as images.
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
        sketchManager.show()
        console.log(random.tokenData.hash)
        sketchManager.random.generateNewToken(random.tokenData.hash)
        sketchManager.init()
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
// const webglContainer = document.getElementById('webgl-container')
// const webgl = document.querySelector("canvas.webgl")
// const sketchManager = new SketchManager(webgl)

// // sketchDev.reinit()

// // Setup GenArray Component
// const grid = document.createElement('div')
// grid.style.display = 'none'
// document.body.append(grid)
// const sketchThumbnailGenerator = new SketchThumbnailGenerator(grid)
// sketchThumbnailGenerator.presets = sketchDev.presets
// // // Add GenArray Panel to Controller
// addGenArrayToController(sketchDev.controller)

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

// Setup App DOM
const sketchManager = new SketchManager(dpaViewSingle)
sketchManager.init()
sketchManager.start()
