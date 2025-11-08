// imports
import { Cell, Grid } from "./objects.js"



// create pointers for all global elements
const playBtn = document.getElementById("play")
const form = document.querySelector("form")
let grid = new Grid()
const winBox = document.getElementById("winBox")
const div = document.getElementById("grid")


// adds functionality to the play button that will remove it and show form in its place
playBtn.addEventListener("click", () => {
    playBtn.remove()
    form.style.display = "block"
})

function addPlayAgainBtn() {
    // add play again button 
                    let playAgainBtn = document.createElement("button")
                    playAgainBtn.textContent = "Play again?"
                    playAgainBtn.addEventListener("click", evt => {
                        div.innerHTML = ""
                        grid = new Grid()
                        form.style.display = "block"
                        evt.target.remove()
                    })
                    div.appendChild(playAgainBtn)

}

function generateGrid(width, height) {
    // generates board in the 'div' element
    winBox.textContent = ""
    
    let flagBtn = document.createElement("button")
    flagBtn.textContent = "FLAG"
    flagBtn.id = "flagBtn"
    flagBtn.addEventListener("click", () => {
        grid.flag = true
        flagBtn.style.backgroundColor = "lightblue"
    })
    div.appendChild(flagBtn)
    

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
            td.addEventListener("click", () => {
                let win = cell.click(grid)
                console.log(grid)
                // logic for if you win
                if (win == true) {
                    // display winning message to user
                    winBox.textContent = "you win!"
                    // add play again button 
                    addPlayAgainBtn()
                    grid.removeClicks()
                // logic if you lose
                } else if (grid.state == "lose") {
                    winBox.textContent = "You Lose!"
                    grid.removeClicks()
                    addPlayAgainBtn()
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
    form.style.display = "none"
})

