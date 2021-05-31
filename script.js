'use strict';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '25px Verdana';
let gameSpeed = 1; // new

let canvasPosition = canvas.getBoundingClientRect();
//координаты относительного окна

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse.x, mouse.y);
});

canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});


const planeLeft = new Image();
planeLeft.src = 'img/plane_left.png';
const planeRight = new Image();
planeRight.src = 'img/plane_right.png';





// const greenBalloon = new Image();
// greenBalloon.src = 'img/balloons/green.png';
// const orangeBalloon = new Image();
// orangeBalloon.src = 'img/balloons/orange.png';

const background1 = new Image();
background1.src = 'img/mountains.png';
const background2 = new Image();
background2.src = 'img/sun.png';

const middleClouds1 = new Image(); //
middleClouds1.src = 'img/clouds1.png';
const middleClouds2 = new Image(); //
middleClouds2.src = 'img/clouds2.png';
const birdsImage = new Image();
birdsImage.src = 'img/black_birds.png';



//облака
class Cloud {
    constructor() {
        this.x1 = 0;
        this.x2 = canvas.width;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
    }
    update(image, k) {
        this.x1 -= gameSpeed * k;
        if (this.x1 < -this.width) {
            this.x1 = this.width;
        }
        this.x2 -= gameSpeed * k;
        if (this.x2 < -Cloud.width) {
            this.x2 = this.width;
        }
        ctx.drawImage(image, this.x1, this.y, this.width, this.height);
        ctx.drawImage(image, this.x2, this.y, this.width, this.height);
    }
}


let clouds1 = new Cloud();
let clouds2 = new Cloud();


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
            this.x -= dx / 15;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 15;
        }
    }
    draw() {
        if (this.x >= mouse.x) {
            ctx.drawImage(planeLeft, this.x - 45, this.y - 30);
        } else {
            ctx.drawImage(planeRight, this.x - 45, this.y - 30);
        }
    }
}

const plane = new Plane(0, canvas.height / 2, 50);

//Шарики
let balloonsArray = [];

class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 30;
        this.speed = Math.random() * 4 + 1;
        this.distance;
        this.counted = false;
        this.randomize = Math.random() * 10;


    }
    update() {
        this.y -= this.speed;
        const dx = this.x - plane.x;
        const dy = this.y - plane.y;
        this.distance = Math.sqrt(dx ** 2 + dy ** 2);
    }
    draw() {
        let colorBallons = ['img/balloons/green.png', 'img/balloons/orange.png', 'img/balloons/pink.png', 'img/balloons/red.png'];
        let arrayBallonsImage = [];
        for (let i = 0; i < colorBallons.length; i++) {
            arrayBallonsImage[i] = new Image();
            arrayBallonsImage[i].src = colorBallons[i];
        }
        if (this.randomize <= 2) {
            ctx.drawImage(arrayBallonsImage[0], this.x - 40, this.y - 35, this.radius * 3, this.radius * 3)
        } else if (this.randomize >= 4 && this.randomize < 6) {
            ctx.drawImage(arrayBallonsImage[1], this.x - 40, this.y - 35, this.radius * 3, this.radius * 3)
        } else if (this.randomize >= 6 && this.randomize < 8) {
            ctx.drawImage(arrayBallonsImage[2], this.x - 40, this.y - 35, this.radius * 3, this.radius * 3)
        } else if (this.randomize >= 8 && this.randomize < 10) {
            ctx.drawImage(arrayBallonsImage[3], this.x - 40, this.y - 35, this.radius * 3, this.radius * 3)
        }

    }
}

function handleBalloons() {
    if (gameFrame % 60 == 0) { //добавление элемента каждые 50 фреймов
        balloonsArray.push(new Balloon());
    }
    for (let i = 0; i < balloonsArray.length; i++) {
        balloonsArray[i].update();
        balloonsArray[i].draw();
        if (balloonsArray[i].y < 0 - balloonsArray[i].radius * 2) {
            balloonsArray.splice(i, 1);
            i--;
        } else if (balloonsArray[i].distance < balloonsArray[i].radius + plane.radius) {
            if (!balloonsArray[i].counted) {
                score++;
                balloonsArray[i].counted = true;
                balloonsArray.splice(i, 1);
                i--;
            }
        }
    }
}

class Bird {
    constructor(x, y, radius, speed, frame, frameX, frameY, spriteWidth, spriteHeight) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
    }
    draw() {
        ctx.drawImage(birdsImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 45, this.y - 45, this.spriteWidth / 7, this.spriteHeight / 7);
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
    }
}

const bird = new Bird(canvas.width + 600, Math.random() * (canvas.height - 200) + 100, 30, Math.random() + 1.3, 0, 0, 0, 663, 637);

function handleBirds() {
    bird.update();
    bird.draw();

}

function drawBackground(background) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(background2);
    clouds1.update(middleClouds1, 0.05);
    clouds2.update(middleClouds2, 0.1);
    drawBackground(background1);
    handleBalloons();
    handleBirds();
    plane.update();
    plane.draw();
    ctx.fillStyle = 'black';
    ctx.fillText(`Ваш счет: ${score}`, 610, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});