import { torus } from './Experience'

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

        this.actions = {
            'rot x': () => {
                torus.rotation.x = this.data['rot x']
            },
            'rot y': () => {
                torus.rotation.x = this.data['rot y']
            },
            'rot z': () => {
                torus.rotation.x = this.data['rot z']
            },
        }
    }

    update(parameter, value) {
        this.data[parameter] = value
        this.actions[parameter]()
    }

    refresh() {
        for (const parameter in this.actions) {
            this.actions[parameter]()
        }
    }
}