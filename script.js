'use strict';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
// canvas.width = 1280;
// canvas.height = 800;
canvas.width = 1024;
canvas.height = 640;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

let score = 0;
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;

ctx.font = '25px Verdana';

//координаты относительного окна
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    // console.log(mouse.x, mouse.y);
});

canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});


const planeLeft = new Image();
planeLeft.src = 'img/plane_1_left.png';
const planeRight = new Image();
planeRight.src = 'img/plane_1_right.png';
const feather = new Image();
feather.src = 'img/bird_die.png';
const mountains = new Image();
mountains.src = 'img/mountains.png';
const sun = new Image();
sun.src = 'img/sun.png';



const popAudio = new Audio();
popAudio.src = 'pop.wav';

// const popAudio = document.createElement('audio');
// popAudio.src = 'pop2.wav';

//облака
class Cloud {
    constructor(image, x1, x2, y, width, height) {
        this.x1 = x1;
        this.x2 = x2;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = image;
    }
    draw(k) {
        this.x1 -= gameSpeed * k; //зависимость от скорости игры?
        if (this.x1 < -this.width) {
            this.x1 = this.width;
        }
        this.x2 -= gameSpeed * k;
        if (this.x2 < -Cloud.width) {
            this.x2 = this.width;
        }
        ctx.drawImage(this.image, this.x1, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}


let clouds1 = new Cloud('img/clouds1.png', 0, canvas.width, 0, canvas.width, canvas.height);
let clouds2 = new Cloud('img/clouds2.png', 0, canvas.width, 0, canvas.width, canvas.height);


//самолет
class Plane {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    //обновление позиции самолета по направлению к положению мыши
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx / 20;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 20;
        }
    }
    draw() {
        if (this.x >= mouse.x) {
            ctx.drawImage(planeLeft, this.x - 50, this.y - 30, 100, 59);
        } else {
            ctx.drawImage(planeRight, this.x - 50, this.y - 30, 100, 59);
        }
    }
}

const plane = new Plane(0, canvas.height / 2, 40);

class Bird {
    constructor(x, y, radius, speed, frame, frameX, frameY, spriteWidth, spriteHeight, image) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 45, this.y - 45, this.spriteWidth / 7, this.spriteHeight / 7);
    }
    update() {
        this.x -= this.speed;
        this.y += Math.random() * 2 - 1;
        if (this.x < 0 - this.radius * 2) {
            this.x = canvas.width + 800;
            this.y = Math.random() * (canvas.height - 200) + 100;
            this.speed = Math.random() * 2 + 2;
        }
        if (gameFrame % 5 == 0) {
            this.frame++;
            if (this.frame >= 8) this.frame = 0;
            this.frame == 3 || this.frame == 7 ? this.frameX = 0 : this.frameX++;
            if (this.frame < 3) {
                this.frameY = 0
            } else if (this.frame < 7) {
                this.frameY = 1
            } else this.frameY = 0;

        }
        //столкновение с самолетом :(
        const dx = this.x - plane.x;
        const dy = this.y - plane.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if ((distance < this.radius + plane.radius) && (Math.abs(this.y - plane.y) <= 20)) {

            handleGameOver()
        }
    }
}

const bird = new Bird(canvas.width + 600, Math.random() * (canvas.height - 200) + 100, 30, Math.random() + 1.3, 0, 0, 0, 663, 637, 'img/black_birds.png');

function handleBirds() {
    bird.update();
    bird.draw();
}



//Шарики
let balloonsArray = [];
// function ballonCollision(j) {
//     for (let j = 0; j < balloonsArray.length; j++) {
//     let hlop = new BalloonPop('img/ballon-pop.png', balloonsArray[j].x, balloonsArray[j].y, 0, balloonsArray[j].color * 600, 500, 600);
// hlop.update();
// hlop.draw();
// balloonsArray[j].y+=canvas.height;
// balloonsArray.splice(j, 1);
// // console.log(balloonsArray); 
// j--;
//     }
// }

class Balloon {
    constructor(image, x, y, spriteWidth, spriteHeight) {
        this.x = x; // Math.random() * canvas.width;
        this.y = y, //canvas.height + 100;
            this.radius = 25;
        this.speed = Math.random() * 4 + 1;
        this.distance;
        this.counted = false;
        this.color = Math.floor(Math.random() * 6);
        this.image = new Image();
        this.image.src = image;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }
    update() {
        this.y -= this.speed;
        //вычисление условия встречи с самолетом
        const dx = this.x - plane.x;
        const dy = this.y - plane.y;
        this.planeDistance = Math.sqrt(dx ** 2 + dy ** 2);
        //вычисление условия встречи с птичкой    
        const dbx = this.x - bird.x;
        const dby = this.y - bird.y;
        this.birdDistance = Math.sqrt(dbx ** 2 + dby ** 2);
    }
    draw() {
        ctx.drawImage(this.image, 0, this.spriteHeight * this.color, this.spriteWidth,
            this.spriteHeight, this.x - 40, this.y - 45, this.spriteWidth / 6, this.spriteHeight / 6)
    }
}

class BalloonPop extends Balloon {
    constructor(image, x, y, frameX, frameY, spriteWidth, spriteHeight) {
        super(image, x, y, spriteWidth, spriteHeight)
        this.frameX = frameX;
        this.frameY = frameY;
        this.speed = 1; //Math.random() * 0.4 -0.4;

    }
    update() {
        // this.y += 50;
        this.frameX++;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY, this.spriteWidth, this.spriteHeight, this.x - 40, this.y - 45, this.spriteWidth / 6, this.spriteHeight / 6)
    }
}


function handleBalloons() {
    if (gameFrame % 60 == 0) { //добавление элемента каждые 50 фреймов
        balloonsArray.push(new Balloon('img/ballon-pop.png', Math.random() * canvas.width, canvas.height + 100, 500, 600));
        // constructor(image, frameX, frameY, radius spriteWidth, spriteHeight) {
        // 
    }
    for (let i = 0; i < balloonsArray.length; i++) {
        balloonsArray[i].update();
        balloonsArray[i].draw();

        if (balloonsArray[i].y < 0 - balloonsArray[i].radius * 2) {
            balloonsArray.splice(i, 1);
            i--;
        } else if (balloonsArray[i].planeDistance < balloonsArray[i].radius + plane.radius) {
            if (!balloonsArray[i].counted) {
                score++;
                balloonsArray[i].counted = true;
                // popAudio.play();                
            }
            // ballonCollision(i);
            let hlop = new BalloonPop('img/ballon-pop.png', balloonsArray[i].x, balloonsArray[i].y, 0, balloonsArray[i].color * 600, 500, 600);
            hlop.update();
            hlop.draw();

            balloonsArray.splice(i, 1);
            i--;
        } else if (balloonsArray[i].birdDistance < balloonsArray[i].radius + bird.radius && balloonsArray[i].x <= bird.x - bird.radius) {
            let hlop1 = new BalloonPop('img/ballon-pop.png', balloonsArray[i].x, balloonsArray[i].y, 1, balloonsArray[i].color * 600, 500, 600);
            hlop1.update();
            hlop1.draw();
            // ballonCollision();
            balloonsArray.splice(i, 1);
            i--;
        }
    }
}


function drawBackground(background) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}


// let gameLoop = (function() {
//     return requestAnimationFrame ||
//     webkitRequestAnimationFrame ||
//     mozRequestAnimationFrame ||
//     msRequestAnimationFrame;
// }) ();


function handleGameOver() {
    bird.y += canvas.height + 100;
    ctx.drawImage(feather, 1989, 637, 663, 637, bird.x - 70, bird.y - canvas.height - 70, 100, 100);

    ctx.font = "80px Verdana";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    gameOver = true;
}

function getScore() {
    ctx.fillStyle = 'black';
    ctx.fillText(`Ваш счет: ${score}`, canvas.width - 200, 50);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(sun);
    clouds1.draw(0.05);
    clouds2.draw(0.1);
    drawBackground(mountains);
    handleBalloons();
    getScore();
    handleBirds();
    plane.update();
    plane.draw();

    // ctx.fillStyle = 'black';
    // ctx.fillText(`Ваш счет: ${score}`, canvas.width -300, 40);
    gameFrame++;
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}

animate();

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});