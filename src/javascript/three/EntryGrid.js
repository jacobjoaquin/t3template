import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { ControllerAB } from "./ControllerAB"
import { Model } from "./Model"

// Setup URL Param
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlParamObj = {
  hash: urlParams.get('hash')
}

// Remove original webgl container from DOM
document.getElementById('webgl-container').remove()

const nOutputs = 10

// Create single sketch
// Set preset
// Loop
//  Set hash
//  Update
//  Create image
//  Add image to grid


// Setup Card DOM elements
for (let i = 0; i < nOutputs; i++) {
  // Setup DOM
  var div = document.createElement('div')
  div.className = 'grid-div'
  var canvas = document.createElement("canvas")
  canvas.className = "webgl-grid"
  canvas.id = "temp-" + i
  document.body.appendChild(div)
  div.appendChild(canvas)
}

// Create Cards
for (let i = 0; i < nOutputs; i++) {
  var canvas = document.getElementById("temp-" + i)

  // Setup Random
  const projectNum = 123
  const hash = urlParamObj.hash
  const tokenData = genTokenData(projectNum, hash)
  console.log("hash: " + tokenData.hash)
  const random = new Random(tokenData)

  // Setup Sketch
  const sketch = new Sketch(canvas)
  sketch.sizes.updateAll()

  // Setup Model and ControllerAB
  const model = new Model(sketch, random)
  const controllerAB = new ControllerAB(model, random)
  controllerAB.select('test')
  model.refresh()
  sketch.drawFrame()
}