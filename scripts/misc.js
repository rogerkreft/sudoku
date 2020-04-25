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
