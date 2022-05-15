import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { ControllerAB } from "./ControllerAB"
import { Model } from "./Model"


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

  // Setup Random
  const projectNum = 123
  const tokenData = genTokenData(projectNum)
  console.log("hash: " + tokenData.hash)
  const random = new Random(tokenData)

  // Setup Model and ControllerAB
  const model = new Model(sketch, random)
  const controllerAB = new ControllerAB(model, random)
  controllerAB.select('thumbnail_test')
  model.refresh()
  sketch.drawFrame()

  // Genratate and place thumbnail
  requestAnimationFrame(() => {
    const div = document.createElement('div')
    div.className = 'grid-div'
    document.body.appendChild(div)
    const imgNode = canvasToImgNode(canvas)
    imgNode.style.width = '200px'
    imgNode.style.height = '200px'
    div.appendChild(imgNode)
    canvas.remove()
    container.remove()
  })
}

// Create outputs
const nOutputs = 100
for (let i = 0; i < nOutputs; i++) {
  setTimeout(generateThumbnail, i * 20)
}
