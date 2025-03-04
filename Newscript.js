const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = 200;

// Load Images
const dinoImg = new Image();
dinoImg.src = "dino.png"; 

const cactusImg = new Image();
cactusImg.src = "cactus.png"; 

let dino = {
    x: 50,
    y: 150,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.6,
    jumpPower: -12,
    grounded: true
};

let obstacles = [];
let frame = 0;
let speed = 3; // Start slower
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    if (frame % 100 === 0) {
        let numCactuses = Math.random() > 0.5 ? 1 : 2; // Random 1 or 2 cactuses
        for (let i = 0; i < numCactuses; i++) {
            obstacles.push({
                x: canvas.width + i * 30, // Slight offset for multiple obstacles
                y: 160,
                width: 20,
                height: 40
            });
        }
    }

    obstacles.forEach(obstacle => obstacle.x -= speed);
    obstacles = obstacles.filter(obstacle => obstacle.x > -20);
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over! Tap to Restart", canvas.width / 4, canvas.height / 2);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 3, canvas.height / 1.5);
        return;
    }

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y > 150) {
        dino.y = 150;
        dino.dy = 0;
        dino.grounded = true;
    }

    updateObstacles();
    checkCollision();

    drawDino();
    drawObstacles();

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 50);

    frame++;
    score++;

    // ✅ Increase speed over time
    if (frame % 500 === 0) {
        speed += 0.5; // Slowly increases the speed every 500 frames
    }

    requestAnimationFrame(update);
}

// ✅ Jump Function
function jump() {
    if (dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
    }
}

// ✅ Touch & Keyboard Controls
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

document.addEventListener("click", () => {
    if (gameOver) {
        restartGame();
    } else {
        jump();
    }
});

document.addEventListener("touchstart", () => {
    if (gameOver) {
        restartGame();
    } else {
        jump();
    }
});

// ✅ Restart Function
function restartGame() {
    // ✅ Save High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    obstacles = [];
    dino.y = 150;
    dino.dy = 0;
    score = 0;
    frame = 0;
    speed = 3; // Reset speed
    gameOver = false;
    update();
}

// ✅ Prevent Scrolling
document.body.style.overflow = "hidden";

update();
