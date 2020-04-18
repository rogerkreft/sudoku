class Field {

    constructor() {
        console.log('initializing field ...')
        this.squares = new Map()
    }

    insertSquare(index, fields) {
        console.log('inserting square #' + index)
        if (!this.squares.has(index)) {
            this.squares.set(index, new Array())
        }
        var square = this.squares.get(index)
        for (let i = 0; i < 9; i++) {
            square[i] = fields[i]
        }
    }

    print() {
        console.log('printing ...')
        for (let i = 0; i < 9; i++) {
            var square = this.squares.get(i)
            console.log('square #' + i)
            for (let j = 0; j < square.length; j++) {
                console.log(square[j])
            }
        }
    }
}