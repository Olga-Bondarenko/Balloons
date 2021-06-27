'use strict';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 800;


let score = 0;
let gameFrame = 0;
let gameOver = false;


//координаты относительного окна
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
};

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

});

canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});

//загружаем изображения
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


//загружаем звуки
const popAudio1 = new Audio('sounds/Balloon_popping_burst_2.mp3');
popAudio1.volume = 0.3;
const popAudio2 = new Audio('sounds/Balloon_popping_burst_1.mp3');
popAudio2.volume = 0.3;
const crowAudio = new Audio();
crowAudio.src = 'sounds/crow.wav';


//фоновая музыка
const myAudio1 = new Audio();
myAudio1.src = 'sounds/music.mp3';
myAudio1.loop = true;
myAudio1.volume = 0.01;


// кнопки
let BgMusic = document.querySelector('#music');
let pauseBtn = document.querySelector('#pause');
let newGame = document.querySelector('#new_game');

//музыка
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


//пауза
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


//начать новую игру
newGame.addEventListener('click', () => {
    console.log('click');
    window.location.reload();
});



//облака
class Cloud {
    constructor(image, k) {
        this.x1 = 0;
        this.x2 = canvas.width;
        this.y = 0;
        this.k = k;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        this.x1 -= this.k; //k - кооэффициент скорости движения облаков
        if (this.x1 < -this.width) {
            this.x1 = this.width;
        }
        this.x2 -= this.k;
        if (this.x2 < -this.width) {
            this.x2 = this.width;
        }
        ctx.drawImage(this.image, this.x1, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}


let clouds1 = new Cloud('dist/img/clouds1.png', 0.04);
let clouds2 = new Cloud('dist/img/clouds2.png', 0.08);


//самолет
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

        if (gameFrame % 2 == 0) {
            this.frameX++;
            if (this.frameX >= 5) {
                this.frameX = 0;
            }
        }
    }

    draw() {
        if (this.x >= mouse.x) { //условие направления самолета по отношению к позиции мыши
            ctx.drawImage(this.planeLeft, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH, this.x - 50, this.y - 30, this.width, this.height);
        } else {
            ctx.drawImage(this.planeRight, this.frameX * this.spriteW, 0, this.spriteW, this.spriteH, this.x - 50, this.y - 30, this.width, this.height);
        }
    }
}


const plane = new Plane();

//птицы
let birdsArray = [];

class Bird {
    constructor(x, speed, image) {
        this.x = x;
        this.y = Math.random() * (canvas.height - 200) + 100;
        this.radius = 25;
        this.speed = speed;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteW = 663;
        this.spriteH = 637;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, this.frameY * this.spriteH, this.spriteW, this.spriteH, this.x - 45, this.y - 45, this.spriteW / 7.5, this.spriteH / 7.5);
    }
    update() {
        this.x -= this.speed;
        this.y += Math.random() * 2 - 1;

        if (this.x < -1000) {
            this.x = canvas.width + 600;
            this.y = Math.random() * (canvas.height - 200) + 100;
            this.speed = Math.random() * 2 + 2;
        }
        if (this.x > canvas.width + 700) {
            this.x = -500;
            this.y = Math.random() * (canvas.height - 200) + 100;
            this.speed = -(Math.random() * 2 + 2);
        }
        if (gameFrame % 5 == 0) {
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
        //столкновение с самолетом :(
        const dx = this.x - plane.x;
        const dy = this.y - plane.y;
        this.distance = Math.sqrt(dx ** 2 + dy ** 2);

    }
}


birdsArray.push(new Bird(canvas.width + 600, Math.random() + 1.7, 'dist/img/black_birds.png'));
birdsArray.push(new Bird(-900, -(Math.random() + 1.5), 'dist/img/black_birds_right.png'));


function handleBirds() {
    for (let k = 0; k < birdsArray.length; k++) {
        //условие столкновения птицы и самолета
        if ((birdsArray[k].distance < birdsArray[k].radius + plane.radius)) {
            birdsArray[k].y += canvas.height + 100;
            ctx.drawImage(feather, 1989, 637, 663, 637, birdsArray[k].x - 70, birdsArray[k].y - canvas.height - 70, 70, 70);
            crowAudio.play();
            ctx.drawImage(parachute, plane.x - 70, plane.y + 10, 50, 50);
            plane.y = canvas.height + 100;
            //конец игры
            handleGameOver();
        }

        birdsArray[k].update();
        birdsArray[k].draw();
    }
}


//Шарики
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
        this.width = this.spriteW / 7;
        this.height = this.spriteH / 7;
    }
    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.drawImage(this.image, 0, this.spriteH * this.color, this.spriteW,
            this.spriteH, this.x - 40, this.y - 45, this.width, this.height);
    }
}


//шарики лопнули
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
        this.y += Math.random() * 3 + 2; // скорость падения
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
    if (gameFrame % 70 == 0) { //добавление элемента каждые 70 фреймов
        balloonsArray.push(new Balloon(Math.random() * canvas.width, canvas.height + 100));
    }
    checkBallonExist();
}

function checkBallonExist() {
    for (let i = 0; i < balloonsArray.length; i++) {
        balloonsArray[i].update();
        balloonsArray[i].draw();

        if (balloonsArray[i].y < 0 - balloonsArray[i].radius * 2) {
            balloonsArray.splice(i, 1);
            i--;

            // столкновение с самолетом
        } else if (Math.sqrt((plane.x - balloonsArray[i].x) ** 2 + (plane.y - balloonsArray[i].y) ** 2) < balloonsArray[i].radius + plane.radius) {
            if (!balloonsArray[i].counted) {
                score++;
                balloonsArray[i].counted = true;
            }
            popBallonArray.push(new PopBalloon(balloonsArray[i].x - 40, balloonsArray[i].y - 45, balloonsArray[i].color));
            balloonsArray.splice(i, 1);
            i--;
            popAudio1.play();
        }
    }

}
//столконовение птицы с шариком
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

//анимация лопнувших шариков
function handleBalloonsPop() {
    for (let i = 0; i < popBallonArray.length; i++) {
        popBallonArray[i].draw();
        popBallonArray[i].update();
        if (popBallonArray.length > 5) {
            popBallonArray.splice(1, 1);
        }
        console.log(popBallonArray);
    }
}



//разные животные
class Animal {
    constructor(x, y, frame, frameX, frameY, image) {
        this.x = x;
        this.y = y;
        this.frame = frame;
        this.frameX = frameX;
        this.frameY = frameY;
        this.spriteW = 128;
        this.spriteH = 128;
        this.image = new Image();
        this.image.src = image;
    }
    draw() {
        ctx.drawImage(this.image, this.frameX * this.spriteW, this.frameY * this.spriteH, this.spriteW, this.spriteH,
            this.x, this.y, this.spriteW / 2.5, this.spriteH / 2.5);
    }
    update(frequency) {

        if (gameFrame % frequency == 0) {
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

const sheep1 = new Animal(canvas.width * 0.65, canvas.height * 0.925, 0, 0, 0, 'dist/img/sheep_eat.png');
const sheep2 = new Animal(canvas.width * 0.7, canvas.height * 0.915, 0, 0, 1, 'dist/img/sheep_eat.png');
const sheep3 = new Animal(canvas.width * 0.63, canvas.height * 0.915, 0, 0, 2, 'dist/img/sheep_eat.png');
const cow1 = new Animal(canvas.width * 0.12, canvas.height * 0.9, 0, 0, 3, 'dist/img/cow_eat.png');


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


//конец игры
function handleGameOver() {
    ctx.font = "80px Rubik";
    ctx.textAlign = "center";
    ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2.2);
    ctx.font = "60px Rubik";
    ctx.fillText(`ВАШ СЧЕТ: ${score}`, canvas.width / 2, canvas.height / 1.5);
    gameOver = true;
}

function showScore() {
    ctx.drawImage(balloon, 0, 2400, 500, 600, canvas.width - 125, 10, 71, 86);
    ctx.font = '30px Rubik';
    ctx.fillText(` ${score}`, canvas.width - 65, 60);
}


function animate() {
    if (!continueAnimating) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(sun);
    clouds1.draw();
    clouds2.draw();
    drawBackground(mountains);
    handleSheep();
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

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
});