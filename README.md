# mineSweeper.js
A JavaScript web app to recreate the classic MineSweeper game!

when you open up there should be a start button, when you click button itll display a form with option for grid

max width = 40 
max length = 20

feilds in form: 
    - width 
    - length 1-40

objects: 
    - grid
    - cell


when the user clicks we need to generate a deadzone, this should be a random integer of squares, less than half but more than 9 around the first click, mines cannot be randomly generated in this zone.

once the deadzone is identified, we need to randomly generate mines outside of the deadzone, 
we will have 2 types of cells, 