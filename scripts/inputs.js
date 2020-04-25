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
            inputChanged({ target: lastAction.field })
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
        inputChanged(this)
    }

    preventDefault() { }
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
    const pressedKey = e.key
    if (oldValue.includes(pressedKey)) {
        e.preventDefault()
        return
    }
    inputs.track(field, oldValue, pressedKey)
}

function keyUp(e) {
    if (VALID.includes(e.key)) {
        const field = e.target
        const indexOfPressedKey = field.value.indexOf(e.key)
        field.selectionStart = indexOfPressedKey + 1
        field.selectionEnd = indexOfPressedKey + 1
    }
}

function inputChanged(e) {
    const field = e.target
    const cursorPos = field.selectionStart
    const trimmed = field.value.replace(/\n| |/g, '')
    if (trimmed.length > 1) {
        field.classList.add('small')
        s = ''
        for (let i = 0; i < VALID.length; i++) {
            if (field.value.includes(VALID[i])) {
                s += VALID[i]
            } else {
                s += ' '
            }
            if (i == 2 || i == 5) {
                s += '\n'
            }
        }
        field.value = s
        field.selectionStart = cursorPos
        field.selectionEnd = cursorPos
    } else {
        field.classList.remove("small")
        field.value = trimmed
    }
}