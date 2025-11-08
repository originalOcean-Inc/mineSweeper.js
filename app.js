// imports
import { Cell, Grid } from "./objects.js"



// create pointers to the play btn and the form
const playBtn = document.getElementById("play")
const form = document.querySelector("form")
const grid = new Grid()
const winBox = document.getElementById("winBox")

// adds functionality to the play button that will remove it and show form in its place
playBtn.addEventListener("click", () => {
    playBtn.remove()
    form.style.display = "block"
})



function generateGrid(width, height) {
    // grabs grid div from html
    const div = document.getElementById("grid")

    // creates table element
    const display = document.createElement("table")

    grid.width = width
    grid.height = height
    // loops through for every 
    for (let i = 1; i <= height; i++) { 
        let row = document.createElement("tr") // creates row

        // creates a td for every int in width and adds it to newly created row
        for (let j = 1; j <= width; j++) {

            
            let td = document.createElement("td")
            td.style.backgroundColor = "grey"
            row.appendChild(td)
            let cell = new Cell(j,i,td)
            grid.addCell(cell)
            td.addEventListener("click", evt => {
                let win = cell.click(grid)
                console.log(grid)
                if (win == true) {
                    winBox.textContent = "you win!"
                    grid.removeClicks()
                }
            })
            td.id = `${j}${i}`
            
        }
        display.appendChild(row)
    }
    div.append(display)
    console.log(grid)
}

form.addEventListener("submit", evt => {
    evt.preventDefault()
    const width = parseInt(document.getElementById("width").value)
    const height = parseInt(document.getElementById("height").value)
    generateGrid(width, height)
    playBtn.remove()
    form.remove()
})
