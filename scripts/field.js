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

	get(rowIndex, columnIndex) {
		return this.rows[rowIndex][columnIndex]
	}

	set(rowIndex, columnIndex, inputField) {
		this.rows[rowIndex][columnIndex] = inputField
	}

	getValue(rowIndex, columnIndex) {
		return this.rows[rowIndex][columnIndex].value
	}

	setValue(rowIndex, columnIndex, v) {
		let newValue = v
		if (newValue == null || newValue == undefined) {
			newValue = ''
		}
		newValue = newValue.toString()
		if (newValue != '' && !VALID.includes(newValue)) {
			throw new Error('ERROR: trying to set [' + rowIndex + ',' + columnIndex + '] to illegal value [' + newValue + '] in \n' + this.toString())
		}
		this.get(rowIndex, columnIndex).value = v
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

	setSquare(index, fields) {
		if (index < 0 || index >= 9 || fields == null || fields.length != 9) {
			throw new Error('the parameters of [field.js::setSquare] are wrong [' + index + '][' + fields + ']')
		}
		var square = this.getSquare(index)
		for (let i = 0; i < 9; i++) {
			this.set(square[i].rowIndex, square[i].columnIndex, fields[i])
		}
	}

	serialize() {
		let serializedRows = new Array()
		for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
			let serializedRow = new Array()
			const row = this.getRow(rowIndex)
			for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
				const value = row[columnIndex].value
				if (value.length == 1) {
					serializedRow[columnIndex] = value
				} else {
					serializedRow[columnIndex] = ''
				}
			}
			serializedRows[rowIndex] = serializedRow
		}
		return serializedRows
	}

	deserialize(serializedRows, useKeystrokes) {
		for (let rowIndex = 0; rowIndex < serializedRows.length; rowIndex++) {
			const serializedRow = serializedRows[rowIndex]
			for (let columnIndex = 0; columnIndex < serializedRow.length; columnIndex++) {
				if (useKeystrokes) {
					let choice = new KeyPressEvent(this.get(rowIndex, columnIndex), serializedRow[columnIndex])
					choice.execute()
				} else {
					this.setValue(rowIndex, columnIndex, serializedRow[columnIndex])
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

	isSolved() {
		const emptyFields = this.getAllEmptyFields()
		if (emptyFields.length > 0) {
			return false
		}
		const mistakes = this.getMistakes()
		if (mistakes.length > 0) {
			return false
		}
		return true
	}

	getAllEmptyFields() {
		let emptyFields = new Array()
		for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
			for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
				const field = this.get(rowIndex, columnIndex)
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

	getPossibleValues(rowIndex, columnIndex) {
		const row = this.getRow(rowIndex)
		const column = this.getColumn(columnIndex)
		const square = this.getSquare(this.getSquareIndex(rowIndex, columnIndex))
		let possibleValues = new Array()
		for (let i = 1; i <= 9; i++) {
			if (includes(row, i)) {
				continue
			}
			if (includes(column, i)) {
				continue
			}
			if (includes(square, i)) {
				continue
			}
			possibleValues.push(i.toString())
		}
		return possibleValues
	}

	getSquareIndex(rowIndex, columnIndex) {
		return Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3)
	}

	clone() {
		let clonedField = new Field()
		for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
			const row = this.getRow(rowIndex)
			for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
				clonedField.setValue(rowIndex, columnIndex, this.getValue(rowIndex, columnIndex))
			}
		}
		return clonedField
	}

	toString() {
		let s = ''
		for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
			for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
				s += this.getValue(rowIndex, columnIndex) + '\t'
			}
			s += '\n'
		}
		return s
	}
}

function includes(array, value) {
	for (let i = 0; i < array.length; i++) {
		if (array[i].value == value) {
			return true
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