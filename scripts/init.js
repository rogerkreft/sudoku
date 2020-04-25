window.onload = function () {
    console.log('initializing ...')
    enableInputs(false)
    initCircles()
    initSudoku()
    generate()
    console.log('... initialized.')
}