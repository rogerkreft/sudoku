
const VALID = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

var field = new Field()
var inputs = new Inputs()

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
    inputs.print()
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
    this.inputs.undo()
}

function solve() {
    if (field.isSolved()) {
        return true
    }
    const emptyFields = field.getAllEmpty()
    if (emptyFields.length == 0) {
        check()
        return false
    }
    for (let i = 0; i < emptyFields.length; i++) {

    }
}
