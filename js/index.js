window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        startGame();
    };

    function startGame() {

        const myObstacles = [];

        const gameArea = {
            canvas: document.getElementById("canvas"),
            frames: 0,
            start: function () {
                this.context = this.canvas.getContext("2d");
                this.interval = setInterval(updateGameArea, 20);
            },
            clear: function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            },
            stop: function () {
                clearInterval(this.interval);
            },
            score: function () {
                const points = Math.floor(this.frames / 5);
                this.context.font = '18px serif';
                this.context.fillStyle = 'black';
                this.context.fillText(`Score: ${points}`, 350, 50);
            }
        }


        class Component {
            constructor(width, height, color, x, y) {
                this.width = width;
                this.height = height;
                this.color = color;
                this.x = x;
                this.y = y;
                this.speedx = 0;
                this.speedy = 0;
            }

            update() {
                let ctx = gameArea.context;
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            newPos() {
                this.x += this.speedx;
                this.y += this.speedy;
            }

            left() {
                return this.x;
            }
            right() {
                return this.x + this.width;
            }
            top() {
                return this.y;
            }
            bottom() {
                return this.y + this.height;
            }

            crashWith(obstacle) {
                return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
            }
        }

        class Player {
            constructor(width, height, x, y) {
                this.width = width;
                this.height = height;
                this.x = x;
                this.y = y;
                this.speedx = 0;
                this.speedy = 0;
                const image = new Image();
                image.addEventListener("load", () => {
                    this.image = image;
                    this.update();
                })
                image.src = './images/car.png';
            }

            update() {
                let ctx = gameArea.context;
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }

            newPos() {
                this.x += this.speedx;
                this.y += this.speedy;
            }

            left() {
                return this.x;
            }
            right() {
                return this.x + this.width;
            }
            top() {
                return this.y;
            }
            bottom() {
                return this.y + this.height;
            }

            crashWith(obstacle) {
                return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
            }
        }

        let player = new Player(30, 50, 235, 650);


        function updateGameArea() {
            gameArea.clear();
            player.newPos();
            player.update();
            updateObstacles();
            checkGameOver();
            gameArea.score();
        }

        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
                case 37:
                    if (player.x >= 20) {
                        player.speedx -= 5;
                    } else {
                        player.speedx = 0;
                    }
                    break;
                case 39:
                    if (player.x <= 480) {
                        player.speedx += 5;
                    } else {
                        player.speedx = 0;
                    }
                    break;
            }
        })

        document.addEventListener("keyup", e => {
            player.speedx = 0;
            player.speedy = 0;
        })

        function updateObstacles() {
            gameArea.frames += 1;
            if (gameArea.frames % 120 === 0) {
                let minLength = 20;
                let maxLength = 200;
                let length = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);
                let minGap = 0;
                let maxGap = 300;
                let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
                myObstacles.push(new Component(length, 10, '../images/car.png', gap, 0));
            }
            for (i = 0; i < myObstacles.length; i++) {
                myObstacles[i].y += 1;
                myObstacles[i].update();
            }
        }

        function checkGameOver() {
            const crashed = myObstacles.some(function (obstacle) {
                return player.crashWith(obstacle);
            });
            if (crashed) {
                gameArea.stop();
            }
        }
        gameArea.start();

    }
};
