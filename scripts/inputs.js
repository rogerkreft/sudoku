const VALID = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

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
        if (this.hasStoredInputs()) {
            const lastAction = this.inputs.pop()
            lastAction.field.value = lastAction.oldValue
        }
    }

    hasStoredInputs() {
        if (this.inputs.length > 0) {
            return true
        }
        return false
    }
}

class Input {
    constructor(field, oldValue, newValue) {
        this.field = field
        this.oldValue = oldValue
        this.newValue = newValue
    }
}

class KeyPressEvent {
    constructor(target, key) {
        this.target = target
        this.key = key
    }

    execute() {
        keyPressed(this)
        this.target.value = this.key
        //console.log('typing', this.key, 'into', this.target)
    }
}

var inputs = new Inputs()

function validateInput(e, f) {
    if (VALID.includes(e.key)) {
        f(e)
    } else {
        e.preventDefault()
    }
}

function keyPressed(e) {
    const field = e.target
    const oldValue = field.value
    const newValue = e.key
    inputs.track(field, oldValue, newValue)
    field.value = ''
}

function keyUp(e) {
    console.log(e)
}