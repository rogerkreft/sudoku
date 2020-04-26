importScripts('misc.js')
importScripts('field.js')

var feedbackFunction = function () { return false }
var field
var solutions
var done

function reset() {
	field = new Field()
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
		const start = new Date().getTime()
		postMessage(generate())
		const duration = (new Date().getTime() - start) / 1000
		console.log('generated a sudoku with a unique solution in', duration, 'seconds')
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
	if (done) {
		postMessage('ERROR: sudoku is not solvable!')
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
	field.deserialize(data, false)
	solve()
	done = true
}

function solve() {
	if (field.isSolved()) {
		if (!asStringsArray(solutions).includes(field.toString())) {
			solutions.push(field.clone())
		}
		return true
	}
	if (feedbackFunction()) {
		return false
	}
	const nextEmptyField = field.getNextEmptyField()
	if (nextEmptyField == null) {
		return false
	}
	const emptyField = nextEmptyField.field
	if (emptyField == null) {
		return false
	}
	const possibleValues = nextEmptyField.possibleValues
	if (possibleValues == null || possibleValues.length == 0) {
		return false
	}
	for (let v = 0; v < possibleValues.length; v++) {
		emptyField.value = possibleValues[v]
		solve()
	}
	emptyField.value = ''
	return false
}

function abortOnMoreThanOneSolution() {
	if (solutions.length > 1) {
		return true
	}
	return false
}

function generate() {
	console.log('generating field')
	let generatedField = getRandomInitialField()
	feedbackFunction = abortOnMoreThanOneSolution
	console.log('removing fields as long as there is only a single possible solution')
	while (true) {
		let filledFields = shuffle(generatedField.getAllFilledFields())
		let filledFieldCount = filledFields.length
		for (let i = 0; i < filledFieldCount; i++) {
			const field = filledFields[i]
			const oldValue = field.value
			field.value = ''
			generateSolutions(generatedField.serialize())
			if (solutions.length == 1) {
				filledFieldCount--
			} else {
				field.value = oldValue
			}
		}
		if (generatedField.getAllFilledFields().length == filledFieldCount) {
			console.log('no values are removable from field without having more than one solution. We found a sudoku!')
			break
		}
	}
	return generatedField.serialize()
}

function getRandomInitialField() {
	console.log('building random initial field')
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
	console.log('getting a possible solution of the random initial field')
	feedbackFunction = function () { return (solutions.length > 0) }
	this.solve()
	if (solutions.length == 0) {
		console.log('restarting because of insolvable field\n' + field.toString())
		return getRandomInitialField()
	}
	return solutions[0]
}