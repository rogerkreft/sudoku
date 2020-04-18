class Field {

    constructor() {
        this.squares = new Map()
    }

    insertSquare(index, fields) {
        if (!this.squares.has(index)) {
            this.squares.set(index, new Array())
        }
        var square = this.squares.get(index)
        for (let i = 0; i < 9; i++) {
            square[i] = fields[i]
        }
    }

    getSquare(index) {
        if (!this.squares.has(index)) {
            this.squares.set(index, new Array())
        }
        return this.squares.get(index)
    }

    getRow(index) {
        var row = new Array()
        var minSquare = Math.floor(index / 3) * 3
        var maxSquare = minSquare + 2
        for (let square = minSquare; square <= maxSquare; square++) {
            let minField = (index % 3) * 3
            let maxField = minField + 2
            for (let field = minField; field <= maxField; field++) {
                row.push(this.squares.get(square)[field])
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
                column.push(this.squares.get(square)[field])
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
            if (input.value == '') {
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
        let serializedSquares = new Map()
        for (let i = 0; i < 9; i++) {
            let serializedSquare = new Array()
            const square = this.getSquare(i)
            for (let j = 0; j < square.length; j++) {
                serializedSquare[j] = square[j].value
            }
            serializedSquares.set(i, serializedSquare)
        }
        return serializedSquares
    }

    deserialize(serializedSquares) {
        for (let i = 0; i < 9; i++) {
            let square = this.getSquare(i)
            const serializedSquare = serializedSquares.get(i)
            for (let j = 0; j < serializedSquare.length; j++) {
                let choice = new KeyPressEvent(square[j], serializedSquare[j])
                choice.execute()
            }
        }
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