class Field {

    constructor() {
        this.squares = new Array()
    }

    insertSquare(index, fields) {
        if (!this.squares[index]) {
            this.squares[index] = new Array()
        }
        var square = this.squares[index]
        for (let i = 0; i < 9; i++) {
            square[i] = fields[i]
        }
    }

    getSquare(index) {
        if (!this.squares[index]) {
            this.squares[index] = new Array()
        }
        return this.squares[index]
    }

    getRow(index) {
        var row = new Array()
        var minSquare = Math.floor(index / 3) * 3
        var maxSquare = minSquare + 2
        for (let square = minSquare; square <= maxSquare; square++) {
            let minField = (index % 3) * 3
            let maxField = minField + 2
            for (let field = minField; field <= maxField; field++) {
                row.push(this.squares[square][field])
            }
        }
        return row
    }

    getColumn(index) {
        var column = new Array()
        var minSquare = Math.floor(index / 3)
        var maxSquare = minSquare + 6
        for (let square = minSquare; square <= maxSquare; square += 3) {
            let minField = (index % 3)
            let maxField = minField + 6
            for (let field = minField; field <= maxField; field += 3) {
                column.push(this.squares[square][field])
            }
        }
        return column
    }

    isSolved() {
        const emptyFields = this.getAllEmpty()
        if (emptyFields.length > 0) {
            return false
        }
        const mistakes = this.getMistakes()
        if (mistakes.length > 0) {
            return false
        }
        return true
    }

    getMistakes() {
        var mistakes = new Array()
        for (let i = 0; i < 9; i++) {
            const square = this.getSquare(i)
            if (!this.isValid(square)) {
                mistakes.push('square #' + (i + 1) + ' is invalid!')
            }
            const row = this.getRow(i)
            if (!this.isValid(row)) {
                mistakes.push('row #' + (i + 1) + ' is invalid!')
            }
            const column = this.getColumn(i)
            if (!this.isValid(column)) {
                mistakes.push('column #' + (i + 1) + ' is invalid!')
            }
        }
        return mistakes
    }

    isValid(array) {
        if (array == null || array.length != 9) {
            return false
        }
        for (let i = 0; i < array.length; i++) {
            const input = array[i]
            if (input == null || input.value == null) {
                return false
            }
            if (input.value == '' || input.value.length > 1) {
                continue
            }
            if (!VALID.includes(input.value)) {
                return false
            }
            for (let j = i + 1; j < array.length; j++) {
                const otherInput = array[j];
                if (input.value == otherInput.value) {
                    return false
                }
            }
        }
        return true
    }

    getAllEmpty() {
        let empty = new Array()
        for (let i = 0; i < 9; i++) {
            const square = this.getSquare(i)
            for (let j = 0; j < square.length; j++) {
                const field = square[j]
                if (field == null || field.value == null || field.value == '' || !VALID.includes(field.value)) {
                    empty.push(field)
                }
            }
        }
        return empty
    }

    getAnyEmpty() {
        const empty = this.getAllEmpty()
        if (empty != null && empty.length > 0) {
            const randomIndex = Math.floor(Math.random() * empty.length)
            return empty[randomIndex]
        }
        return null
    }

    serialize() {
        let serializedRows = new Array()
        for (let i = 0; i < 9; i++) {
            let serializedRow = new Array()
            const row = this.getRow(i)
            for (let j = 0; j < row.length; j++) {
                const v = row[j].value
                if (v.length == 1) {
                    serializedRow[j] = v
                } else {
                    serializedRow[j] = ''
                }
            }
            serializedRows[i] = serializedRow
        }
        return serializedRows
    }

    deserialize(serializedRows, useKeystrokes) {
        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            let row = this.getRow(rowIndex)
            const serializedRow = serializedRows[rowIndex]
            for (let columnIndex = 0; columnIndex < serializedRow.length; columnIndex++) {
                if (useKeystrokes) {
                    let choice = new KeyPressEvent(row[columnIndex], serializedRow[columnIndex])
                    choice.execute()
                } else {
                    row[columnIndex].value = serializedRow[columnIndex]
                }
            }
        }
    }

    deserializeGeneratedField(serializedRows) {
        this.deserialize(serializedRows, false)
    }

    deserializeSolution(serializedRows) {
        this.deserialize(serializedRows, true)
    }

    print() {
        console.log('printing ...')
        for (let i = 0; i < 9; i++) {
            console.log('square #' + i)
            const square = this.getSquare(i)
            for (let j = 0; j < square.length; j++) {
                const field = square[j]
                console.log(field)
            }
        }
    }

}

var field = new Field()