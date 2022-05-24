import { Sketch } from "../three/Sketch"
import { genTokenData, Random } from "../three/abRandom"
import { Controller } from "../three/Controller"
import { Presets } from "../three/Presets"
import { Model } from "../three/Model"
import { canvasToImgNode } from "../Util"
import { SketchManager } from "./SketchManager"
import { SketchThumbnailGenerator } from "./ThumbnailGenerator"

// FIXME: Use async loop instead of delays
export const GenArrayDelays = {
  loop: 350,
  loader: 100,
  img: 50
}

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
    const presetData = controller.pane.exportPreset()
    dpaViewMulti.innerHTML = ''
    sketchManager.hide()
    dpaViewMulti.style.display = 'block'
    const nOutputs = presetData.genArray_iterations

    // FIXME: Rewrite for better asynchronous looping.
    //       One loop should execute at a time.
    //       When compeleted, if there ungenerated thumbnails, generate thumbnail
    for (let i = 0; i < nOutputs; i++) {
      setTimeout(() => {
        sketchThumbnailGenerator.generate(presetData)
      }, i * GenArrayDelays.loop)
    }
  });
}


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

// Create and Start App Components
const sketchManager = new SketchManager(dpaViewSingle)
const sketchThumbnailGenerator = new SketchThumbnailGenerator(dpaViewMulti, sketchManager)
addGenArrayToController(sketchManager.controller)
sketchManager.init()
sketchManager.start()

console.log(sketchManager.model.random.random_hash())