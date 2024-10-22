
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


var ballDistance=0;
var ballDistanceMovement=0;

var ballDistanceY=0;
var maximumY=0;

var offSet=0;

var bounceCheck=0;

const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FF00FF",
};

//paddles
const user = {
  x: canvas.width - (paddleWidth + 10), //10,
  y: canvas.height / 2 - paddleHeight / 2,  //canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#7FFFD4',
  score: 0
};

const ai = {
  x: 10, //canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2, //canvas.height / 2 - paddleHeight / 2,
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
  ball_movement();

  

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

   // right wall AI scores
   if (ball.x + ball.radius >= canvas.width) {
  
    scoreSound_computer.play();
    
    bounceCheck=0;
    ai.score += 1;
    if (ai.score == 3)
    {
        alert("YOU LOSE!");
        document.location = 'gameOver.html';
    }
    reset();
  }

  // left wall player scores
  if (ball.x - ball.radius <= 0) {

    
    scoreSound_player.play();
   //console.log(ball.y);
    user.score += 1;
    bounceCheck=0;
    if (user.score == 3)
    {
        alert("YOU WIN!");
        document.location='gameOver.html';
    }
    reset();
  }

  // ball movement
  function ball_movement()
  {
    

    if (ball.x >= 400 && ball.x <=410 && ball.velocityX<0)
    {
      offSet = Math.floor(Math.random()*7)
     
      
      ball.x += ball.velocityX;
      ball.y += ball.velocityY; 
      

          
        if (ball.velocityY>0) get_distanceForDown(); //if it goes up, its minus
        else  get_distanceForUp();    //if it goes down, its plus
    
    }

    else
    {
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;
 
    }
  }

  function get_distanceForDown()
  {
    ballDistance = 0- ball.x;
    
    ballDistance = ballDistance/(ball.speed*-1);
    ballDistance = ballDistance*ball.velocityY;
    ballDistanceMovement = ball.x+ballDistance;
   
    get_howMuchToMoveAiDown(ballDistanceMovement);
  }

  function get_howMuchToMoveAiDown(ballDistanceMovement)
  {
    
    ballDistanceY= ballDistanceMovement - ball.y;  //12=15-3 from the example
    

    maximumY = canvas.height - ball.y; //7=10-3 from the example
    ballDistanceY = ballDistanceY - maximumY; // 5=12-7
    ballDistanceY = canvas.height - maximumY; //5=0-5 from example
    
    if (ballDistanceY<450) ballDistanceY+=100;
    else ballDistanceY=ballDistanceY-200; 
  }









  function get_distanceForUp()  //probably done for now
  {
    ballDistance = 0 - ball.x;
    
    ballDistance = ballDistance/(ball.speed*-1);
    
    ballDistanceMovement = ball.x+ballDistance;
    ballDistanceMovement=ballDistanceMovement/2;
   

    get_howMuchToMoveAiUp(ballDistanceMovement);
  }

  function get_howMuchToMoveAiUp(ballDistanceMovement)
  {
  
    ballDistanceY= ballDistanceMovement - ball.y;  //12=15-3 from the example
   

    maximumY = canvas.height - ball.y; //7=10-3 from the example
    ballDistanceY = ballDistanceY - maximumY; // 5=12-7
    ballDistanceY = canvas.height - maximumY; //5=0-5 from example
    ballDistanceY = ballDistanceY/2;


    if (ballDistanceY<450) ballDistanceY+=150;
    else ballDistanceY=ballDistanceY-200; 

   
  }

  function ai_movement()
  {
    if (offSet==6)
    {
      ballDistanceY = Math.floor(Math.random()*801)
      if (ai.y<ballDistanceY)     //move down
     {
      ai.y+=3;
     } 
     if (ai.y>ballDistanceY)     //move up
     {       
       ai.y-=3;     
     }

    }
    
    else
    {
    if (ai.y<ballDistanceY)     //move down
    {
      
     ai.y+=3;
  

    } 
    if (ai.y>ballDistanceY)     //move up
    {
    
      ai.y-=3;
 
    }
   }
  }



  // collision detection on paddles
  let player = (ball.x > canvas.width / 2) ? user : ai;

  if (collisionDetect(player, ball)) {
   
    paddleSound.play();
 
    let angle = 0;   

    //top of the paddle
    if (ball.y < (player.y + player.height / 2)) {      
      angle = -1 * Math.PI /4; //math.pi/4
    } else if (ball.y > (player.y + player.height / 2)) {
      // bottom of the paddle
      angle = Math.PI / 4;
    } 
    //f it hits middle of the paddle
    else angle = math.PI /4;   

    ball.velocityX = ((player === user ? 1 : -1) * ball.speed * Math.cos(angle)*-1);
    ball.velocityY = ball.speed * Math.sin(angle);
    if (bounceCheck==0) bounceCheck=1;
    else bounceCheck=0;   
    
  }
 
}


function draw() {
  
  ctx.fillStyle = "#2F0C35"; //2F0C35
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  drawNet(); 
  drawScore(canvas.width / 5, canvas.height / 9, ai.score);  //4,6
  drawScore(3 * canvas.width / 4, canvas.height / 9, user.score); //4,6
  drawPaddle(user.x, user.y, user.width, user.height, user.color);
  drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color); 
  drawBall(ball.x, ball.y, ball.radius, ball.color);
  
}


function gameLoop() { 
  update();
  draw();  
}
setInterval(gameLoop, 1000 / 60);