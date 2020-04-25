function initSudoku() {
    try {
        var squares = document.querySelectorAll('.sudoku>.square')
        for (let i = 0; i < squares.length; i++) {
            var inputs = squares[i].getElementsByClassName('field')
            for (let j = 0; j < inputs.length; j++) {
                var input = inputs[j]
                input.addEventListener('keypress', e => validateInput(e, keyPressed))
                input.addEventListener('keyup', e => validateInput(e, keyUp))
                input.addEventListener('input', inputChanged)
            }
            field.insertSquare(i, inputs)
        }
    } catch (err) {
        console.log('ERROR initializing sudoku:', err)
    }
}

function check() {
    const mistakes = field.getMistakes()
    const emptyFields = field.getAllEmpty()
    if (mistakes.length > 0) {
        let msg = 'The sudoku is invalid because:\n'
        for (let i = 0; i < mistakes.length; i++) {
            msg += '\t - ' + mistakes[i] + '\n'
        }
        alert(msg)
    } else if (emptyFields.length > 0) {
        alert('The sudoku is valid, but not solved yet!')
    } else {
        alert('The sudoku is solved. Good job!')
    }
}

function undo() {
    inputs.undo()
}

function solve() {
    beforeProcessSolutionFunction = null
    processSolutionFunction = function (data) {
        field.deserializeSolution(data)
    }
    afterProcessSolutionFunction = null
    let solver = new Worker('/scripts/solver.js')
    solver.onmessage = processSolution
    solver.postMessage('SOLVE')
    solver.postMessage(field.serialize())
}

function count() {
    let solver = new Worker('/scripts/solver.js')
    solver.onmessage = processSolution
    solver.postMessage('COUNT')
    solver.postMessage(field.serialize())
}

function restart() {
    while (inputs.hasStoredInputs()) {
        this.inputs.undo()
    }
}

function generate() {
    beforeProcessSolutionFunction = function () {
        var inputs = document.querySelectorAll('.field')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].removeAttribute('disabled', '')
            const kpe = new KeyPressEvent(inputs[i], '')
            kpe.execute()
        }
    }
    processSolutionFunction = function (data) {
        field.deserializeGeneratedField(data)
    }
    afterProcessSolutionFunction = function () {
        var inputs = document.querySelectorAll('.field')
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i]
            if (input.value != '') {
                input.setAttribute('disabled', '')
            }
        }
    }
    var inputs = document.querySelectorAll('.field')
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = ''
    }
    let solver = new Worker('/scripts/solver.js')
    solver.onmessage = processSolution
    solver.postMessage('GENERATE')
}

var beforeProcessSolutionFunction
var processSolutionFunction
var afterProcessSolutionFunction

function processSolution(e) {
    if (beforeProcessSolutionFunction != null) {
        beforeProcessSolutionFunction()
        beforeProcessSolutionFunction = null
    }
    try {
        const data = e.data
        console.log('Message received from worker script:', data)
        if (typeof data === 'string' || data instanceof String) {
            alert(e.data)
        } else {
            processSolutionFunction(e.data)
        }
    } finally {
        enableInputs(true)
    }
    if (afterProcessSolutionFunction != null) {
        afterProcessSolutionFunction()
        afterProcessSolutionFunction = null
    }
}

function lockGUI(func) {
    try {
        enableInputs(false)
        func()
    } catch (err) {
        console.log(err)
        enableInputs(true)
    }
}

function enableInputs(enable) {
    var inputs = document.querySelectorAll('.field,button')
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        let inputDisabled = input.getAttribute('disabled')
        if (inputDisabled == '') {
            continue
        }
        if (enable) {
            input.removeAttribute('disabled')
        } else {
            input.setAttribute('disabled', true)
        }
    }
}