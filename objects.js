export class Cell {
    constructor(x,y,display) {
        this.x = x
        this.y = y
        this.display = display
        this.state = "empty"
    }
    getCoordinates() {
        return `${this.x}${this.y}`
    }
    click(grid) {
        if (grid.state == "initial") {
            grid.changeState()
            let surroundingCells = grid.getSurroundingCells(this)
            grid.createDeadZone(this)
            this.state = "dead"
            this.display.style.backgroundColor = "white"

        } 
        if (this.state == "empty") {
            this.state = "clicked"
            console.log(this.x,this.y," cell clicked!")
            this.display.style.backgroundColor = "black"
        } else {
            console.log("button already clicked!")
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
        console.log(surroundingCells)
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
}
