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

const nOutputs = 3
for (let i = 0; i < nOutputs; i++) {
  // Setup DOM
  var div = document.createElement('div')
  div.className = 'gridDiv'
  var canvas = document.createElement("canvas")
  canvas.className = "webglGrid"
  canvas.id = "temp-" + i
  document.body.appendChild(div)
  div.appendChild(canvas)

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