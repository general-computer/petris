const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const shipSize = 30;
const turnSpeed = 360;
const thrustSpeed = 5;
const friction = 0.7;
const asteroidAmount = 5;
const asteroidSpeed = 20;
const asteroidSize = 100;
const asteroidJaggedness = 0.4;
const bulletSpeed = 400;
const bulletMaxAge = 2;


// Game objects
let ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 90 / 180 * Math.PI,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
};

let asteroids = [];
createAsteroids();

let bullets = [];

// Helper functions
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function createAsteroids() {
  for (let i = 0; i < asteroidAmount; i++) {
    let x, y;

    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (distanceBetween(ship.x, ship.y, x, y) < asteroidSize * 2);

    asteroids.push(createAsteroid(x, y));
  }
}

function createAsteroid(x, y) {
  let asteroid = {
    x: x,
    y: y,
    xv: randomFloat(-asteroidSpeed, asteroidSpeed),
    yv: randomFloat(-asteroidSpeed, asteroidSpeed),
    radius: asteroidSize / 2,
    angle: Math.random() * Math.PI * 2,
    vertices: [],
  };

  for (let i = 0; i < 10; i++) {
    asteroid.vertices.push({
      angle: (i * Math.PI * 2) / 10 + randomFloat(-asteroidJaggedness, asteroidJaggedness),
      radius: asteroid.radius + randomFloat(-asteroid.radius * 0.2, asteroid.radius * 0.2),
    });
  }

  return asteroid;
}

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function wrapAround(obj, padding) {
  if (obj.x < -padding) obj.x = canvas.width + padding;
  else if (obj.x > canvas.width + padding) obj.x = -padding;

  if (obj.y < -padding) obj.y = canvas.height + padding;
  else if (obj.y > canvas.height + padding) obj.y = -padding;
}

function rotate(angle) {
  ctx.rotate(angle);
  ctx.translate(-shipSize / 2, -shipSize / 2);
}

function circleCollision(obj1, obj2) {
  return distanceBetween(obj1.x, obj1.y, obj2.x, obj2.y) < obj1.radius + obj2.radius;
}

function createBullet(x, y, angle) {
  return {
    x: x,
    y: y,
    xv: bulletSpeed * Math.cos(angle),
    yv: -bulletSpeed * Math.sin(angle),
    age: 0,
  };
}

// Input handling
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      ship.thrusting = true;
      break;
    case "ArrowLeft":
      ship.rotating = "left";
      break;
    case "ArrowRight":
      ship.rotating = "right";
      break;
    case " ":
      shootBullet();
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      ship.thrusting = false;
      break;
    case "ArrowLeft":
    case "ArrowRight":
      ship.rotating = null;
      break;
  }
});

function shootBullet() {
  bullets.push(createBullet(ship.x, ship.y, ship.angle));
}

// Main game loop
function gameLoop() {
  // Update
  updateShip();
  updateBullets();
  updateAsteroids();
  checkBulletAsteroidCollisions();

  // Draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawBullets();
  drawAsteroids();

  requestAnimationFrame(gameLoop);
}

function updateShip() {
  if (ship.rotating === "left") {
    ship.angle -= (turnSpeed / 180) * Math.PI * (1 / 60);
  } else if (ship.rotating === "right") {
    ship.angle += (turnSpeed / 180) * Math.PI * (1 / 60);
  }

  if (ship.thrusting) {
    ship.thrust.x += (thrustSpeed * Math.cos(ship.angle)) / shipSize;
    ship.thrust.y -= (thrustSpeed * Math.sin(ship.angle)) / shipSize;
  }

  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;
  ship.thrust.x *= friction;
  ship.thrust.y *= friction;

  wrapAround(ship, shipSize / 2);
}

function updateAsteroids() {
  for (let asteroid of asteroids) {
    asteroid.x += asteroid.xv;
    asteroid.y += asteroid.yv;
    wrapAround(asteroid, asteroid.radius);
  }
}

function drawShip() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shipSize * 0.5, 0);
  ctx.lineTo(shipSize * 0.9, shipSize);
  ctx.lineTo(shipSize * 0.5, shipSize * 0.8);
  ctx.lineTo(shipSize * 0.1, shipSize);
  ctx.closePath();
  ctx.stroke();

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
}

function drawAsteroids() {
  for (let asteroid of asteroids) {
    ctx.beginPath();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.moveTo(
      asteroid.x + asteroid.vertices[0].radius * Math.cos(asteroid.angle + asteroid.vertices[0].angle),
      asteroid.y + asteroid.vertices[0].radius * Math.sin(asteroid.angle + asteroid.vertices[0].angle)
    );

    for (let vertex of asteroid.vertices) {
      ctx.lineTo(
        asteroid.x + vertex.radius * Math.cos(asteroid.angle + vertex.angle),
        asteroid.y + vertex.radius * Math.sin(asteroid.angle + vertex.angle)
      );
    }

    ctx.closePath();
    ctx.stroke();
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    bullet.x += bullet.xv * (1 / 60);
    bullet.y += bullet.yv * (1 / 60);
    bullet.age += 1 / 60;

    if (bullet.age > bulletMaxAge) {
      bullets.splice(i, 1);
    } else {
      wrapAround(bullet, 0);
    }
  }
}

function drawBullets() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  for (let bullet of bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function checkBulletAsteroidCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (circleCollision(bullets[i], asteroids[j])) {
        // Remove the bullet and asteroid upon collision
        bullets.splice(i, 1);
        asteroids.splice(j, 1);
        break;
      }
    }
  }
}

// Start the game loop
gameLoop();

