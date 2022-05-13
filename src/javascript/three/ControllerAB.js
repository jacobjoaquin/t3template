export class ControllerAB {
    constructor(model, random) {
        this.model = model
        this.random = random
        this.init()
    }

    init() {
        this.model.update('rot x', this.random.random_num(0, Math.PI * 2))
        this.model.update('rot y', this.random.random_num(0, Math.PI * 2))
        this.model.update('rot z', this.random.random_num(0, Math.PI * 2))
    }
}