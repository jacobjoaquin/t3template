export class ControllerAB {
    constructor(model, random) {
        this.model = model
        this.random = random
        this.setupPresets()
        this.current = this.presets.default
        this.generateModelData()
    }

    setupPresets() {
        this.presets = {
            default: {
                'rot x': 0,
                'rot y': 0,
                'rot z': 0,
                'background': 0x111155
            },
            test: {
                'rot x': {
                    func:
                        this.random.random_num.bind(this.random),
                    args: [0, Math.PI * 2]
                },
                'rot y': {
                    func:
                        this.random.random_dec.bind(this.random)
                },
                'rot z': Math.PI,
                'background': {
                    func: this.random.random_choice.bind(this.random),
                    args: [[0x888800, 0x008888, 0x880088]]
                }
            }
        }
    }

    generateModelData() {
        for (const key in this.current) {
            const v = this.current[key]
            if (typeof v === 'object') {
                if ('func' in v && 'args' in v) {
                    this.model.update(key, v.func(...v.args))
                } else if ('func' in v) {
                    this.model.update(key, v.func())
                }
            } else {
                this.model.update(key, v)
            }
        }
    }

    select(name) {
        this.current = this.presets[name]
        this.random.reninitHash()
        this.generateModelData()
    }
}