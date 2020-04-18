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

    getMistakes() {
        var mistakes = new Array()
        for (let i = 0; i < 9; i++) {
            const square = this.getSquare(i)
            if (!this.isValid(square)) {
                mistakes.push('square #' + i + ' is invalid!')
            }
            const row = this.getRow(i)
            if (!this.isValid(row)) {
                mistakes.push('row #' + i + ' is invalid!')
            }
            const column = this.getColumn(i)
            if (!this.isValid(column)) {
                mistakes.push('column #' + i + ' is invalid!')
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