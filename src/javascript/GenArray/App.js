import { genTokenData, Random } from "../three/abRandom"
import { SketchManager } from "./SketchManager"
import { SketchThumbnailGenerator } from "./ThumbnailGenerator"

function addGenArrayToController(controller) {
  // GenArray
  const genArrayParams = {
    projectNum: 123,
    hash: 0,
    'iterations': 10,
  }

  const genArrayFolder = controller.pane.addFolder({ title: 'GenArray' })

  genArrayFolder
    .addInput(genArrayParams, 'iterations', {
      min: 1,
      max: 1024,
      presetKey: 'genArray_iterations',
      format: (v) => v.toFixed()
    })

  genArrayFolder
    .addButton({
      title: 'Render',
    })
    .on('click', () => {
      const presetData = controller.pane.exportPreset()
      dpaViewMulti.innerHTML = ''
      sketchManager.hide()
      dpaViewMulti.style.display = 'block'
      const nOutputs = presetData.genArray_iterations

      // Consistent random seed/hash feature
      const baseHash = '0x83444c51e4a31272e92536ac41c4fa17f26dbcfd13cae0bc5ed64fd09c256c8f'
      const token = genTokenData(123, baseHash)
      const random = new Random(token)

      // Create one thumbnail at a time
      async function sequentialThumbnailGenerator() {
        for (let i = 0; i < nOutputs; i++) {
          const h = random.random_hash()
          await sketchThumbnailGenerator.generate(presetData, h)
        }
      }

      sequentialThumbnailGenerator()
    })
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