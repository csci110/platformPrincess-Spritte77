import {game, Sprite} from "./sgc/sgc.js";

game.setBackground("Cemetery.png", 500, 0);

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