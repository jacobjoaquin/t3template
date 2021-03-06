import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { Presets } from "./Presets"
import { Model } from "./Model"

const nOutputs = 16
const dimensions = {
  width: 200,
  height: 200
}

function canvasToImgNode(canvas) {
  const imgNode = new Image()
  const imgData = canvas.toDataURL()
  imgNode.src = imgData
  return imgNode
}

// Remove original webgl container from DOM
document.getElementById('webgl-container').remove()

// Setup Sketch
function generateThumbnail() {
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
  presets.select('thumbnail_test')
  model.refresh()
  sketch.drawFrame()

  // Genratate and place thumbnail
  requestAnimationFrame(() => {
    const div = document.createElement('div')
    div.className = 'grid-div'
    document.body.appendChild(div)
    const imgNode = canvasToImgNode(canvas)
    imgNode.style.width = dimensions.width + 'px'
    imgNode.style.height = dimensions.height + 'px'
    div.appendChild(imgNode)
    canvas.remove()
    container.remove()
  })
}

// Create outputs
for (let i = 0; i < nOutputs; i++) {
  setTimeout(generateThumbnail, i * 20)
}
