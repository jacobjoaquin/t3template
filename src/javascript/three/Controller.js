import { Pane } from 'tweakpane';

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

        // Sketch Properties
        const sketchPropertiesFolder = this.pane.addFolder({
            title: 'Sketch Properties'
        })

        // sketchPropertiesFolder.addBlade({
        //     view: 'text',
        //     label: 'hash',
        //     parse: (v) => String(v),
        //     value: this.model.random.tokenData.hash,
        // });

        const sketchProperites = {
            hash: this.model.random.tokenData.hash,
        };

        sketchPropertiesFolder.addInput(sketchProperites, 'hash',
            {
                presetKey: 'sketch_hash',
            }
        );


        const btnRandomize = this.pane.addButton({
            title: 'Randomize',
        });
        btnRandomize.on('click', () => {
            this.model.random.generateNewToken()
            this.controllerAB.generateModelData()
            this.model.refresh()
            this.updateFromModel()
            this.pane.importPreset({
                sketch_hash: this.model.random.tokenData.hash
            })
        });

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

        // Preset
        const presetFolder = this.pane.addFolder({
            title: 'Preset'
        })

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
        // genArrayFolder.addBlade({
        //     view: 'text',
        //     label: 'project num',
        //     parse: (v) => String(v),
        //     value: 123,
        // });
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

        const preset = this.pane.exportPreset();
        console.log(preset)
    }

    updateFromModel() {
        this.pane.importPreset(this.model.data)
    }
}