export class Cell {
    constructor(x,y,display) {
        this.x = x
        this.y = y
        this.display = display
        this.state = "empty"
        this.marker = null
    }
    getCoordinates() {
        return `${this.x}${this.y}`
    }
    click(grid) {
        // LOGIC FOR GRID SETUP
        if (grid.state == "initial") {
            grid.changeState()
            // change the values of the clicked cell and create deadzone
            this.state = "dead"
            this.display.style.backgroundColor = "white"
            grid.createDeadZone(this)
            
            // place bombs 
            grid.placeBombs()

            // identify markers
            grid.identifyMarkers()
        } 

        if (this.state == "empty") {
            this.state = "clicked"
            console.log(this.x,this.y," cell clicked!")
            this.display.style.backgroundColor = "black"
        } else if (this.state == "bomb") {
            console.log(this.x,this.y,"BOOM!")
            this.display.style.backgroundColor = "red"
        } else if (this.state == "marker") {
            this.display.style.backgroundColor = "white"
            this.display.textContent = this.marker
        }
    }
}

// grid can have states of initial, inGame & gameOver
export class Grid {
    constructor() {
        this.cells = []
        this.width = null
        this.height = null
        this.state = "initial"
    }
    // this method works as expected
    addCell(cell) {
        this.cells.push(cell)
    }
    getEmptyCells() {
        let emptyCells = []
        this.cells.forEach(cell => {
            if (cell.state == "empty") {
                emptyCells.push(cell)
            }
        })
        return emptyCells
    }
    // this method works as expected
    getState() {
        return this.state
    }
    // this method works as expected
    changeState() {
        if (this.state == "initial") {
            this.state = "inGame"
        }
    }
    // this method works as expected
    getCell(x,y) {
        let cellToGrab = null
        this.cells.forEach(cell => {
            if (cell.x == x && cell.y == y) {
                cellToGrab = cell
            }
        })
        return cellToGrab
    }
    // this method works as expected
    getSurroundingCells(cell) {
        let surroundingCells = []
        let x = cell.x
        let y = cell.y
        
        let leftCell = this.getCell(x - 1,y)
        if (leftCell != null) {
            surroundingCells.push(leftCell)
        }
        let rightCell = this.getCell(x + 1,y)
        if (rightCell != null) {
            surroundingCells.push(rightCell)
        }
        let topCell = this.getCell(x,y + 1)
        if (topCell != null) {
            surroundingCells.push(topCell)
        }
        let bottomCell = this.getCell(x,y - 1)
        if (bottomCell != null) {
            surroundingCells.push(bottomCell)
        }
        return surroundingCells
    }
    getAllSurroundingCells(cell) {
        let surroundingCells = []
        let x = cell.x
        let y = cell.y
        
        let leftCell = this.getCell(x - 1,y)
        if (leftCell != null) {
            surroundingCells.push(leftCell)
        }
        let topLeftCell = this.getCell(x - 1,y + 1)
        if (topLeftCell != null) {
            surroundingCells.push(topLeftCell)
        }
        let topCell = this.getCell(x,y + 1)
        if (topCell != null) {
            surroundingCells.push(topCell)
        }
        let topRightCell = this.getCell(x + 1,y + 1)
        if (topRightCell != null) {
            surroundingCells.push(topRightCell)
        }
        let rightCell = this.getCell(x + 1,y)
        if (rightCell != null) {
            surroundingCells.push(rightCell)
        }
        let bottomRightCell = this.getCell(x + 1,y - 1)
        if (bottomRightCell != null) {
            surroundingCells.push(bottomRightCell)
        }
        let bottomCell = this.getCell(x,y - 1)
        if (bottomCell != null) {
            surroundingCells.push(bottomCell)
        }
        let bottomLeftCell = this.getCell(x -1,y - 1)
        if (bottomLeftCell != null) {
            surroundingCells.push(bottomLeftCell)
        }
        

        return surroundingCells
    }
    createDeadZone(cell) {
        // we want the deadzone to be a minimum of like 12 cells but a maximum of 40%
        let totalCells = this.width * this.height
        let max = Math.floor(totalCells * 0.40)
        let min = 12
        let deadZoneSize = Math.floor(Math.random() * (max - min + 1)) + min
        console.log("dead zone size: ",deadZoneSize)
        let deadCells = 1
        let currentCell = cell
        
        while (deadCells <= deadZoneSize) {
            let surroundingCells = this.getSurroundingCells(currentCell)
            surroundingCells.forEach(cell => {
                if (cell.state == "empty") {
                    cell.state = "dead"
                cell.display.style.backgroundColor = "white"
                deadCells ++
                }
                
            })
        currentCell = surroundingCells[Math.floor(Math.random() * surroundingCells.length)]
        }
    }
    placeBombs() {
        let emptyCells = this.getEmptyCells()
        console.log(emptyCells)
        // change these values to change range of possible bombs
        let min = Math.floor(emptyCells.length * 0.30)
        let max = Math.floor(emptyCells.length * 0.60)

        let bombsToPlace = Math.floor(Math.random() * (max - min + 1)) + min
        let bombsPlaced = 0
        console.log("bombs to place",bombsToPlace)

        // loop until all bombs are placed
        while (bombsPlaced < bombsToPlace) {
            const idx = Math.floor(Math.random() * emptyCells.length);
            const cell = emptyCells.splice(idx, 1)[0]; // remove chosen cell from pool
            cell.state = "bomb";
            bombsPlaced++;
        }

        emptyCells = this.getEmptyCells()
        console.log("markerCells: ",emptyCells)

    }
    identifyMarkers() {
        let emptyCells = this.getEmptyCells()
        console.log("markerCells: ",emptyCells)

        emptyCells.forEach(cell => {
            let surroundingCells = this.getAllSurroundingCells(cell)
            let bombsTouchingCell = 0
            surroundingCells.forEach(surroundingCell => {
                if (surroundingCell.state == "bomb") {
                    bombsTouchingCell++
                }
            })
            if (bombsTouchingCell > 0) {
                cell.state = "marker"
                cell.marker = bombsTouchingCell
            }
        })
    }
    
}
