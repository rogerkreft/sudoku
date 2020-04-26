const VALID = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const x = array[i]
        array[i] = array[j]
        array[j] = x
    }
    return array
}

function sleep(delayInSeconds) {
    var start = new Date().getTime()
    while (new Date().getTime() < start + delayInSeconds * 1000) { }
}

function isSerializedSudokuField(object) {
    if (object == null || !(object instanceof Array) || object.length != 9) {
        return false
    }
    for (let i = 0; i < object.length; i++) {
        const row = object[i]
        if (row == null || !(row instanceof Array) || row.length != 9) {
            return false
        }
    }
    return true
}