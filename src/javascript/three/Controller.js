import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class Controller {
    constructor(sketch, model, controllerAB) {
        this.sketch = sketch
        this.model = model
        this.controllerAB = controllerAB
        this.pane
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

    randomizeWithPreset() {
        const data = this.pane.exportPreset()

        const guiPresetController = {
            'rot x': {
                func: this.model.random.random_num.bind(this.model.random),
                args: [data['preset_rot x'].min, data['preset_rot x'].max]
            },
            'rot y': {
                func: this.model.random.random_num.bind(this.model.random),
                args: [data['preset_rot y'].min, data['preset_rot y'].max]
            },
            'rot z': {
                func: this.model.random.random_num.bind(this.model.random),
                args: [data['preset_rot z'].min, data['preset_rot z'].max]
            },
            'background': {
                func: this.model.random.random_choice.bind(this.model.random),
                args: [['#aaaa00', '#00aaaa', '#aa00aa']]
            }
        }

        this.controllerAB.presets['guiPresetController'] = guiPresetController
        this.controllerAB.select('guiPresetController')
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
            // this.controllerAB.generateModelData()
            this.randomizeWithPreset()
            this.model.refresh()
            this.updateFromModel()
            this.pane.importPreset({
                sketch_hash: this.model.random.tokenData.hash
            })
        });
    }

    addModel() {
        // Model
        const modelFolder = this.pane.addFolder({
            title: 'Model'
        })

        modelFolder.addInput(this.model.data, 'rot x', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot x', ev.value)
        })

        modelFolder.addInput(this.model.data, 'rot y', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot y', ev.value)
        })

        modelFolder.addInput(this.model.data, 'rot z', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot z', ev.value)
        })
    }

    addPresets() {
        // Presets
        const presetFolder = this.pane.addFolder({
            title: 'Presets'
        })

        const presetParams = {
            'rot x': { min: 0, max: Math.PI * 2 },
            'rot y': { min: 0, max: Math.PI * 2 },
            'rot z': { min: 0, max: Math.PI * 2 },
        };

        for (const k in presetParams) {
            presetFolder.addInput(presetParams, k, {
                min: 0,
                max: Math.PI * 2,
                presetKey: 'preset_' + k,
            })
    
        }
        // presetFolder.addInput(presetParams, 'rot x', {
        //     min: 0,
        //     max: Math.PI * 2,
        //     presetKey: 'preset_rot x',
        // })
    }

    addGenArray() {
        // GenArray
        const genArrayParams = {
            projectNum: 123,
            hash: 0,
            'iterations': 10,
            go: 0
        }

        const genArrayFolder = this.pane.addFolder({
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
            console.log('Render Clicked')
        });
    }

    updateFromModel() {
        this.pane.importPreset(this.model.data)
    }
}