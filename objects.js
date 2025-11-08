export class Cell {
    constructor(x,y,display) {
        this.x = x
        this.y = y
        this.display = display
        this.state = "empty"
        this.marker = null
        this.hidden = true
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
            this.hidden = false
            grid.createDeadZone(this)
            
            // place bombs 
            grid.placeBombs()

            // identify and set markers
            grid.identifyMarkers()

            // show initial deadzone outline
            grid.showDeadzoneOutline()
        }
        else if (grid.flag == true) {
            let flagBtn = document.getElementById("flagBtn")
            this.display.textContent = "X"
            // removes event listners 
            this.display.style.pointerEvents = "none"
            
            // reset flag btn
            grid.flag = false
            flagBtn.style.backgroundColor = "white"
        
        } else {
            if (this.state == "empty") {
            this.state = "dead"
            this.hidden = false
            let surroundingCells = grid.getAllSurroundingCells(this)
            surroundingCells.forEach(cell => {
                if (cell.state == "empty") {
                    cell.click(grid)
                }
                })
                this.display.style.backgroundColor = "white"
                grid.showDeadzoneOutline()
            } else if (this.state == "bomb") {
                console.log(this.x,this.y,"BOOM!")
                this.display.style.backgroundColor = "red"
                grid.state = "lose"
            } else if (this.state == "marker") {
                this.display.style.backgroundColor = "white"
                this.hidden = false
                this.display.textContent = this.marker
            }
            let win = grid.checkForWin()
            return win
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
        this.flag = false
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
    // function to grab every 'dead' cell
    getDeadZone() {
        let deadCells = []
        this.cells.forEach(cell => {
            if (cell.state == "dead") {
                deadCells.push(cell)
            }
        })
        return deadCells
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
        let max = Math.floor(totalCells * 0.20)
        let min = 12
        let deadZoneSize = Math.floor(Math.random() * (max - min + 1)) + min
        console.log("dead zone size: ", deadZoneSize)
        let deadCells = 1
        let currentCell = cell
        
        while (deadCells <= deadZoneSize) {
            let surroundingCells = this.getAllSurroundingCells(currentCell)
            surroundingCells.forEach(cell => {
                if (cell.state == "empty") {
                    cell.state = "dead"
                    cell.hidden = false
                cell.display.style.backgroundColor = "white"
                deadCells ++
                }
            })
        currentCell = surroundingCells[Math.floor(Math.random() * surroundingCells.length)]
        }
    }
    placeBombs() {
        let emptyCells = this.getEmptyCells()
        console.log("empties before removing outline",emptyCells)
        let deadCells = this.getDeadZone()

    
        for (let i = 0; i < deadCells.length; i++){
            let cell = deadCells[i]
            let surroundingCells = this.getAllSurroundingCells(cell)
            surroundingCells.forEach(cell => {
                if (cell.state == "empty") {
                    emptyCells.splice(emptyCells.indexOf(cell),1)
                 // deletes it from empty cell if one of their surrounding cells is dead
                }
            })
        }
        console.log("empty cells after outline removed", emptyCells)

        // change these values to change range of possible bombs
        let min = Math.floor(emptyCells.length * 0.10)
        let max = Math.floor(emptyCells.length * 0.30)

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

    }
    identifyMarkers() {
        let emptyCells = this.getEmptyCells()

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
    showDeadzoneOutline() {
        let deadZone = this.getDeadZone()
        deadZone.forEach(cell => {
            // get the surrounding cells of every dead cell
            let surroundingCells = this.getAllSurroundingCells(cell)
            surroundingCells.forEach(cell => {
                if (cell.state != "dead") {
                    cell.click(this)
                }
            })
        })
    }
    checkForWin() {
        let clickableCells = []
        let win = true
    
        // loops through all cells and grabs any cell that isnt a bomb
        this.cells.forEach(cell => {
            if (cell.state != "bomb") {
                clickableCells.push(cell)
            }
        })

        clickableCells.forEach(cell => {
            if (cell.hidden == true) {
                win = false
            }
        })
        return win
    }
    removeClicks() {
        this.cells.forEach(cell => {
            cell.display.style.pointerEvents = "none"
        })
    }
    
    
}
