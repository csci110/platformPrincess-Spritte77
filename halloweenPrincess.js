import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("Cemetery.png");

class platform extends Sprite {
    constructor(x, y, image){
        super(x, y, image);
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

let startDirt = new platform(0, 400, "tileFloatCenter.png");
let rightDirt = new platform(128, 400, "tileFloatRight.png");
let endDirt = new platform(game.displayWidth- 128, 400, "tileFloatLeft.png");

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 300;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation ("left", 9, 11);
        this.defineAnimation ("right", 3, 5);
        this.isFalling = false;
    }
    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }
    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }
    handleGameLoop() {
        if (this.angle === 0 && this.speed > 0) {
            this.playAnimation("right");
        }
        if (this.angle === 180 && this.speed > 0) {
            this.playAnimation("left");
        }
        this.x = Math.max(5, this.x);
        this.isFalling = false;  // assume she is not falling unless proven otherwise
        // Check directly below princess for platforms
        let platform = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, platform);
        if platform.length === 0 || platform[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }
    }
    handleSpacebar() {
        if(!this.isFalling) {
            this.y = this.y - 1.25 * this.height; //jump
        }
    }
    handleBoundaryContact() {
        game.end("Princess Ann has fallen into a tombstone\n\nHave fun with Princess Zombie."
        + "\n\nCause this is Thriller!!!");
    }
}

let ann = new Princess();


class upDownDirt extends platform { 
    constructor(x, y) {
        super(x, y, "tileFloatCenter.png");
        this.name = "Up Down";
        this.angle = 90;
        this.speed = 48;
    }
}

class crate extends Sprite {
    constructor() {
        super();
        this.x = 60;
        this.y = 400;
        this.setImage("Crate.png");
        
    }
}

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform.y - 2 * 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if(otherSprite === ann && Crate) {
            game.end("Congraulations! Princess Ann"
            + " has survived the night\nJust Remember"
            + " No mere mortal can resist the evil of the Thriller!"
            + "\n\nBWHAHAHAHAHA!!!)"
        }
    }
}

let exit = new Door();
exit.name = "The Exit Door";