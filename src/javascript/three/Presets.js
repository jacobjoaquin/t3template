export class Presets {
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
                // 'background': {
                //     func: this.random.random_choice.bind(this.random),
                //     args: [[0xaaaa00, 0x00aaaa, 0xaa00aa]]
                // }
            },
            thumbnail_test: {
                'rot x': {
                    func: this.random.random_num.bind(this.random),
                    args: [0, Math.PI * 2]
                },
                'rot y': {
                    func: this.random.random_num.bind(this.random),
                    args: [0, Math.PI * 2]
                },
                'rot z': {
                    func: this.random.random_num.bind(this.random),
                    args: [0, Math.PI * 2]
                },
                // 'background': {
                //     func: this.random.random_choice.bind(this.random),
                //     args: [['#000000', '#1d0100', '#7e0e00', '#ba2001', '#e04f00', '#ec7d01', '#eeb300', '#eccf0d', '#cfe243', '#ace071', '#a0db82', '#a2c38e', '#8eaa81', '#6c846c', '#445753', '#273342', '#0a0f2d']]
                // }
            },
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
        this.random.compileHash()
        this.generateModelData()
    }
}