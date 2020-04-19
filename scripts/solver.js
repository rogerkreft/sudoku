class Field {
    constructor() {
        this.rows = new Map()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            let row = new Array()
            for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
                row[columnIndex] = { value: '', rowIndex: rowIndex, columnIndex: columnIndex }
            }
            this.rows.set(rowIndex, row)
        }
    }

    set(rowIndex, columnIndex, v) {
        this.rows.get(rowIndex)[columnIndex].value = v
    }

    get(rowIndex, columnIndex) {
        return this.rows.get(rowIndex)[columnIndex]
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
        return this.rows.get(rowIndex)
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

    isSolved() {
        if (this.getAllEmptyFields().length > 0) {
            return false
        }
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
            const serializedRow = serializedRows.get(rowIndex)
            for (let columnIndex = 0; columnIndex < serializedRow.length; columnIndex++) {
                this.set(rowIndex, columnIndex, serializedRow[columnIndex])
            }
        }
    }

    serialize() {
        let serializedRows = new Map()
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            const row = this.getRow(rowIndex)
            let serializedRow = new Array()
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                serializedRow.push(row[columnIndex].value)
            }
            serializedRows.set(rowIndex, serializedRow)
        }
        return serializedRows
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

var field = new Field()
var timer = new Date()

onmessage = function (e) {
    let data = e.data
    console.log('Message received from main script:', data)
    field.deserialize(data)
    timer = new Date()
    if (solve()) {
        postMessage(field.serialize())
    } else {
        postMessage('ERROR: sudoku is unsolvable')
    }
}

function solve() {
    if (field.isSolved()) {
        return true
    }
    if (hasToSendStatusMessage()) {
        timer = new Date()
        let statusMsg = timer.toString() + '\n' + field.toString()
        postMessage(statusMsg)
    }
    const emptyFields = shuffle(field.getAllEmptyFields())
    for (let i = 0; i < emptyFields.length; i++) {
        const emptyField = emptyFields[i]
        const possibleValues = field.getPossibleValues(emptyField.rowIndex, emptyField.columnIndex)
        for (let v = 0; v < possibleValues.length; v++) {
            const oldValue = emptyField.value
            emptyField.value = possibleValues[v]
            if (solve()) {
                return true
            }
            emptyField.value = oldValue
        }
    }
    return false
}

function hasToSendStatusMessage() {
    if (getSecondDifference(timer, new Date()) > 10) {
        return true
    }
    return false
}

function getMinuteDifference(date1, date2) {
    if (date1 == null || date2 == null) {
        return null
    }
    const minute = 1000 * 60
    const diffInMillis = date2.getTime() - date1.getTime()
    return Math.floor(diffInMillis / minute)
}

function getSecondDifference(date1, date2) {
    if (date1 == null || date2 == null) {
        return null
    }
    const minute = 1000
    const diffInMillis = date2.getTime() - date1.getTime()
    return Math.floor(diffInMillis / minute)
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}