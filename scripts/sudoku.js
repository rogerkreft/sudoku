function initSudoku() {
    try {
        var squares = document.querySelectorAll('.sudoku>.square')
        for (let i = 0; i < squares.length; i++) {
            var inputs = squares[i].getElementsByTagName('input')
            for (let j = 0; j < inputs.length; j++) {
                var input = inputs[j]
                input.addEventListener('keypress', e => validateInput(e, keyPressed))
                input.addEventListener('keyup', e => validateInput(e, keyUp))
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
    let solver = new Worker('/scripts/solver.js')
    solver.onmessage = processSolution
    solver.postMessage('GENERATE')
    solver.postMessage(field.serialize())
}

function processSolution(e) {
    const data = e.data
    console.log('Message received from worker script:', data)
    if (typeof data === 'string' || data instanceof String) {
        alert(e.data)
        console.log(e.data)
    } else {
        alert('SOLVED')
        field.deserialize(e.data)
    }
}