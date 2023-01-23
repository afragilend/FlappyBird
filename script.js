const canvas = document.getElementById("game-board")
const ctx = canvas.getContext("2d")

canvas.width = 350
canvas.height = 650

const backgroundImg = document.createElement("img")
backgroundImg.src = "./images/background.png"

const bird0 = document.createElement("img");
bird0.src = "./images/bird-0.png";

const bird1 = document.createElement("img");
bird1.src = "./images/bird-1.png";

const bird2 = document.createElement("img");
bird2.src = "./images/bird-2.png";

const pipeImg = document.createElement("img");
pipeImg.src = "./images/pipe.png";

const menuImg = document.createElement("img");
menuImg.src = "./images/menu.png";

const deltaTime = 1.5;
const jumpSpeed = -7;
const fallingConstant = 0.5;

const game = {
  started: false,
  score: 0,
}

const bird = {
  width: 65,
  height: 45,
  x: 50,
  y: 150,
  vertSpeed: 0,
}

const hole = {
  width: 60,
  height: 200,
  x: 500,
  y: Math.random() * 450,
}

canvas.addEventListener("click", () => {
  bird.vertSpeed = jumpSpeed
  game.started = true
})

const moveHole = () => {
  hole.x -= 3

  if (hole.x < -hole.width) {
    hole.x = canvas.width
    hole.y = Math.random() * 450
    game.score++
  }
}

const checkLose = () => {
  const birdRightCoord = bird.x + bird.width
  const birdBottomCoord = bird.y + bird.height
  const holeRightCoord = hole.x + hole.width
  const holeBottomCoord = hole.y + hole.height

  if (birdRightCoord > hole.x && bird.x < holeRightCoord) {
    if (bird.y <= hole.y || birdBottomCoord >= holeBottomCoord) {
      game.started = false
      game.score = 0
      bird.y = 150
      bird.vertSpeed = 0
      hole.x = 500
      hole.y = Math.random() * 450
    }
  }
}

const writeScore = () => {
  ctx.font = "70px Arial"
  ctx.strokeStyle = "white"
  ctx.fillText(game.score, 170, 60)
  ctx.strokeText(game.score, 170, 60)
}

const updateGame = () => {
  if (!game.started) {
    return
  }
  bird.y += bird.vertSpeed * deltaTime;
  bird.vertSpeed += fallingConstant * deltaTime;
  moveHole();
  checkLose();
};

let animationIndex = 0;
let frameCount = 0;
const BIRD_ANIMATION_FRAMERATE = 8;

const updateBirdAnimation = () => {
  const birdFrames = [bird0, bird1, bird2];
  ctx.drawImage(birdFrames[animationIndex], bird.x, bird.y, bird.width, bird.height);
  if (frameCount / BIRD_ANIMATION_FRAMERATE !== 1) {
    frameCount++;
  } else {
    frameCount = 0;
    animationIndex = (animationIndex + 1) % 3;
  }
};

const drawGame = () => {
  requestAnimationFrame(drawGame)
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)

  if (!game.started) {
    ctx.drawImage(menuImg, 0, 0, canvas.width, canvas.height)
    return
  }

  updateBirdAnimation()
  ctx.drawImage(pipeImg, hole.x, hole.y - 600, hole.width, 600)
  ctx.drawImage(pipeImg, hole.x, hole.y + hole.height, hole.width, 600)

  writeScore()
}

setInterval(updateGame, 1000 / 30)
drawGame()
