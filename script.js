'use strict';

// canvas setup
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 800;


let score = 0;
let gameFrame = 0;
let gameOver = false;


//providing information about the size and  position of canvas
let canvasPosition = canvas.getBoundingClientRect();

// mouse position
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
};


canvas.addEventListener('click', function (event) {
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});


//downloading images
const feather = new Image();
feather.src = 'dist/img/bird_die.png';
const parachute = new Image();
parachute.src = 'dist/img/pink_blue.png';
const mountains = new Image();
mountains.src = 'dist/img/mountains.png';
const sun = new Image();
sun.src = 'dist/img/sun.png';
const balloon = new Image();
balloon.src = 'dist/img/ballon-pop.png';


//downloading sounds
const popAudio1 = new Audio('sounds/Balloon_popping_burst_2.mp3');
popAudio1.volume = 0.3;
const popAudio2 = new Audio('sounds/Balloon_popping_burst_1.mp3');
popAudio2.volume = 0.3;
const crowAudio = new Audio();
crowAudio.src = 'sounds/crow.wav';


//downloading background music
const myAudio1 = new Audio();
myAudio1.src = 'sounds/music.mp3';
myAudio1.loop = true;
myAudio1.volume = 0.01;


// buttons
let BgMusic = document.querySelector('#music');
let pauseBtn = document.querySelector('#pause');
let newGame = document.querySelector('#new_game');

//background music function
let count1 = 0;
BgMusic.addEventListener('click', function () {
    if (count1 == 0) {
        count1 = 1;
        BgMusic.innerHTML = 'выключить музыку';
        BgMusic.style.background = '#a3ecff';
        myAudio1.play();

    } else {
        count1 = 0;
        BgMusic.innerHTML = 'включить музыку';
        BgMusic.style.background = '#ddf8ff';
        myAudio1.pause();
    }
});


//pause
let count2 = 0;
let continueAnimating = true;
pauseBtn.addEventListener('click', () => {
    if (count2 == 0) {
        count2 = 1;
        continueAnimating = false;
        pauseBtn.innerHTML = 'возобновить';
        pauseBtn.style.background = '#a3ecff';

    } else {
        count2 = 0;
        continueAnimating = true;
        animate();
        pauseBtn.innerHTML = 'пауза';
        pauseBtn.style.background = '#ddf8ff';
    }
});


//start new game
newGame.addEventListener('click', () => {
    window.location.reload();
});


//parallax
class Cloud {
    constructor(image, speed) {
        this.x1 = 0;
        this.x2 = canvas.width;
        this.y = 0;
        this.speed = speed;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        this.x1 -= this.speed; //moving speed
        if (this.x1 < -this.width) {
            this.x1 = this.width;
        }
        this.x2 -= this.speed;
        if (this.x2 < -this.width) {
            this.x2 = this.width;
        }
        ctx.drawImage(this.image, this.x1, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}


let clouds1 = new Cloud('dist/img/clouds1.png', 0.04);
let clouds2 = new Cloud('dist/img/clouds2.png', 0.08);


//  Plane constructor
class Plane {
    constructor() {
        this.x = 0;
        this.y = canvas.height / 2;
        this.radius = 40;
        this.frameX = 0;
        this.spriteW = 867;
        this.spriteH = 520;
        this.width = this.spriteW / 7;
        this.height = this.spriteH / 7;
        this.planeLeft = new Image();
        this.planeLeft.src = 'dist/img/red_plane_left.png';
        this.planeRight = new Image();
        this.planeRight.src = 'dist/img/red_plane_right.png';
    }

    //updating the plane position relative to the mouse position 
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.x != this.x) {
            this.x -= dx / 15;
        }

        if (mouse.y != this.y) {
            this.y -= dy / 20;
        }
        // animation
        if (gameFrame % 2 == 0) {
            this.frameX++;
            if (this.frameX >= 5) {
                this.frameX = 0;
            }
        }
    }

    draw() {
        //condition for the facing of the plane relative to the mouse position 
        if (this.x >= mouse.x) {
            ctx.drawImage(this.planeLeft, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH, this.x - 50, this.y - 30, this.width, this.height);
        } else {
            ctx.drawImage(this.planeRight, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH, this.x - 50, this.y - 30, this.width, this.height);
        }
    }
}

//create the plane
const plane = new Plane();


//birds
let birdsArray = [];
class Bird {
    constructor(x, y, speed, image) {
        this.x = x;
        this.y = y;
        this.radius = 23;
        this.speed = speed;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteW = 663;
        this.spriteH = 637;
        this.image = new Image();
        this.image.src = image;
        this.scale = getRandomFloat(7.5, 9.5)
        this.frequency = getRandomInt(5, 8);

    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, this.frameY * this.spriteH, this.spriteW, this.spriteH, this.x - 45, this.y - 45, this.spriteW / this.scale, this.spriteH / this.scale);
    }
    update() {
        this.x -= this.speed;
        this.y += Math.random() * 2 - 1;

        if (gameFrame % this.frequency == 0) {
            this.frame++;

            if (this.frame >= 8) {
                this.frame = 0;
            }

            if (this.frame == 3 || this.frame == 7) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }

            if (this.frame < 3) {
                this.frameY = 0;
            } else if (this.frame < 7) {
                this.frameY = 1;
            } else {
                this.frameY = 0;
            }
        }
    }
}



function handleBirds() {
    if (gameFrame % 700 == 0) {
        birdsArray.push(new Bird(-700, Math.random() * (canvas.height - 200) + 100, -(Math.random() + 1.7), 'dist/img/black_birds_right.png'));
        birdsArray.push(new Bird(canvas.width + 450, Math.random() * (canvas.height - 200) + 100, Math.random() + 1.9, 'dist/img/black_birds.png'));
    } else if (gameFrame % 900 == 0 && score >= 10) {
        birdsArray.push(new Bird(-500, Math.random() * (canvas.height - 300) + 200, -(Math.random() + 1.8), 'dist/img/black_birds_right.png'));
    }

    for (let k = 0; k < birdsArray.length; k++) {
        //detection of bird and plane collision using the Pythagorean Theorem
        if (Math.sqrt((plane.x - birdsArray[k].x) ** 2 + (plane.y - birdsArray[k].y) ** 2) < birdsArray[k].radius + plane.radius) {
            birdsArray[k].y += canvas.height + 100;
            ctx.drawImage(feather, 1989, 637, 663, 637, birdsArray[k].x - 50, birdsArray[k].y - canvas.height - 100, 70, 70);
            crowAudio.play();
            ctx.drawImage(parachute, plane.x - 70, plane.y + 100, 50, 50);
            plane.y = canvas.height + 100;
           
            handleGameOver();
        }

        birdsArray[k].update();
        birdsArray[k].draw();
        if (birdsArray[k].x < 0 - 800 || birdsArray[k].x > canvas.width + 800) {
            birdsArray.splice(k, 1);
            k--;
        }
    }
}


//Balloons
let balloonsArray = [];
class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y,
            this.radius = 25;
        this.speed = Math.random() * 4 + 1;
        this.counted = false;
        this.color = Math.floor(Math.random() * 6);
        this.image = new Image();
        this.image.src = 'dist/img/ballon-pop.png';
        this.spriteW = 500;
        this.spriteH = 600;
        this.scale = getRandomFloat(6.5, 7.5);

        this.width = this.spriteW / this.scale;
        this.height = this.spriteH / this.scale;
    }
    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.drawImage(this.image, 0, this.spriteH * this.color, this.spriteW,
            this.spriteH, this.x - 40, this.y - 45, this.width, this.height);
    }
}


let popBallonArray = [];
class PopBalloon {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.frameX = 2;
        this.spriteW = 500;
        this.spriteH = 600;
        this.image = new Image();
        this.image.src = 'dist/img/ballon-pop.png';
    }
    update() {
        this.y += Math.random() * 3 + 2; //  drop speed
        if (gameFrame % 2 == 0) {
            this.frameX++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, this.spriteH * this.color, this.spriteW,
            this.spriteH, this.x, this.y, this.spriteW / 7, this.spriteH / 7);
    }
}



function handleBalloons() {
    //push new balloon every 70 frames 
    if (gameFrame % 70 == 0) {
        balloonsArray.push(new Balloon(Math.random() * canvas.width, canvas.height + 100));
    }
    createAndDeleteBalloon();
}

function createAndDeleteBalloon() {
    for (let i = 0; i < balloonsArray.length; i++) {
        balloonsArray[i].update();
        balloonsArray[i].draw();

        //removing balloon that dissapear behind the top canvas edge
        if (balloonsArray[i].y < -100) {
            balloonsArray.splice(i, 1);
            i--;

            //detection of ballon and plane collision using the Pythagorean Theorem
        } else if (Math.sqrt((plane.x - balloonsArray[i].x) ** 2 + (plane.y - balloonsArray[i].y) ** 2) < balloonsArray[i].radius + plane.radius) {
            if (!balloonsArray[i].counted) {
                score++;
                balloonsArray[i].counted = true;
            }
            //create popBalloon having the same coordinates
            popBallonArray.push(new PopBalloon(balloonsArray[i].x - 40, balloonsArray[i].y - 45, balloonsArray[i].color));
            balloonsArray.splice(i, 1);
            i--;

            popAudio1.play();
        }
    }

}
//ballon and bird collision
function checkBirdBallonCollision() {
    for (let k = 0; k < birdsArray.length; k++) {
        for (let i = 0; i < balloonsArray.length; i++) {
            if (Math.sqrt((birdsArray[k].x - balloonsArray[i].x) ** 2 + (birdsArray[k].y - balloonsArray[i].y) ** 2) <
                birdsArray[k].radius + balloonsArray[i].radius &&
                Math.abs(birdsArray[k].y - balloonsArray[i].y) < 15) {
                popBallonArray.push(new PopBalloon(balloonsArray[i].x - 40, balloonsArray[i].y - 45, balloonsArray[i].color));
                balloonsArray.splice(i, 1);
                i--;
                popAudio2.play();
            }
        }
    }
}

//popped ballon animation
function handleBalloonsPop() {
    for (let i = 0; i < popBallonArray.length; i++) {
        popBallonArray[i].draw();
        popBallonArray[i].update();
        if (popBallonArray.length > 3) {
            popBallonArray.splice(1, 1);
        }
    }
}


//different animals
let animalsArray = [];
class Animal {
    constructor(x, y, frame, frameX, frameY, image, frequency) {
        this.x = x;
        this.y = y;
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteW = 128;
        this.spriteH = 128;
        this.image = new Image();
        this.image.src = image;
        this.frequency = frequency;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, this.frameY * this.spriteH, this.spriteW, this.spriteH,
            this.x, this.y, this.spriteW / 2.5, this.spriteH / 2.5);
    }
    update() {

        if (gameFrame % this.frequency == 0) {
            this.frame++;
            if (this.frame >= 4) {
                this.frame = 0;
            }
            if (this.frame == 3) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
        }
    }
}


animalsArray.push(new Animal(canvas.width * 0.65, canvas.height * 0.925, 0, 0, 0, 'dist/img/sheep_eat.png', 80));
animalsArray.push(new Animal(canvas.width * 0.7, canvas.height * 0.915, 0, 0, 1, 'dist/img/sheep_eat.png', 100));
animalsArray.push(new Animal(canvas.width * 0.63, canvas.height * 0.915, 0, 0, 2, 'dist/img/sheep_eat.png', 110));
animalsArray.push(new Animal(canvas.width * 0.12, canvas.height * 0.9, 0, 0, 3, 'dist/img/cow_eat.png', 105));


function handleAnimals() {
    for (let i = 0; i < animalsArray.length; i++) {
        animalsArray[i].update();
        animalsArray[i].draw();
    }
}

class Horse {
    constructor(x, y, frameX) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 0.8 + 0.4;
        this.frameX = frameX;
        this.spriteW = 60;
        this.spriteH = 33;
        this.image = new Image();
        this.image.src = 'dist/img/Horse_Run.png';
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH,
            this.x, this.y, this.spriteW / 2, this.spriteH / 2);
    }
    update() {
        this.x -= this.speed;

        if (this.x < 0) {
            this.x = canvas.width + 200;
            this.speed = Math.random() * 0.8 + 0.35;
        }

        if (gameFrame % 10 == 0) {
            this.frameX++;
            if (this.frameX >= 5) {
                this.frameX = 0;
            }
        }
    }
}

const horse1 = new Horse(canvas.width + 10, canvas.height - 30, 0);


function handleHorse() {
    horse1.update();
    horse1.draw();
}

function drawBackground(background) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}


function handleGameOver() {
    ctx.font = "80px Rubik";
    ctx.textAlign = "center";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2.2);
    ctx.font = "60px Rubik";
    ctx.fillText(`ВАШ СЧЕТ: ${score}`, canvas.width / 2, canvas.height / 1.5);
    gameOver = true;
}

function showScore() {
    ctx.drawImage(balloon, 0, 2400, 500, 600, canvas.width - 140, 10, 71, 86);
    ctx.font = '30px Rubik';
    ctx.fillText(` ${score}`, canvas.width - 80, 60);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


// animation loop
function animate() {
    if (!continueAnimating) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(sun);
    clouds1.draw();
    clouds2.draw();
    drawBackground(mountains);
    handleAnimals();
    handleHorse();
    handleBalloons();
    checkBirdBallonCollision();
    handleBalloonsPop();
    showScore();
    handleBirds();
    plane.update();
    plane.draw();
    gameFrame++;

    if (!gameOver) {
        requestAnimationFrame(animate);
    }
}


animate();

// resize window
window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});