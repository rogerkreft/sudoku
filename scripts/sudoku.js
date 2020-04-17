
function initSudoku() {
    var elements = document.querySelectorAll('.sudoku input')
    for (i = 0; i < elements.length; i++) {
        var element = elements[i]
        element.addEventListener('keypress', keyPressed)
    }
}

function keyPressed(e) {
    var keyCode = e.keyCode
    if (keyCode < 49 || keyCode > 57) {
        e.preventDefault()
    } else {
        var target = e.target
        target.value = ''
    }
}