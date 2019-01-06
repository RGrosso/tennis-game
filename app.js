var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 6;
var ballSpeedY = 3;

var player1Score = 0; //User
var player2Score = 0; //CPU
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 60;
  setInterval(callBoth, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function callBoth() {
  moveEverything();
  drawEverything();
}

//Mouse click function
function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

//Mouse posistion
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

//Resets ball and checks scores
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 5;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 5;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; //Score change must be set before ballReset
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; //Score change must be set before ballReset
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  canvasContext.font = "bold 30px Arial";

  //Background
  colorRect(0, 0, canvas.width, canvas.height, "black");

  //Win Screen
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("You won!", canvas.width / 2, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("You lost!", canvas.width / 2, 200);
    }
    canvasContext.fillText("Click to continue...", canvas.width / 2, 400);
    return;
  }

  //Left User Paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#1f7a8c");

  //Right CPU Paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "#1f7a8c"
  );

  //Ball
  colorCircle(ballX, ballY, 10, "#0ebfe9");

  //Score
  canvasContext.fillText(player1Score, 150, 100);
  canvasContext.fillText(player2Score, canvas.width - 150, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
