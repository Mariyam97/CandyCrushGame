// Wait for the HTML document to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Select necessary elements from the HTML
  const grid = document.querySelector('.grid'); // The game grid
  const scoreDisplay = document.getElementById('score'); // Element to display the score
  const width = 8; // Width of the game grid (8x8)
  const squares = []; // Array to hold the candy squares
  let score = 0; // Initialize the score

  // An array of candy colors represented by image URLs
  const candyColors = [
      'url(red-candy.png)',
      'url(yellow-candy.png)',
      'url(orange-candy.png)',
      'url(purple-candy.png)',
      'url(green-candy.png)',
      'url(blue-candy.png)'
  ];

  // Function to create the game board
  function createBoard() {
      for (let i = 0; i < width * width; i++) {
          const square = document.createElement('div');
          square.setAttribute('draggable', true);
          square.setAttribute('id', i);
          let randomColor = Math.floor(Math.random() * candyColors.length);
          square.style.backgroundImage = candyColors[randomColor];
          grid.appendChild(square);
          squares.push(square);
      }
  }
  createBoard(); // Call the function to create the board

  // Variables to track the candy being dragged
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  // Add drag and drop event listeners to candy squares
  squares.forEach(square => square.addEventListener('dragstart', dragStart));
  squares.forEach(square => square.addEventListener('dragend', dragEnd));
  squares.forEach(square => square.addEventListener('dragover', dragOver));
  squares.forEach(square => square.addEventListener('dragenter', dragEnter));
  squares.forEach(square => square.addEventListener('dragleave', dragLeave));
  squares.forEach(square => square.addEventListener('drop', dragDrop));

  // Function to handle drag start
  function dragStart() {
      colorBeingDragged = this.style.backgroundImage;
      squareIdBeingDragged = parseInt(this.id);
  }

  // Function to handle drag over
  function dragOver(e) {
      e.preventDefault();
  }

  // Function to handle drag enter
  function dragEnter(e) {
      e.preventDefault();
  }

  // Function to handle drag leave
  function dragLeave() {
      this.style.backgroundImage = '';
  }

  // Function to handle drag drop
  function dragDrop() {
      colorBeingReplaced = this.style.backgroundImage;
      squareIdBeingReplaced = parseInt(this.id);
      this.style.backgroundImage = colorBeingDragged;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  // Function to handle drag end
  function dragEnd() {
      // Logic for valid and invalid moves
      let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width];
      let validMove = validMoves.includes(squareIdBeingReplaced);

      if (squareIdBeingReplaced && validMove) {
          squareIdBeingReplaced = null;
      } else if (squareIdBeingReplaced && !validMove) {
          squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
          squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
      } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }

  // Function to move candies into empty squares below
  function moveIntoSquareBelow() {
      for (let i = 0; i < 55; i++) {
          if (squares[i + width].style.backgroundImage === '') {
              squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
              squares[i].style.backgroundImage = '';
              const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
              const isFirstRow = firstRow.includes(i);
              if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                  let randomColor = Math.floor(Math.random() * candyColors.length);
                  squares[i].style.backgroundImage = candyColors[randomColor];
              }
          }
      }
  }

  // Function to refill empty squares
  function refillEmptySquares() {
      for (let i = 0; i < width; i++) {
          const column = [];
          for (let j = 0; j < width; j++) {
              const square = squares[j * width + i];
              if (square.style.backgroundImage === '') {
                  let randomColor = Math.floor(Math.random() * candyColors.length);
                  square.style.backgroundImage = candyColors[randomColor];
              }
          }
      }
  }

  // Check for matches in a row of four
  function checkRowForFour() {
      for (let i = 0; i < 60; i++) {
          let rowOfFour = [i, i + 1, i + 2, i + 3];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === '';

          const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
          if (notValid.includes(i)) continue;

          if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
              score += 4;
              scoreDisplay.innerHTML = score;
              rowOfFour.forEach(index => {
                  squares[index].style.backgroundImage = '';
              });
          }
      }
  }
  checkRowForFour(); // Call the function

  // Check for matches in a column of four
  function checkColumnForFour() {
      for (let i = 0; i < 39; i++) {
          let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === '';

          if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
              score += 4;
              scoreDisplay.innerHTML = score;
              columnOfFour.forEach(index => {
                  squares[index].style.backgroundImage = '';
              });
          }
      }
  }
  checkColumnForFour(); // Call the function

  // Check for matches in a row of three
  function checkRowForThree() {
      for (let i = 0; i < 61; i++) {
          let rowOfThree = [i, i + 1, i + 2];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === '';

          const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
          if (notValid.includes(i)) continue;

          if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
              score += 3;
              scoreDisplay.innerHTML = score;
              rowOfThree.forEach(index => {
                  squares[index].style.backgroundImage = '';
              });
          }
      }
  }
  checkRowForThree(); // Call the function

  // Check for matches in a column of three
  function checkColumnForThree() {
      for (let i = 0; i < 47; i++) {
          let columnOfThree = [i, i + width, i + width * 2];
          let decidedColor = squares[i].style.backgroundImage;
          const isBlank = squares[i].style.backgroundImage === '';

          if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
              score += 3;
              scoreDisplay.innerHTML = score;
              columnOfThree.forEach(index => {
                  squares[index].style.backgroundImage = '';
              });
          }
      }
  }
  checkColumnForThree(); // Call the function

  // Set up an interval to periodically check for matches, move candies, and refill empty squares
  window.setInterval(function () {
      checkRowForFour();
      checkColumnForFour();
      checkRowForThree();
      checkColumnForThree();
      moveIntoSquareBelow();
      refillEmptySquares();
  }, 100); // Interval duration (milliseconds)
});
