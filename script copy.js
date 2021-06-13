'use strict';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 800;
// canvas.width = 1024;
// canvas.height = 640;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;


// const btnClose = document.querySelector('.modalClose');
const popup = document.querySelector('.reloadButton');

// let playerName = document.querySelector("#name");
// let saveBtn = document.querySelector("#save");



// btnClose.onclick = ()=> {
//     popup.style.display ='none';
// }

// // playerName.value = null;


//     function addNames() {
//       if (!(playerName == null )) {
//         localStorage.setItem('playerName', playerName.value);
//         // playerName.value = null;

//       }
//     }

//     saveBtn.addEventListener("click", addNames);

// window.onclick = function(event) {
//     if (event.target == popup) {
//         popup.style.display = "none";
//     }
//   }

// let startBtn = document.querySelector("#start");
// startBtn.onclick =()=> {
//     popup.style.display ='none';
// }

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
const parachute = new Image();
parachute.src = 'img/pink_blue.png';
const mountains = new Image();
mountains.src = 'img/mountains.png';
const sun = new Image();
sun.src = 'img/sun.png';
const balloon = new Image();
balloon.src = 'img/ballon-pop.png'
// const rest = new Image()
// rest.src ='img/res.png'



const popAudio1 = new Audio();
popAudio1.src = 'sounds/pop1.wav';
const popAudio2 = new Audio();
popAudio2.src = 'sounds/pop2.wav';
const crowAudio = new Audio();
crowAudio.src = 'sounds/crow.wav';

// const popAudio = document.createElement('audio');
// popAudio.src = 'pop1.wav';

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
        this.x1 -= gameSpeed * k;
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
    constructor(x, y, radius, width, height) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.width = width;
        this.height = height;

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
            ctx.drawImage(planeLeft, this.x - 50, this.y - 30, this.width, this.height);
        } else {
            ctx.drawImage(planeRight, this.x - 50, this.y - 30, this.width, this.height);
        }
    }
}

const plane = new Plane(0, canvas.height / 2, 40, 100, 59);

class Bird {
    constructor(x, y, radius, speed, frame, frameX, frameY, spriteWidth, spriteHeight, image) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed + Math.floor(score / 10);
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 45, this.y - 45, this.spriteWidth / 7.5, this.spriteHeight / 7.5);
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
            if (this.frame >= 8) {
                this.frame = 0;
            }
            if (this.frame == 3 || this.frame == 7) {
                this.frameX = 0
            } else {
                this.frameX++;
            }
            if (this.frame < 3) {
                this.frameY = 0
            } else if (this.frame < 7) {
                this.frameY = 1;
            } else {
                this.frameY = 0;
            }

        }
        //столкновение с самолетом :(
        const dx = this.x - plane.x;
        const dy = this.y - plane.y;
        this.distance = Math.sqrt(dx ** 2 + dy ** 2);
        
    }
}

const bird = new Bird(canvas.width + 600, Math.random() * (canvas.height - 200) + 100, 25, Math.random() + 1.3, 0, 0, 0, 663, 637, 'img/black_birds.png');


function handleBirds() {
    bird.update();
    bird.draw();
    if ((bird.distance < bird.radius + plane.radius) && (Math.abs(bird.y - plane.y) <= 20)) {
        bird.y += canvas.height + 100;
        ctx.drawImage(feather, 1989, 637, 663, 637, bird.x - 50, bird.y - canvas.height - 70, 70, 70);
        crowAudio.play();
        ctx.drawImage(parachute, plane.x - 70, plane.y, 60, 60);
        plane.y = canvas.height - plane.radius / 3.5;
        plane.width = plane.width / 2;
        plane.height = plane.height / 2;
        handleGameOver();
    }
}




class Animal {
    constructor(x, y, frame, frameX, frameY, image) {
        this.x = x;
        this.y = y;
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteWidth = 128;
        this.spriteHeight = 128;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.spriteWidth / 2.5, this.spriteHeight / 2.5);
    }
    update(frequency) {

        if (gameFrame % frequency == 0) {
            this.frame++;
            if (this.frame >= 4) {
                this.frame = 0;
            } else if (this.frame == 3) {
                this.frameX = 0
            } else {
                this.frameX++;
            }
        }
    }
}

const sheep1 = new Animal(canvas.width * 0.65, canvas.height * 0.925, 0, 0, 0, 'img/sheep_eat.png');
const sheep2 = new Animal(canvas.width * 0.7, canvas.height * 0.915, 0, 0, 1, 'img/sheep_eat.png');
const sheep3 = new Animal(canvas.width * 0.63, canvas.height * 0.915, 0, 0, 2, 'img/sheep_eat.png');
const cow1 = new Animal(canvas.width * 0.12, canvas.height * 0.9, 0, 0, 3, 'img/cow_eat.png');


function handleSheep() {
    sheep1.update(80);
    sheep1.draw();
    sheep2.update(100);
    sheep2.draw();
    sheep3.update(110);
    sheep3.draw();
    cow1.update(105);
    cow1.draw();
}

class Horse {
    constructor(x, y, frameX) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 0.8 + 0.4;
        this.frameX = frameX;
        this.spriteWidth = 60;
        this.spriteHeight = 33;
        this.image = new Image();
        this.image.src = 'img/Horse_Run.png';
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, 1, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.spriteWidth / 2, this.spriteHeight / 2);
    }
    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = canvas.width + 200;
            this.speed = Math.random() * 0.8 + 0.35;
        }
        //    this.frequency = Math.floor(this.speed*10) +2;
        if (gameFrame % 12 == 0) {
            this.frameX++;
            if (this.frameX >= 5) {
                this.frameX = 0;
            }
        }
    }
}

const horse1 = new Horse(canvas.width + 10, canvas.height - 30, 0);
// const horse2 = new Horse(canvas.width + 16, canvas.height - 30, 0);

function handleHorse() {
    horse1.update();
    horse1.draw();
    // horse2.update();
    // horse2.draw();
}

//Шарики
let balloonsArray = [];


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
        // вычисление условия встречи с птичкой    
        const dbx = this.x - bird.x;
        const dby = this.y - bird.y;
        this.birdDistance = Math.sqrt(dbx ** 2 + dby ** 2);
    }
    draw() {
        ctx.drawImage(this.image, 0, this.spriteHeight * this.color, this.spriteWidth,
            this.spriteHeight, this.x - 40, this.y - 45, this.spriteWidth / 7, this.spriteHeight / 7)
    }
}

class BalloonPop extends Balloon {
    constructor(image, x, y, frameX, frameY, spriteWidth, spriteHeight) {
        super(image, x, y, spriteWidth, spriteHeight);
        this.frameX = frameX;
        this.frameY = frameY;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY, this.spriteWidth, this.spriteHeight, this.x - 40, this.y - 45, this.spriteWidth / 7, this.spriteHeight / 7)
    }
}


function handleBalloons() {
    if (gameFrame % 60 == 0) { //добавление элемента каждые 50 фреймов
        balloonsArray.push(new Balloon('img/ballon-pop.png', Math.random() * canvas.width - 50, canvas.height + 100, 500, 600));
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
                gameSpeed = 1 + Math.floor(score / 100);
                balloonsArray[i].counted = true;

            }
            let hlop = new BalloonPop('img/ballon-pop.png', balloonsArray[i].x, balloonsArray[i].y, 1, balloonsArray[i].color * 600, 500, 600);
            popAudio1.play();
            hlop.update();
            hlop.draw();
            balloonsArray.splice(i, 1);
            i--;
        } else if (balloonsArray[i].birdDistance < balloonsArray[i].radius + plane.radius && Math.abs(balloonsArray[i].y - bird.y <= 20) &&
            balloonsArray[i].x <= bird.x) {
            let hlop1 = new BalloonPop('img/ballon-pop.png', balloonsArray[i].x, balloonsArray[i].y, 1, balloonsArray[i].color * 600, 500, 600);
            hlop1.update();
            hlop1.draw();
            popAudio2.play();
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

    
    ctx.font = "80px Verdana";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2.3);
    ctx.font = "50px Verdana";
    ctx.fillText(`Ваш счет: ${score}`, canvas.width / 2, canvas.height / 1.8);
    gameOver = true;
    // setInterval(() => {
    //     document.location.reload()
    // }, 5000);
}

function getScore() {
    ctx.drawImage(balloon, 0, 2400, 500, 600, canvas.width - 110, 10, 50, 60)
    ctx.fillStyle = 'black';
    ctx.fillText(` ${score}`, canvas.width - 70, 50);
}






function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(sun);
    clouds1.draw(0.05);
    clouds2.draw(0.1);
    drawBackground(mountains);
    handleSheep();
    handleHorse();
    handleBalloons();
    getScore();
    handleBirds();
    plane.update();
    plane.draw();
    gameFrame++;

    if (!gameOver) {
        requestAnimationFrame(animate);
    }
    else  {popup.style.display ='block';}

}

animate();

window.addEventListener('resize', function () {
    // canvas.height = window.innerHeight;
    // canvas.width =window.innerWidth;
    canvasPosition = canvas.getBoundingClientRect();
});