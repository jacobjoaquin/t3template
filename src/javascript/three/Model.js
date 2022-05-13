export class Model {
    constructor(parent, random) {
        this.parent = parent
        this.random = random
        this.setData()
        this.setBindings()
    }

    // Populate data
    setData() {
        this.data = {
            'rot x': this.random.random_num(0, Math.PI * 2),
            'rot y': this.random.random_num(0, Math.PI * 2),
            'rot z': this.random.random_num(0, Math.PI * 2),
            background: this.random.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
            color: this.random.random_int(0, 0x1000000), // range [0, 0xFFFFFF]
        }
    }

    // Define actions
    setBindings() {
        this.bindings = {
            'rot x': () => {
                this.parent.torus.rotation.x = this.data['rot x']
            },
            'rot y': () => {
                this.parent.torus.rotation.y = this.data['rot y']
            },
            'rot z': () => {
                this.parent.torus.rotation.z = this.data['rot z']
            },
        }
    }

    // Update a parameter's value and optionally perform related action
    update(parameter, value, action = true) {
        this.data[parameter] = value
        if (action && parameter in this.bindings) {
            this.bindings[parameter]()
        }
    }

    // Refresh view with all actions
    refresh() {
        for (const parameter in this.bindings) {
            this.bindings[parameter]()
        }
    }
}