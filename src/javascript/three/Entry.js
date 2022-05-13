import { Sketch } from "./Sketch"
import { genTokenData, Random } from "./abRandom"
import { Controller } from "./Controller"
import { Model } from "./Model"

// Setup URL Param
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlParamObj = {
  seed: urlParams.get('seed')
}

// Setup Token and Random
const projectNum = 123
const seed = urlParamObj.seed ? urlParamObj.seed : -1
const tokenData = genTokenData(projectNum, seed)
const random = new Random(tokenData)

// Setup Sketch
const sketch = new Sketch()

// Setup Model and Controller
const model = new Model(sketch, random)
const controller = new Controller(model)
model.refresh()
sketch.play()