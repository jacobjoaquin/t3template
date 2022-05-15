import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { Presets } from "./Presets"
import { Model } from "./Model"

const dimensions = {
  width: 200,
  height: 200
}

const webgl = document.getElementById('webgl-container')
const grid = document.createElement('div')
document.body.append(grid)
function showWebgl() {
  webgl.style.display = 'block'
  grid.style.display = 'none'
}

function showGrid() {
  webgl.style.display = 'none'
  grid.style.display = 'block'
}

function canvasToImgNode(canvas) {
  const imgNode = new Image()
  const imgData = canvas.toDataURL()
  imgNode.src = imgData
  return imgNode
}

function addGenArrayToController(controller) {
  // GenArray
  const genArrayParams = {
    projectNum: 123,
    hash: 0,
    'iterations': 5,
    go: 0
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
    showGrid()

    const nOutputs = presets.genArray_iterations
    for (let i = 0; i < nOutputs; i++) {
      setTimeout(() => {

        generateThumbnail(presets)
      }, i * 50)
    }
  });
}

// ThreeJS Running Sketch
function loadSketch() {
  // Setup Token and Random
  const projectNum = 123
  const tokenData = genTokenData(projectNum)
  console.log("hash: " + tokenData.hash)
  const random = new Random(tokenData)

  // Setup Sketch
  const targetCanvas = document.querySelector("canvas.webgl")
  const sketch = new Sketch(targetCanvas)

  // Setup Model and Controller
  const model = new Model(sketch, random)
  const presets = new Presets(model, random)
  const controller = new Controller(sketch, model, presets)
  addGenArrayToController(controller)
  presets.select('thumbnail_test')
  model.refresh()
  controller.updateFromModel()
  sketch.start()
}

// Setup Sketch
function generateThumbnail(presetData) {
  // Setup Card
  const container = document.createElement('div')
  container.className = 'grid-div'
  container.id = 'hidden-container'
  const canvas = document.createElement('canvas')
  canvas.className = 'webgl-grid'
  canvas.id = 'hidden-canvas'
  container.append(canvas)
  document.body.append(container)

  // Create Sketch
  let sketch = new Sketch(canvas)

  // Force cards to be of certain size
  sketch.sizes.updateDimensions = () => {
    sketch.sizes.width = dimensions.width
    sketch.sizes.height = dimensions.height
  }
  sketch.sizes.updateAll()

  // Setup Random
  const projectNum = 123
  const tokenData = genTokenData(projectNum)
  console.log("hash: " + tokenData.hash)
  const random = new Random(tokenData)

  // Setup Model and Presets
  const model = new Model(sketch, random)
  const presets = new Presets(model, random)
  // presets.select('thumbnail_test')

  console.log(presetData)
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
    'background': {
        func: random.random_choice.bind(random),
        args: [['#aaaa00', '#00aaaa', '#aa00aa']]
    }
  }

  presets.presets['guiPresetController'] = guiPresetController
  presets.select('guiPresetController')




  model.refresh()
  sketch.drawFrame()

  // Genratate and place thumbnail
  requestAnimationFrame(() => {
    const div = document.createElement('div')
    div.className = 'grid-div'
    // document.body.appendChild(div)
    grid.appendChild(div)
    const imgNode = canvasToImgNode(canvas)
    imgNode.style.width = dimensions.width + 'px'
    imgNode.style.height = dimensions.height + 'px'
    div.appendChild(imgNode)
    canvas.remove()
    container.remove()
  })
}


// Create outputs
// const nOutputs = 3
// for (let i = 0; i < nOutputs; i++) {
//   setTimeout(generateThumbnail, i * 20)
// }


loadSketch()
// showGrid()
