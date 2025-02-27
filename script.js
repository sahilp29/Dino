const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9; // Responsive canvas width
canvas.height = 200;

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
let speed = 5;
let score = 0;
let gameOver = false;

function drawDino() {
    ctx.fillStyle = "black";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    if (frame % 100 === 0) {
        obstacles.push({
            x: canvas.width,
            y: 160,
            width: 20,
            height: 40
        });
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

    frame++;
    score++;

    requestAnimationFrame(update);
}

// ✅ Jump function for both keyboard and touch
function jump() {
    if (dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
    }
}

// ✅ Keyboard support
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// ✅ Touch support for mobile users
canvas.addEventListener("touchstart", () => {
    jump();
});

// ✅ Restart game on tap
canvas.addEventListener("click", () => {
    if (gameOver) {
        // Reset game state
        obstacles = [];
        dino.y = 150;
        dino.dy = 0;
        score = 0;
        frame = 0;
        gameOver = false;
        update();
    }
});

update();
