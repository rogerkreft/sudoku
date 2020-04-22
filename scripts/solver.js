class Field {
    constructor() {
        this.rows = new Array()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            let row = new Array()
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                row[columnIndex] = { value: '', rowIndex: rowIndex, columnIndex: columnIndex }
            }
            this.rows[rowIndex] = row
        }
    }

    set(rowIndex, columnIndex, v) {
        const newValue = v.toString()
        if (!['', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(newValue)) {
            throw new Error('ERROR: trying to set [' + rowIndex + ',' + columnIndex + '] to illegal value [' + newValue + '] in \n' + this.toString())
        }
        this.rows[rowIndex][columnIndex].value = v
    }

    get(rowIndex, columnIndex) {
        return this.rows[rowIndex][columnIndex]
    }

    getPossibleValues(rowIndex, columnIndex) {
        const row = this.getRow(rowIndex)
        const column = this.getColumn(columnIndex)
        const square = this.getSquare(this.getSquareIndex(rowIndex, columnIndex))
        let possibleValues = new Array()
        for (let i = 1; i <= 9; i++) {
            if (this.includes(row, i)) {
                continue
            }
            if (this.includes(column, i)) {
                continue
            }
            if (this.includes(square, i)) {
                continue
            }
            possibleValues.push(i)
        }
        return possibleValues
    }

    getSquareIndex(rowIndex, columnIndex) {
        return Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3)
    }

    getRow(rowIndex) {
        return this.rows[rowIndex]
    }

    getColumn(columnIndex) {
        let column = new Array()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            column.push(this.get(rowIndex, columnIndex))
        }
        return column
    }

    getSquare(squareIndex) {
        const minRow = Math.floor(squareIndex / 3) * 3
        const maxRow = minRow + 3
        const minColumn = Math.floor(squareIndex % 3) * 3
        const maxColumn = minColumn + 3
        let square = new Array()
        for (let rowIndex = minRow; rowIndex < maxRow; rowIndex++) {
            for (let columnIndex = minColumn; columnIndex < maxColumn; columnIndex++) {
                square.push(this.get(rowIndex, columnIndex))
            }
        }
        return square
    }

    getAllEmptyFields() {
        let emptyFields = new Array()
        for (let i = 0; i < 9; i++) {
            const row = this.getRow(i)
            for (let j = 0; j < row.length; j++) {
                const field = row[j]
                if (field == null || field.value == null || field.value == '' || field.value == '0') {
                    emptyFields.push(field)
                }
            }
        }
        return emptyFields
    }

    getAllFilledFields() {
        let filledFields = new Array()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                const field = this.get(rowIndex, columnIndex)
                if (field != null && field.value != null && field.value != '' && field.value != '0') {
                    filledFields.push(field)
                }
            }
        }
        return filledFields
    }

    isSolved() {
        for (let i = 0; i < 9; i++) {
            if (!this.isArraySolved(this.getRow(i))) {
                return false
            }
            if (!this.isArraySolved(this.getColumn(i))) {
                return false
            }
            if (!this.isArraySolved(this.getSquare(i))) {
                return false
            }
        }
        return true
    }

    isArraySolved(array) {
        if (array == null || array.length != 9) {
            return false
        }
        for (let v = 1; v <= 9; v++) {
            if (!this.includes(array, v)) {
                return false
            }
        }
        return true
    }

    includes(array, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].value == value) {
                return true
            }
        }
        return false
    }

    hasMistakes() {
        for (let i = 0; i < 9; i++) {
            if (this.hasDuplicates(this.getRow(i))) {
                return true
            }
            if (this.hasDuplicates(this.getColumn(i))) {
                return true
            }
            if (this.hasDuplicates(this.getSquare(i))) {
                return true
            }
        }
        return false
    }

    hasDuplicates(array) {
        if (array != null) {
            for (let i = 0; i < array.length; i++) {
                const value = array[i].value
                for (let j = i; j < array.length; j++) {
                    if (value == array[j].value) {
                        return true
                    }
                }
            }
        }
        return false
    }

    deserialize(serializedRows) {
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const serializedRow = serializedRows[rowIndex]
            for (let columnIndex = 0; columnIndex < serializedRow.length; columnIndex++) {
                this.set(rowIndex, columnIndex, serializedRow[columnIndex])
            }
        }
    }

    serialize() {
        let serializedRows = new Array()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const row = this.getRow(rowIndex)
            let serializedRow = new Array()
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                serializedRow.push(row[columnIndex].value)
            }
            serializedRows[rowIndex] = serializedRow
        }
        return serializedRows
    }

    clone() {
        let clonedField = new Field()
        for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            const row = this.getRow(rowIndex)
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                clonedField.set(rowIndex, columnIndex, this.get(rowIndex, columnIndex).value)
            }
        }
        return clonedField
    }

    toString() {
        let s = ''
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                s += this.get(rowIndex, columnIndex).value + '\t'
            }
            s += '\n'
        }
        return s
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const x = array[i]
        array[i] = array[j]
        array[j] = x
    }
    return array
}

var feedbackFunction = function () { return false }
var field
var fields
var solutions
var done

function reset() {
    field = new Field()
    fields = new Array()
    solutions = new Array()
    done = false
}

onmessage = function (e) {
    const data = e.data
    console.log('Message received from main script:', data)
    if (data == 'SOLVE') {
        feedbackFunction = getAnySolution
    } else if (data == 'COUNT') {
        feedbackFunction = count
    } else if (data == 'GENERATE') {
        postMessage(generate())
    } else {
        try {
            generateSolutions(data)
            if (done && solutions.length == 0) {
                postMessage('ERROR: sudoku is unsolvable')
            } else {
                feedbackFunction()
            }
        } catch (err) {
            postMessage('ERROR: ' + err)
            throw err
        } finally {
            feedbackFunction = function () { return false }
        }
    }
}

function getAnySolution() {
    if (solutions.length > 0) {
        postMessage(solutions[0].serialize())
        feedbackFunction = function () { return true }
        return true
    }
    return false
}

function count() {
    if (done) {
        postMessage('Found ' + solutions.length + ' solutions!')
        feedbackFunction = function () { return true }
        return true
    }
    return false
}

function generateSolutions(data) {
    reset()
    field.deserialize(data)
    solve()
    done = true
}

function solve() {
    if (field.isSolved()) {
        if (!asStringsArray(solutions).includes(field.toString())) {
            console.log('Found solution')
            solutions.push(field.clone())
        }
        return true
    }
    if (feedbackFunction()) {
        return false
    }
    const emptyFields = field.getAllEmptyFields()
    for (let i = 0; i < emptyFields.length; i++) {
        const emptyField = emptyFields[i]
        const possibleValues = field.getPossibleValues(emptyField.rowIndex, emptyField.columnIndex)
        for (let v = 0; v < possibleValues.length; v++) {
            emptyField.value = possibleValues[v]
            solve()
        }
        emptyField.value = ''
        if (asStringsArray(fields).includes(field.toString())) {
            return false
        }
        fields.push(field)
        if (possibleValues.length == 0) {
            return false
        }
    }
    return false
}

function asStringsArray(array) {
    var stringsArray = new Array()
    for (let i = 0; i < array.length; i++) {
        stringsArray.push(array[i].toString())
    }
    return stringsArray
}

function abortOnMoreThanOneSolution() {
    if (solutions.length > 1) {
        return true
    }
    return false
}

function generate() {
    let generatedField = getRandomInitialField()
    feedbackFunction = abortOnMoreThanOneSolution
    while (solutions.length == 1) {
        const filledFields = shuffle(generatedField.getAllFilledFields())
        console.log('starting to remove fields from the remaining ' + filledFields.length + ' of\n' + generatedField.toString())
        for (let i = 0; i < filledFields.length; i++) {
            const field = filledFields[i]
            const oldValue = field.value
            field.value = ''
            generateSolutions(generatedField.serialize())
            if (solutions.length > 1) {
                field.value = oldValue
            }
        }
        if (generatedField.getAllFilledFields().length == filledFields.length) {
            break
        }
    }
    return generatedField.serialize()
}

function getRandomInitialField() {
    reset()
    const emptyFields = shuffle(field.getAllEmptyFields())
    let filledFieldCount = 0
    for (let i = 0; i < emptyFields.length; i++) {
        const emptyField = emptyFields[i]
        const possibleValues = field.getPossibleValues(emptyField.rowIndex, emptyField.columnIndex)
        if (possibleValues.length == 0) {
            continue
        }
        emptyField.value = possibleValues[Math.floor(Math.random() * possibleValues.length)]
        if (filledFieldCount++ >= 17) {
            break
        }
    }
    feedbackFunction = function () { return (solutions.length > 0) }
    reset()
    this.solve()
    if (solutions.length == 0) {
        return getRandomInitialField()
    }
    return solutions[0]
}