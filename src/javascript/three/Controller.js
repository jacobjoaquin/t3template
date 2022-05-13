import { Pane } from 'tweakpane';

export class Controller {
    constructor(model) {
        this.model = model
        this.pane
        this.init()
    }

    init() {
        this.pane = new Pane()

        this.pane.addInput(this.model.data, 'rot x', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot x', ev.value)
        })

        this.pane.addInput(this.model.data, 'rot y', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot y', ev.value)
        })

        this.pane.addInput(this.model.data, 'rot z', {
            min: 0,
            max: Math.PI * 2
        }).on('change', (ev) => {
            this.model.update('rot z', ev.value)
        })
    }

    updateFromModel() {
        this.pane.importPreset(this.model.data)
    }
}