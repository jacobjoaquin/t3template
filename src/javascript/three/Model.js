export class Model {
    constructor(random, actions) {
        this.random = random
        this.data = {
            'rot x': this.random.random_num(0, Math.PI * 2),
            'rot y': this.random.random_num(0, Math.PI * 2),
            'rot z': this.random.random_num(0, Math.PI * 2),
            background: this.random.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
            color: this.random.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
        }

        this.actions = actions
    }


    update(parameter, value) {
        this.data[parameter] = value
        this.actions[parameter]()
    }
}