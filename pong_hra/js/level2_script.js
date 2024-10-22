
const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');


const paddleSound = new Audio('../audio/paddle_bounce.mp3');
const scoreSound_player = new Audio('../audio/player_score.mp3');
const scoreSound_computer = new Audio('../audio/computer_score.mp3');
const wallHitSound = new Audio('../audio/ball1_bounce.mp3');
const wallHitSound2 = new Audio('../audio/ball2_bounce.mp3');

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;

var angleOffSet =0;




// net
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FF00FF"
};

// player paddle
const user = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#7FFFD4',
  score: -1
};

const ai = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#DC143C',
  score: 0
};

// ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#05EDFF'
};

//second ball

const ball2 = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#F61212'
}








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

function drawBall2(x,y,radius,color){
  ctx.fillStyle = color;
  ctx.beginPath();

  ctx.arc(x,y,radius,0,Math.PI*2,true);
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

  ball2.x = canvas.width/2;
  ball2.y = canvas.height/2;
  

  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
  if (ball.velocityX>=0)
  {
    ball.velocityX = ball.velocityX*(-1);
  }

  ball2.velocityX = -ball2.velocityX;
  ball2.velocityY = -ball2.velocityY;
  if (ball2.velocityX<=0)
  {
    ball2.velocityX = ball2.velocityX*(-1);
  }
  
  

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

function collisionDetect2(player2, ball2) {
  
  player2.top = player2.y;
  player2.right = player2.x + player2.width;
  player2.bottom = player2.y + player2.height;
  player2.left = player2.x;

  ball2.top = ball2.y - ball2.radius;
  ball2.right = ball2.x + ball2.radius;
  ball2.bottom = ball2.y + ball2.radius;
  ball2.left = ball2.x - ball2.radius;

  return ball2.left < player2.right && ball2.top < player2.bottom && ball2.right > player2.left && ball2.bottom > player2.top;
}



function update() {  
  ai_movement();
  

  // move the paddle
  if (upArrowPressed && user.y > 0) {
    user.y -= 8;
  } else if (downArrowPressed && (user.y < canvas.height - user.height)) {
    user.y += 8;
  }

  // wall bounce
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    
    wallHitSound.play();
    ball.velocityY = -ball.velocityY;
  }

  if (ball2.y + ball2.radius >= canvas.height || ball2.y - ball2.radius <= 0) {
    
    wallHitSound2.play();
    ball2.velocityY = -ball2.velocityY;
  }

   // right wall player score
   if (ball.x + ball.radius >= canvas.width) {
    
    scoreSound_player.play();    
    
    user.score += 1;
    if (user.score == 3) 
    {
      ball.speed +=3;
      ball2.speed +=3.5;
    }
    if (user.score == 6) 
    {
      ball.speed +=3;
      ball2.speed +=3.5;
    }
    if (user.score == 9) 
    {
      ball.speed +=3;
      ball2.speed +=3.5;
    }
    if (user.score == 10)
    {
        alert("YOU WIN!");
        document.location = 'mainMenu.html';
    }
    reset();
  }

  //right wall player score with second ball
  if (ball2.x + ball2.radius >= canvas.width) {

    
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
    if (ai.score == 10) // game over
    {
        alert("GAME OVER!");
        document.location='gameOver.html';
    }
    reset();
  }

  //left wall ai scores with second ball
  if (ball2.x - ball2.radius <= 0) {

 
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

  //second ball movement
  ball2.x += ball2.velocityX;
  ball2.y += ball2.velocityY;
  

  // ai movement
  function ai_movement()
  {
    if (ball.x>ball2.x)
    {
      if (ai.y<ball.y) ai.y+=2;
      else ai.y-=2;

      if (user.score>=3 && user.score <6) 
      {
        if (ai.y<ball.y) ai.y+=2.5;
        else ai.y-=2.5;
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

    if (ball.x<ball2.x)
    {
      if (ai.y<ball2.y) ai.y+=3;
      else ai.y-=3;

      if (user.score>=3 && user.score <6) 
      {
        if (ai.y<ball2.y) ai.y+=3.5;
        else ai.y-=3.5;
      }

      if (user.score>=6 && user.score <9)
      {
        if (ai.y<ball2.y) ai.y+=4.5;
        else ai.y-=4.5;
      }

      if (user.score >= 9)
      {
        if (ai.y<ball2.y) ai.y+=5;
        else ai.y-=5;
      }
    }
  }

  // collision detection on paddles for the first ball
  let player = (ball.x < canvas.width / 2) ? user : ai;
  let player2 = (ball2.x < canvas.width / 2) ? user : ai;

  if (collisionDetect(player, ball)) {
   
    paddleSound.play();
 
    let angle = 0;
    angleOffSet = Math.floor(Math.random()*7)
    if (angleOffSet == 0 || angleOffSet == 1 || angleOffSet == 2) angleOffSet = 3;

    //top of the paddle
    if (ball.y < (player.y + player.height / 2)) {      
      angle = -1 * Math.PI / angleOffSet;
    } else if (ball.y > (player.y + player.height / 2)) {
      // bottom of the paddle
      angle = Math.PI / angleOffSet;
    } 
    //f it hits middle of the paddle
    else angle = math.PI /angleOffSet;   

    ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    
  }

  // collision detection on paddles for the second ball
  if (collisionDetect2(player2, ball2)) {
    
    paddleSound .play();
 
    let angle = 0;

    
    if (ball2.y < (player2.y + player2.height / 2)) {      
      angle = -1 * Math.PI / 4;
    } else if (ball2.y > (player2.y + player2.height / 2)) {
      
      angle = Math.PI / 4;
    } 
   
    else angle = math.PI /6;   

    ball2.velocityX = (player2 === user ? 1 : -1) * ball2.speed * Math.cos(angle);
    ball2.velocityY = ball2.speed * Math.sin(angle);
    
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
  drawBall2(ball2.x, ball2.y, ball2.radius, ball2.color);
}

function gameLoop() {
  update();
  draw();  
}
setInterval(gameLoop, 1000 / 60);