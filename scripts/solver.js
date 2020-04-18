onmessage = function (e) {
    let data = e.data
    console.log('Message received from main script:', data)
    //solve(field)
    postMessage(data)
}

function solve(field) {
    if (field.isSolved()) {
        alert('SOLVED')
        return true
    }
    const emptyFields = field.getAllEmpty()
    for (let i = 0; i < emptyFields.length; i++) {
        const emptyField = emptyFields[i]
        for (let v = 0; v < VALID.length; v++) {
            emptyField.value = VALID[v]
            if (solve(field)) {
                return true
            }
            emptyField.value = ''
        }
    }
    return false
}