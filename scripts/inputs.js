class Inputs {

    constructor() {
        this.inputs = new Array()
    }

    print() {
        for (let i = 0; i < this.inputs.length; i++) {
            console.log(this.inputs[i])
        }
    }

    track(field, oldValue, newValue) {
        if (field != null && oldValue != newValue) {
            this.inputs.push(new Input(field, oldValue, newValue))
        }
    }

    undo() {
        if (this.inputs.length > 0) {
            const lastAction = this.inputs.pop()
            lastAction.field.value = lastAction.oldValue
        }
    }
}

class Input {
    constructor(field, oldValue, newValue) {
        this.field = field
        this.oldValue = oldValue
        this.newValue = newValue
    }
}