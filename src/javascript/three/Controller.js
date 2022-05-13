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


        // // GenArray GUI
        // const genArrayParams = {
        //     projectNum: projectNum,
        //     seed: urlParamObj.seed ? urlParamObj.seed : -1,
        //     'iterations': 10,
        //     go: 0
        // }

        // const genArrayFolder = pane.addFolder({
        //     title: 'GenArray'
        // })
        // genArrayFolder.addBlade({
        //     view: 'text',
        //     label: 'project num',
        //     parse: (v) => String(v),
        //     value: projectNum,
        // });
        // genArrayFolder.addInput(genArrayParams, 'seed', {
        //     format: (v) => v.toFixed()
        // })
        // genArrayFolder.addInput(genArrayParams, 'iterations', {
        //     min: 1,
        //     max: 100,
        //     format: (v) => v.toFixed()
        // })
        // genArrayFolder.addButton({
        //     title: 'Render',
        // }).on('click', () => {
        //     console.log('Render Clicked')
        // });
    }
}