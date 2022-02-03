/* Sector states: 0 - empty, 1 - filled. */

/** The node of the field. */
let fieldNode = document.querySelector('#field')
/** The node of the Shape1 */
let shapesNodes = [null, document.querySelector('#shape1'), document.querySelector('#shape2'), document.querySelector('#shape3')]
/** An object with all sectors. */
let sectors = {}
/** An object with all new shapes sectors. */
let shapeSectors = {}
/** All possible shapes. Shapes are drawn around its center:
 * r - right, ur - up-right, etc.
 * Contains arrays of functions that must be called with (sector, callback).
 */
let draggedSector = null
let allShapes = [
    ['3-3'], ['2-2', 'r'], ['3-3', 'u'], ['3-2', 'ur'], ['3-3', 'ul'], ['3-2', 'u', 'r'],
    ['2-2', 'd', 'r'], ['2-4', 'd', 'l'], ['3-4', 'u', 'l'], ['3-3', 'u', 'd'], ['3-3', 'l', 'r'],
    ['3-3', 'ur', 'dl'], ['3-3', 'ul', 'dr'], ['2-3', 'u', 'd', 'd2'], ['3-2', 'l', 'r', 'r2'],
    ['2-3', 'l', 'd', 'd2'], ['3-4', 'l', 'l2', 'u'], ['4-2', 'u', 'u2', 'r'], ['3-2', 'u', 'r', 'r2'],
    ['3-2', 'd', 'r', 'ur'], ['3-3', 'd', 'l', 'ul'], ['2-3', 'l', 'd', 'dr'], ['3-3', 'r', 'd', 'dl'],
    ['2-2', 'd', 'r', 'dr'], ['3-3', 'u', 'l', 'r'], ['2-3', 'd', 'l', 'r'], ['3-3', 'l', 'u', 'd'],
    ['3-2', 'r', 'u', 'd'], ['3-3', 'u', 'u2', 'd', 'd2'], ['3-3', 'l', 'l2', 'r', 'r2'], ['3-3', 'u', 'd', 'r', 'l'],
    ['3-3', 'l', 'ul', 'r', 'ur'], ['2-3', 'l', 'dl', 'r', 'dr'], ['3-2', 'u', 'ur','d', 'dr'],
    ['3-3', 'u', 'ul', 'd', 'dl'], ['2-2', 'r', 'r2', 'd', 'd2'], ['2-4',  'l', 'l2', 'd', 'd2'],
    ['4-2', 'u', 'u2', 'r', 'r2'], ['3-4', 'u', 'u2', 'l', 'l2']
]
// allShapes = [
//     ['3-3'], ['2-3', 'r'], ['3-3', 'u'], ['3-3', 'ur'], ['3-3', 'ul'], ['3-3', 'u', 'r'],
//     ['2-3', 'd', 'r'], ['2-4', 'd', 'l'], ['3-4', 'u', 'l'], ['3-3', 'u', 'd'], ['3-3', 'l', 'r'],
//     ['3-3', 'ur', 'dl'], ['3-3', 'ul', 'dr'], ['2-3', 'u', 'd', 'd2'], ['3-3', 'l', 'r', 'r2'],
//     ['2-3', 'l', 'd', 'd2'], ['3-4', 'l', 'l2', 'u'], ['4-3', 'u', 'u2', 'r'], ['3-3', 'u', 'r', 'r2'],
//     ['3-3', 'd', 'r', 'ur'], ['3-3', 'd', 'l', 'ul'], ['2-3', 'l', 'd', 'dr'], ['3-3', 'r', 'd', 'dl'],
//     ['2-3', 'd', 'r', 'dr'], ['3-3', 'u', 'l', 'r'], ['2-3', 'd', 'l', 'r'], ['3-3', 'l', 'u', 'd'],
//     ['3-3', 'r', 'u', 'd'], ['3-3', 'u', 'u2', 'd', 'd2'], ['3-3', 'l', 'l2', 'r', 'r2'], ['3-3', 'u', 'd', 'r', 'l'],
//     ['3-3', 'l', 'ul', 'r', 'ur'], ['2-3', 'l', 'dl', 'r', 'dr'], ['3-3', 'u', 'ur','d', 'dr'],
//     ['3-3', 'u', 'ul', 'd', 'dl'], ['2-3', 'r', 'r2', 'd', 'd2'], ['2-4',  'l', 'l2', 'd', 'd2'],
//     ['4-3', 'u', 'u2', 'r', 'r2'], ['3-4', 'u', 'u2', 'l', 'l2']
// ]
let newGameButton = document.querySelector('#newGame')
newGameButton.addEventListener('click', startNewGame)

function startNewGame () {
    sectors = {}
    shapeSectors = {}
    draggedSector = null

    clearField()
    drawField()

    for (let i = 1; i < 4; i++) redrawShape(i)
}

function clearField () {
    fieldNode.innerHTML = ''
    // Some other actions?
}

function drawField () {
    for (let i = 1; i < 10; i++) for (let j = 1; j < 10; j++) createNewSector(i, j)
    // Some other actions?
}

function redrawShape(shapeField) {
    clearShape(shapeField)
    drawShape(shapeField)
}

function clearShape(shapeField) {
    shapesNodes[shapeField].innerHTML = ''
    shapesNodes[shapeField].shapeType = ''
    // Some other actions?
}

function drawShape(shapeField) {
    shapeSectors[shapeField] = {}

    //ToDo: make a better random.
    let shapeType = Math.round(Math.random()*38)
    let currentShape = allShapes[shapeType]
    shapesNodes[shapeField].shapeType = shapeType

    for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) createNewSector(i, j, shapeField)

    let initialSector = shapeSectors[shapeField][`${shapeField}_${currentShape[0]}`]
    initialSector.makeFilled()

    if (shapeType = 0) return //Initial sector is already marked.
    //Run all given directions around the initial sector. 
    for (let i = 1; i < currentShape.length; i++) {
        let currentDirection = currentShape[i]
        let targetID = initialSector.sectorsAround[currentDirection]
        let target = shapeSectors[shapeField][targetID]

        target.makeFilled()
    }
}

/**
 * Creates a new sector.
 * @param {number} x X coordinate of the sector.
 * @param {number} y Y coordinate of the sector.
 * @param {number} shapeField The number of the coming shape field.
 */
function createNewSector(x, y, shapeField) {
    let prefix = shapeField ? `${shapeField}_` : ''
    let classPrefix = shapeField ? 'shape-' : ''
    let parentNode = shapeField? shapesNodes[shapeField] : fieldNode
    let parentObject = shapeField ? shapeSectors[shapeField] : sectors
    let shapeType = shapeField ? shapesNodes[shapeField].shapeType : null
    let currentShape = shapeField ? allShapes[shapeType] : null

    let id = `${prefix}${x}-${y}`

    let newSector = document.createElement(`${classPrefix}sector`)
    newSector.classList.add(`${classPrefix}sector`)
    newSector.setAttribute('x', x)
    newSector.setAttribute('y', y)
    newSector.draggable = shapeField ? true : false
    newSector.x = x
    newSector.y = y
    newSector.id = id
    newSector.state = 0

    if (shapeField) {
        newSector.shapeField = shapeField
        newSector.shapeType = shapeType
        newSector.icon = new Image()
        newSector.icon.src = (`./images/shapes/${shapeType}.png`)
        newSector.setAttribute('shape-field', shapeField)
        newSector.iconX = 19
        newSector.iconY = 19
        //Move drag icon if has 'u', 'u2', 'l', 'l2'
        for (let i = 1; i < currentShape.length; i++) {
            if (currentShape[i] == 'l' || currentShape[i] == 'ul' || currentShape[i] == 'dl') newSector.iconX = 57
            if (currentShape[i] == 'l2') newSector.iconX = 95
            if (currentShape[i] == 'u' || currentShape[i] == 'ul' || currentShape[i] == 'ur') newSector.iconY = 57
            if (currentShape[i] == 'u2') newSector.iconY = 95
        }
    }

    newSector.addEventListener('click', (e) => {
        e.target.handleClick()
    })
    newSector.makeFilled = function () {
        this.classList.add('shape-sector_filled')
    }
    newSector.makeDragGood = function () {
        this.classList.add('sector_drag-good')
    }
    newSector.makeDragBad = function () {
        this.classList.add('sector_drag-bad')
    }
    newSector.makeNotDrag = function () {
        this.classList.remove('sector_drag-good')
        this.classList.remove('sector_drag-bad')
    }
    newSector.handleClick = function () {
        console.log(`${this.id} clicked.`)
    }
    newSector.handleDragStart = function () {
        draggedSector = this
        let sectors = shapesNodes[this.shapeField].childNodes
        for (let i = 0; i < sectors.length; i++) {
            let sector = sectors[i]
            if (sector.classList.contains('shape-sector_filled')) sector.classList.add('shape-sector_dragged')
        }
    }
    newSector.handleDragEnd = function () {
        draggedSector = null
        let sectors = shapesNodes[this.shapeField].childNodes
        for (let i = 0; i < sectors.length; i++) {
            let sector = sectors[i]
            if (sector.classList.contains('shape-sector_dragged')) sector.classList.remove('shape-sector_dragged')
        }
    }
    newSector.handleDragOver = function () {
        let isDragOK = true
        this.makeDragGood()
        currentShape = draggedSector.shapeType
        for (let i = 1; i < allShapes[currentShape].length; i++) {
            let currentID = this.sectorsAround[allShapes[currentShape][i]]
            if (!currentID) {
                isDragOK = false
                break
            }
            let currentSector = sectors[currentID]
            currentSector.makeDragGood()
        }
        //ToDo: Place for checking for filled sectors.
        if (isDragOK) return
        this.makeDragBad()
        for (let i = 1; i < allShapes[currentShape].length; i++) {
            let currentID = this.sectorsAround[allShapes[currentShape][i]]
            if (!currentID) continue
            let currentSector = sectors[currentID]
            currentSector.makeDragBad()
        }
    }
    newSector.handleDragLeave = function () {
        this.makeNotDrag()
        currentShape = draggedSector.shapeType
        for (let i = 1; i < allShapes[currentShape].length; i++) {
            let currentID = this.sectorsAround[allShapes[currentShape][i]]
            if (!currentID) continue
            let currentSector = sectors[currentID]
            currentSector.makeNotDrag()
        }
    }
    newSector.handleDrop = function () {
        console.log(`Dropped to ${this.id}.`)
    }


    if (shapeField) newSector.addEventListener('dragstart', (e) => {
        let sector = e.target
        e.dataTransfer.setDragImage(sector.icon, sector.iconX, sector.iconY);
        sector.handleDragStart()
    })
    if (shapeField) newSector.addEventListener('dragend', (e) => {
        e.target.handleDragEnd()
    })
    if (!shapeField) newSector.addEventListener('dragover', (e) => {
        e.target.handleDragOver()
    })
    if (!shapeField) newSector.addEventListener('dragleave', (e) => {
        e.target.handleDragLeave()
    })
    if (!shapeField) newSector.addEventListener('drop', (e) => {
        e.target.handleDrop()
    })


    newSector.sectorsAround = detectSectorsAround(x, y, prefix) 

    parentObject[id] = newSector
    parentNode.appendChild(newSector)
}

/**
 * Returns an object with existing sectors around the given coordinates.
 * @param {number} x X coordinate.
 * @param {number} y Y coordinate.
 * @param {number} prefix Prefix for the name.
 * @returns {object} An object with existing surrounding sectors.
 */
function detectSectorsAround (x, y, prefix) {
    let sectorsAround = {}

    sectorsAround.u = x < 2 ? null : `${prefix}${x - 1}-${y}`
    sectorsAround.u2 = x < 3 ? null : `${prefix}${x - 2}-${y}`
    sectorsAround.d = x > 8 ? null : `${prefix}${x + 1}-${y}`
    sectorsAround.d2 = x > 7 ? null : `${prefix}${x + 2}-${y}`
    sectorsAround.l = y < 2 ? null : `${prefix}${x}-${y - 1}`  
    sectorsAround.l2 = y < 3 ? null : `${prefix}${x}-${y - 2}`  
    sectorsAround.r = y > 8 ? null : `${prefix}${x}-${y + 1}`   
    sectorsAround.r2 = y > 7 ? null : `${prefix}${x}-${y + 2}`
    sectorsAround.ur = x < 2 || y > 8 ? null : `${prefix}${x - 1}-${y + 1}`
    sectorsAround.ul = x < 2 || y < 2 ? null : `${prefix}${x - 1}-${y - 1}`
    sectorsAround.dr = x > 8 || y > 8 ? null : `${prefix}${x + 1}-${y + 1}`
    sectorsAround.dl = x > 8 || y < 2 ? null : `${prefix}${x + 1}-${y - 1}`

    return sectorsAround
}

startNewGame()