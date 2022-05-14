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

// Setup Token and Random
const projectNum = 123
const hash = urlParamObj.hash
const tokenData = genTokenData(projectNum, hash)
console.log("hash: " + tokenData.hash)
const random = new Random(tokenData)

// Setup DOM
document.getElementById('webgl-container').remove()
var div = document.createElement('div')
div.className = 'grid-div'
var canvas = document.createElement("canvas")
canvas.className  = "webgl-grid"
canvas.id = "temp"
document.body.appendChild(div)
div.appendChild(canvas)

// Setup Sketch
const sketch = new Sketch(canvas)
sketch.sizes.updateAll()

// Setup Model and ControllerAB
const model = new Model(sketch, random)
const controllerAB = new ControllerAB(model, random)
model.refresh()
// sketch.start()
sketch.draw()
