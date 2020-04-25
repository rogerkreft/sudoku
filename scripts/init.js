window.onload = init

function init() {
    console.log('initializing ...')
    enableInputs(false)
    initCircles()
    initSudoku()
    generate()
    console.log('... initialized.')
}