import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("Cemetery.png");

class platform extends Sprite {
    constructor(x, y, image) {
        super(x, y, image);
        this.x = x;
        this.y = y;
        this.height = 128;
        this.width = 128;
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}

let startDirt = new platform(0, 200, "tileFloatCenter.png");
let rightDirt = new platform(128, 200, "tileFloatRight.png");
let endDirt = new platform(game.displayWidth - 128, 500, "tileFloatLeft.png");

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 100;
        this.height = 48;
        this.width = 48;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
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
        this.isFalling = false; // assume she is not falling unless proven otherwise
        // Check directly below princess for platforms
        let platform = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1);
        if (platform.length === 0 || platform[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }
    }
    handleSpacebar() {
        if (!this.isFalling) {
            this.y = this.y - 1.25 * this.height; //jump
        }
    }
    handleBoundaryContact() {
        game.end("Princess Ann has fallen into a tombstone\n\nHave fun with Princess Zombie." +
            "\n\nCause this is Thriller!!!");
    }
}

let ann = new Princess();

class rLDirt extends platform {
    constructor(x, y) {
        super(x, y, "tileFloatCenter.png");
        this.name = "Left Right";
        this.angle = 0;
        this.speed = 48;
        this.angleTimer = 0;
    }
    handleGameLoop() {
        if (this.x >= game.displayWidth - 384) {
            this.angle = 180;
        }
        if (this.x <= rightDirt.x + 128) {
            this.angle = 0;
        }

    }
}

let lRDirt = new rLDirt(256, 200);


class upDownDirt extends platform {
    constructor(x, y) {
        super(x, y, "tileFloatCenter.png");
        this.name = "Up Down";
        this.angle = 90;
        this.speed = 48;
        this.angleTimer = 0;
    }
    handleGameLoop() {
        if (this.y <= 200) {
            this.angle = 280;
        }
        if (this.y >= 375) {
            this.angle = 90;
        }
    }
}

let uDDirt = new upDownDirt(game.displayWidth - 256, 300)

class Crate extends Sprite { //Need to make gravity
    constructor() {
        super();
        this.height = 96;
        this.width = 96;
        this.x = ann.x + 48;
        this.y = 100;
        this.setImage("Crate.png");
        this.startX = ann.x - 48;
        this.startY = 100;
        this.accelerateOnBounce = false;
    }
    handleGameLoop() {
        this.x = Math.max(5, this.x);
        this.isFalling = false;
        let platform = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1);
        if (platform.length === 0 || platform[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            this.x = this.x + 13;
        }
        if (otherSprite ===!ann ) {
            this.x = this.x;
        }
    }
    handleBoundaryContact() {
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > game.displayHeight) {
            this.x = this.startX;
            this.y = this.startY;
        }
    }
}


new Crate;

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = endDirt.y - 2 * 48;
        this.accelerateOnBounce = false;
    }
    handleCollision(otherSprite) {
        if (otherSprite instanceof Crate) {
            game.end("Congraulations! Princess Ann" +
                " has survived the night\nJust remember" +
                " 'No mere mortal can resist the evil of the Thriller!'" +
                "\n\nBWHAHAHAHAHA!!!");

        }
    }
}
let exit = new Door();
exit.name = "The Exit Door";

class Bat extends Sprite {
    constructor(x, y) {
        super();
        this.setImage("bat.png");
        this.name = "A scary bat";
        this.x = this.startX = x;
        this.y = this.startY = y;
        this.accelerateOnBounce = false;
        this.defineAnimation("flap", 0, 1);
        this.playAnimation("flap", true);
        this.attackSpeed = 300;
        this.speed = this.normalSpeed = 20;
        this.angle = 45 + Math.round(Math.random() * 3) * 90;
        this.angleTimer = 0;
    }
    attack() {
        this.speed = this.attackSpeed;
        this.aimFor(ann.x, ann.y);
    }
    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            let horizontalOffset = this.x - otherSprite.x;
            let verticalOffset = this.y - otherSprite.y;
            if (Math.abs(horizontalOffset) < this.width / 2 &&
                Math.abs(verticalOffset) < 30) {
                otherSprite.y = otherSprite.y + 1; // knock Ann off platform
            }
        }
        return false;
    }
    handleGameLoop() {
        if (Math.random() < 0.001) { //if bat is not attacking: hover
            this.attack();
        }
        let now = game.getTime();
        if (this.speed === this.normalSpeed) {
            if (now - this.angleTimer > 5) {
                if (Math.random() < 0.5) this.angle = this.angle + 90;
                if (Math.random() >= 0.5) this.angle = this.angle + 180;
            }
            this.angleTimer = now;
        }
    }
    handleBoundaryContact() {
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > game.displayHeight) {
            this.x = this.startX;
            this.y = this.startY;
            this.speed = this.normalSpeed;
            this.angle = 225;
        }
    }
}

let leftBat = new Bat(200, 100);
let rightBat = new Bat(500, 75);

