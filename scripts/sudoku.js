
var squares = new Map()
var rows = new Map()
var columns = new Map()

function initSudoku() {
    var divs = document.querySelectorAll('.sudoku>*')
    for (i = 0; i < divs.length; i++) {
        var div = divs[i]
        var inputs = div.getElementsByTagName('input')
        for (j = 0; j < inputs.length; j++) {
            var input = inputs[j]
            input.addEventListener('keypress', e => validateInput(e, keyPressed))
            input.addEventListener('keyup', e => validateInput(e, keyUp))
            insert(i, j, input)
        }
    }
}

function validateInput(e, f) {
    var valid = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (valid.includes(e.key)) {
        f(e)
    } else {
        e.preventDefault()
    }
}

function keyPressed(e) {
    var target = e.target
    target.value = ''
}

function keyUp(e) {
    console.log(squares)
}

function insert(i, j, input) {
    insertSquare(i, input)
}

function insertSquare(i, input) {
    if (!squares.has(i)) {
        squares.set(i, new Array())
    }
    var square = squares.get(i)
    square.push(input)
}