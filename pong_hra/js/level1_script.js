
const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

const paddleSound = new Audio('../audio/paddle_bounce.mp3');
const scoreSound_player = new Audio('../audio/player_score.mp3');
const scoreSound_computer = new Audio('../audio/computer_score.mp3');
const wallHitSound = new Audio('../audio/ball1_bounce.mp3');


const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

var angleOffSet =0;




const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FF00FF",
};

//paddles
const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#7FFFD4',
  score: 0
};

const ai = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#DC143C',
  score: 0
};


const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#05EDFF'
};








function drawNet() {

  ctx.fillStyle = net.color;

  
  ctx.fillRect(net.x, net.y, net.width, net.height);
}


function drawScore(x, y, score) {
  ctx.fillStyle = '#33FF00';
  ctx.font = '35px sans-serif';
  ctx.fillText(score, x, y);
}


function drawPaddle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}


function drawBall(x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
 
  ctx.arc(x, y, radius, 0, Math.PI * 2, true); 
  ctx.closePath();
  ctx.fill();
}







window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);


function keyDownHandler(event) {

  switch (event.keyCode) {
    // up key
    case 38:     
      upArrowPressed = true;
      break;
    // down key
    case 40:
      downArrowPressed = true;
      break;
  }
}

//letting go of the key
function keyUpHandler(event) {
  switch (event.keyCode) {

    case 38:
      upArrowPressed = false;
      break;

    case 40:
      downArrowPressed = false;
      break;
  }
}



// reset the ball
function reset() {
  
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2; 

 
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}


function collisionDetect(player, ball) {
  
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}



function update() {  
  ai_movement();
  

  // move the paddle
  if (upArrowPressed && user.y > 0) {
    user.y -= 8;
  } else if (downArrowPressed && (user.y < canvas.height - user.height)) {
    user.y += 8;
  }

  // bottom wall
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    
    wallHitSound.play();
    ball.velocityY = -ball.velocityY;
  }

   // right wall player scores
   if (ball.x + ball.radius >= canvas.width) {
  
    scoreSound_player.play();
    
    user.score += 1;
    if (user.score == 3) ball.speed +=3; 
    if (user.score == 6) ball.speed +=3;
    if (user.score == 9) ball.speed +=3;
    if (user.score == 10)
    {
        alert("YOU WIN!");
        document.location = 'mainMenu.html';
    }
    reset();
  }

  // left wall ai scores
  if (ball.x - ball.radius <= 0) {

    
    scoreSound_computer.play();
   
    ai.score += 1;
    if (ai.score == 10)
    {
        alert("GAME OVER!");
        document.location='gameOver.html';
    }
    reset();
  }

  // ball movement
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  

  // ai movement
  function ai_movement()
  {
      if (ai.y<ball.y) ai.y+=3;
      else ai.y-=3;

      if (user.score>=3 && user.score <6) 
      {
        if (ai.y<ball.y) ai.y+=3.5;
        else ai.y-=3.5;
      }

      if (user.score>=6 && user.score <9)
      {
        if (ai.y<ball.y) ai.y+=4;
        else ai.y-=4;
      }

      if (user.score >= 9)
      {
        if (ai.y<ball.y) ai.y+=5;
        else ai.y-=5;
      }
  }

  // collision detection on paddles
  let player = (ball.x < canvas.width / 2) ? user : ai;

  if (collisionDetect(player, ball)) {
   
    paddleSound.play();
 
    let angle = 0;
    angleOffSet = Math.floor(Math.random()*7)
    if (angleOffSet == 0 || angleOffSet == 1 || angleOffSet == 2) angleOffSet = 3;
    //top of the paddle
    if (ball.y < (player.y + player.height / 2)) {      
      angle = -1 * Math.PI / angleOffSet; //math.pi/4
    } else if (ball.y > (player.y + player.height / 2)) {
      // bottom of the paddle
      angle = Math.PI / angleOffSet;
    } 
    //f it hits middle of the paddle
    else angle = math.PI /angleOffSet;   

    ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    
  }
 
}


function draw() {
  
  ctx.fillStyle = "#2F0C35"; //2F0C35
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  drawNet(); 
  drawScore(canvas.width / 5, canvas.height / 9, user.score);  //4,6
  drawScore(3 * canvas.width / 4, canvas.height / 9, ai.score); //4,6
  drawPaddle(user.x, user.y, user.width, user.height, user.color);
  drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color); 
  drawBall(ball.x, ball.y, ball.radius, ball.color);
  
}


function gameLoop() {
  update();
  draw();  
}
setInterval(gameLoop, 1000 / 60);