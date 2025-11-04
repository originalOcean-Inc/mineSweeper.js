// create pointers to the play btn and the form
const playBtn = document.getElementById("play")
const form = document.querySelector("form")

// adds functionality to the play button that will rmeove it and show form in its place
playBtn.addEventListener("click", () => {
    playBtn.remove()
    form.style.display = "block"
})


function generateGrid(width, height) {
    // grabs grid div from html
    const div = document.getElementById("grid")

    // creates table element
    const grid = document.createElement("table")

    // loops through for every 
    for (let i = 0; i < height; i++) { 
        let row = document.createElement("tr") // creates row

        // creates a td for every int in width and adds it to newly created row
        for (let j = 0; j < width; j++) {
            let td = document.createElement("td")
            row.appendChild(td)
        }
        grid.appendChild(row)
    }
    div.append(grid)
}

form.addEventListener("submit", evt => {
    evt.preventDefault()
    const width = parseInt(document.getElementById("width").value)
    const height = parseInt(document.getElementById("height").value)
    generateGrid(width, height)
    playBtn.remove()
    form.remove()

})
