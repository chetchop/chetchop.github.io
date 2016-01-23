var bx = 0;
var bx2 = 0;
var backshift = 4;
var anspeed = 0.04;


function Animation(spriteSheet, back, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.back = back;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    // if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y - 173;
    var offset = vindex === 0 ? this.startX : 0;
    
    ctx.drawImage(this.back,
                 0, 0,  // source from sheet
                 800, 500,
                 -bx2 + 800, 0,
                 //0, 0,
                 //-x + 800, y,
                 800,
                 500);

    ctx.drawImage(this.back,
             0, 0,  // source from sheet
             800, 500,
             //0, 0,
             -bx, 0,
             //-x, y,
             800,
             500);

    console.log("x: " + index * this.frameWidth + offset
        + " |y: " + vindex * this.frameHeight + this.startY)
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * 0.5,
                  this.frameHeight * 0.5);


}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

// Background.prototype.draw = function (ctx) {
//     ctx.fillStyle = "SaddleBrown";
//     ctx.fillRect(0,500,800,300);
//     Entity.prototype.draw.call(this);
// }

function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("Images/stickmansprite.png"),ASSET_MANAGER.getAsset("Images/pokebackground.jpg"), 0, 0, 180, 340, anspeed, 70, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("Images/stickmansprite.png"), ASSET_MANAGER.getAsset("Images/pokebackground.jpg"), 0, 0, 180, 340, 0.009, 70, false, false);
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {


    if (this.game.rkey) {
        console.log(this.game.rkey);
        backshift += 2;
        if (anspeed > 0.001) {
            anspeed -= 0.001;
        }
        this.animation = new Animation(ASSET_MANAGER.getAsset("Images/stickmansprite.png"),ASSET_MANAGER.getAsset("Images/pokebackground.jpg"), 0, 0, 180, 340, anspeed, 70, true, false);
        console.log(" animation: " + this.animation.frameDuration);

    }

    if (this.game.lkey) {//} && backshift > 4) {
        console.log(this.game.lkey)
        if (backshift > 4) {
            backshift -= 4;
        }
        if (anspeed < 0.04) {
            anspeed += 0.001;
        }
        this.animation = new Animation(ASSET_MANAGER.getAsset("Images/stickmansprite.png"),ASSET_MANAGER.getAsset("Images/pokebackground.jpg"), 0, 0, 180, 340, anspeed, 70, true, false);
        console.log(backshift);

        console.log(" animation: " + this.animation.frameDuration);
    }
    bx += backshift;
    bx2 += backshift;

    //if (this.game.space) this.jumping = true;, 
    //console.log(this.game.space + "" + this.game.lkey);
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 100;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance ));
        this.y = this.ground - height;
    }


    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (bx > 800) {
        bx = 0;
    }
    if (bx2 > 800) {
        bx2 = 0;
    }
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y-34);
        //this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
        
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("Images/stickmansprite.png");

ASSET_MANAGER.queueDownload("Images/pokebackground.jpg");

//ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    //var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);

    //gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
