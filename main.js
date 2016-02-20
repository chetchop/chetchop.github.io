
// GameBoard code below
var wait = 0;
var color = getRandomColor();

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};


function bar(game, w, h, px, py, transport) {
    this.transport = transport;
    this.width = w;
    this.height = h;
    this.posx = px;
    this.posy = py;
    Entity.call(this, game, this.posx, this.posy);
};

bar.prototype = new Entity();
bar.prototype.constructor = bar;

bar.prototype.collide = function (other) {
    return (other.y + other.radius > this.posy && other.y - other.radius < this.posy 
        + this.height && other.x + other.radius > this.posx && other.x - other.radius 
        < this.posx + this.width);
}

bar.prototype.update = function () {
    Entity.prototype.update.call(this);

        for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];

        if(ent !== this && this.collide(ent) && this.transport == true) {
            ent.x = Math.floor(Math.random() * (800 - 0)) + 0;
            ent.y = Math.floor(Math.random() * (800 - 0)) + 0;
        }

        if (ent !== this && this.collide(ent)) {
            //color = getRandomColor();

           //RIGHT
           if (ent.velocity.x < 0 && ent.velocity.y < 0 && ent.x > this.posx + this.width) {
                ent.velocity.x = -ent.velocity.x * friction;
                ent.velocity.y = ent.velocity.y * friction;
           } else if (ent.velocity.x < 0 && ent.velocity.y > 0 && ent.x > this.posx + this.width) {
                ent.velocity.x = -ent.velocity.x * friction;
                ent.velocity.y = ent.velocity.y * friction;
           //BOTTOM
           } else if (ent.velocity.x > 0 && ent.velocity.y < 0 && ent.y > this.posy + this.height) {
                ent.velocity.x = ent.velocity.x * friction;
                ent.velocity.y = -ent.velocity.y * friction;
           } else if (ent.velocity.x < 0 && ent.velocity.y < 0 && ent.y > this.posy + this.height) {
                ent.velocity.x = ent.velocity.x * friction;
                ent.velocity.y = -ent.velocity.y * friction;
           //LEFT
           } else if (ent.velocity.x > 0 && ent.velocity.y > 0 && ent.x < this.posx) {
                ent.velocity.x = -ent.velocity.x * friction;
                ent.velocity.y = ent.velocity.y * friction;
           } else if (ent.velocity.x > 0 && ent.velocity.y < 0 && ent.x < this.posx) {
                ent.velocity.x = -ent.velocity.x * friction;
                ent.velocity.y = ent.velocity.y * friction;
           //TOP
           } else if (ent.velocity.x < 0 && ent.velocity.y > 0 && ent.y <  this.posy) {
                ent.velocity.x = ent.velocity.x * friction;
                ent.velocity.y = -ent.velocity.y * friction;
           } else if (ent.velocity.x > 0 && ent.velocity.y > 0 && ent.y <  this.posy) {
                ent.velocity.x = ent.velocity.x * friction;
                ent.velocity.y = -ent.velocity.y * friction;
           }


        }
    }

}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

bar.prototype.draw = function (ctx) {
    wait++;
    ctx.fillStyle = color;
    if(wait > 2000) {
        color = getRandomColor();
        wait = 0;
    }
    ctx.fillRect(this.posx, this.posy, this.width, this.height);
};




function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};


Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    
   
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                this.setNotIt();
                ent.setIt();
            }
            else if (ent.it) {
                this.setIt();
                ent.setNotIt();
            }
        }

        // if (ent !== this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
        //     var dist = distance(this, ent);
        //     if (this.it && dist > this.radius + ent.radius + 10) {
        //         var difX = (ent.x - this.x)/dist;
        //         var difY = (ent.y - this.y)/dist;
        //         this.velocity.x += difX * acceleration / (dist*dist);
        //         this.velocity.y += difY * acceleration / (dist * dist);
        //         var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
        //         if (speed > maxSpeed) {
        //             var ratio = maxSpeed / speed;
        //             this.velocity.x *= ratio;
        //             this.velocity.y *= ratio;
        //         }
        //     }
        //     if (ent.it && dist > this.radius + ent.radius) {
        //         var difX = (ent.x - this.x) / dist;
        //         var difY = (ent.y - this.y) / dist;
        //         this.velocity.x -= difX * acceleration / (dist * dist);
        //         this.velocity.y -= difY * acceleration / (dist * dist);
        //         var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        //         if (speed > maxSpeed) {
        //             var ratio = maxSpeed / speed;
        //             this.velocity.x *= ratio;
        //             this.velocity.y *= ratio;
        //         }
        //     }
        // }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};




// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);

    circle.setIt();
    gameEngine.addEntity(circle);
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    }

    for (var i = 50; i < 800; i+=200) {
        for (var j = 50; j < 600; j+=200) {
            var block = new bar(gameEngine, 100, 100, j, i, false);
            gameEngine.addEntity(block);
        }
        var block1 = new bar(gameEngine, 100, 100, j, i,false);
        gameEngine.addEntity(block1);
    }

    var block2 = new bar(gameEngine, 25, 25, 387.5, 387.5, true);
    gameEngine.addEntity(block2);
   

    console.log(gameEngine.entities);
    gameEngine.init(ctx);
    gameEngine.start();
});
