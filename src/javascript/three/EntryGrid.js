import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { ControllerAB } from "./ControllerAB"
import { Model } from "./Model"

function canvasToImgNode(canvas) {
  const imgNode = new Image()
  imgNode.src = canvas.toDataURL()
  return imgNode
}

const nOutputs = 10

// Setup URL Param
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlParamObj = {
  hash: urlParams.get('hash')
}

// Remove original webgl container from DOM
document.getElementById('webgl-container').remove()


// Create single sketch (hidden)
// Set preset
// Loop
//  Set hash
//  Update
//  Create image
//  Add image to grid


// Setup Sketch
const container = document.createElement('div')
container.className = 'grid-div'
container.id = 'hidden-container'

const canvas = document.createElement('canvas')
canvas.className = 'webgl-grid'
canvas.id = 'hidden-canvas'

container.append(canvas)
// document.body.append(container)

const sketch = new Sketch(canvas)
sketch.sizes.updateAll()

// Setup Random
const projectNum = 123
const hash = urlParamObj.hash
const tokenData = genTokenData(projectNum, hash)
console.log("hash: " + tokenData.hash)
const random = new Random(tokenData)

// Setup Model and ControllerAB
const model = new Model(sketch, random)
const controllerAB = new ControllerAB(model, random)
controllerAB.select('test')
model.refresh()
sketch.start()
// sketch.drawFrame()


// Create thumnails
for (let i = 0; i < nOutputs; i++) {
  const imgNode = canvasToImgNode(canvas)
  imgNode.style.width = '200px'
  imgNode.style.height = '200px'
  const div = document.createElement('div')
  div.className = 'grid-div'
  document.body.appendChild(div)
  div.appendChild(imgNode)
}
