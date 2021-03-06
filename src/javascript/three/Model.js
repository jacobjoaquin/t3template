import * as THREE from "three"

export class Model {
    constructor(parent, random) {
        this.parent = parent
        this.random = random
        this.setData()
        this.setBindings()
    }

    // Populate default data
    setData() {
        this.data = {
            'rot x': 0,
            'rot y': 0,
            'rot z': 0,
            'background': 0x111111
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
            'background': () => {
                this.parent.scene.background = new THREE.Color(this.data['background'])
            }
        }
    }

    // Update a parameter's value and optionally perform related action
    update(parameter, value, runAction = true) {
        this.data[parameter] = value
        if (runAction && parameter in this.bindings) {
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