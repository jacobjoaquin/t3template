import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { Presets } from "./Presets"
import { Model } from "./Model"
import Stats from "stats.js"

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

// Setup Sketch
const targetCanvas = document.querySelector("canvas.webgl")
const sketch = new Sketch(targetCanvas)

// Setup Stats
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
sketch.tickBefore = () => {
  stats.begin()
}
sketch.tickAfter = () => {
  stats.end()
}

// Setup Model and Controller
const model = new Model(sketch, random)
const presets = new Presets(model, random)
const controller = new Controller(sketch, model, presets)
presets.select('thumbnail_test')
model.refresh()
controller.updateFromModel()
sketch.start()