import { Pane } from 'tweakpane';
import { TAU } from '../Util'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class Controller {
    constructor(sketch, model, presets) {
        this.sketch = sketch
        this.model = model
        this.presets = presets
        this.pane

        // TODO: Eventually there will be more than just interval sliders.
        //       This will require creating presetParams with properties such as "color".
        //       Instead of handcoding these objects, use a set of functions.
        //       ie:
        //            addSlider(target, 'name', min=0, max=1, step=0.1, presetKey=null, etc...)
        this.presetParams = {
            'rot x': { min: 0, max: TAU },
            'rot y': { min: 0, max: TAU },
            'rot z': { min: 0, max: TAU },
        }

        this.init()
    }

    init() {
        this.pane = new Pane()
        this.pane.registerPlugin(EssentialsPlugin);
        this.addSketchProperties()
        this.addModel()
        this.addPresets()
        // this.addGenArray()
        const preset = this.pane.exportPreset();
        console.log(preset)

    }

    // TODO: A randomize function should create new instance of Sketch.
    //       This will ensure all randomized parameters will be updated.
    //       Doing it this way will eliminate effort to design SKetch a certain way to conform.
    randomizeWithPreset() {
        // Original by-hand method:
        // const guiPresetController = {
        //     controlName: {
        //         func: this.model.random.random_num.bind(this.model.random),
        //         args: [data['preset_controlName'].min, data['preset_controlName'].max]
        //     },
        // }

        const data = this.pane.exportPreset()
        const guiPresetController = {}
        const controllerNames = Object.keys(this.presetParams)

        for (const cn of controllerNames) {
            const key = 'preset_' + cn

            guiPresetController[cn] = {
                func: this.model.random.random_num.bind(this.model.random),
                args: [data[key].min, data[key].max]
            }
        }

        this.presets.presets['guiPresetController'] = guiPresetController
        this.presets.select('guiPresetController')
    }

    addSketchProperties() {
        // Sketch Properties
        const sketchPropertiesFolder = this.pane.addFolder({
            title: 'Sketch Properties'
        })

        const sketchProperites = {
            hash: this.model.random.tokenData.hash,
        };

        sketchPropertiesFolder.addInput(sketchProperites, 'hash',
            {
                presetKey: 'sketch_hash',
            }
        );

        const btnRedraw = this.pane.addButton({
            title: 'Redraw',
        });
        btnRedraw.on('click', () => {
            this.randomizeWithPreset()
            this.model.refresh()
            this.updateFromModel()
            this.pane.importPreset({
                sketch_hash: this.model.random.tokenData.hash
            })
        });


        const btnRandomize = this.pane.addButton({
            title: 'Randomize',
        });
        btnRandomize.on('click', () => {
            this.model.random.generateNewToken()
            this.randomizeWithPreset()
            this.model.refresh()
            this.updateFromModel()
            this.pane.importPreset({
                sketch_hash: this.model.random.tokenData.hash
            })
        });
    }

    addModel() {
        const folder = this.pane.addFolder({
            title: 'Model'
        })

        for (const k in this.presetParams) {
            folder
                .addInput(this.model.data, k, {
                    min: this.presetParams[k].min,
                    max: this.presetParams[k].max,
                })
                .on('change', (ev) => {
                    this.model.update(k, ev.value)
                })
        }
    }

    addPresets() {
        const folder = this.pane.addFolder({
            title: 'Presets'
        })

        for (const k in this.presetParams) {
            folder.addInput(this.presetParams, k, {
                min: this.presetParams[k].min,
                max: this.presetParams[k].max,
                presetKey: 'preset_' + k,
            })
        }
    }

    updateFromModel() {
        this.pane.importPreset(this.model.data)
    }
}