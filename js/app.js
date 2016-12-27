// Enemies our player must avoid
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.y = 60 + Math.floor(Math.random() * 3) * 83;                       //Put the bug on a random path
    this.x = -150;
    this.speed = Math.random() * 470 + 30;                                    //Give the bug a random speed

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x > 500) {                                                         //When the object should disappear,
        allEnemies.splice(allEnemies.indexOf(this), 1);                     //and be removed from allEnemies array
        //console.log("dead");
    }
    else
        this.x = this.x + this.speed * dt;

    //console.log(this.x);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (char, x, y) {            //Player Class
    this.sprite = char;
    this.x = x;
    this.y = y;
}


Player.prototype.update = function () {
    var self=this;
    allEnemies.forEach(function (each) {                                                                //If the player and a bug collide
        if (Math.abs(each.y - self.y) <= 50 && Math.abs(each.x - self.x) <= 60) {                   //reset the player's position
            self.y = 383;                                                                                //and impact the score and life
            self.x = 203;
            if (score > 100)
                score -= 100;
            else
                score = 0;
            life--;
            if (life == 0)                                                                              //If life has reached 0, game over
                self.stop();
        }
    })
}

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset=function () {
    this.x=x;
    this.y=y;
}

Player.prototype.stop=function () {
    this.reset();
    isStarted = false;
    allEnemies = [];
    createGems();
    console.log(isStarted)
}

Player.prototype.handleInput = function (key) {
    if (!isStarted) {                                                                           //If game is not started yet, moving is not allowed
        return;
    }
    switch (key) {                                                                                //Moves the character
        case "left":
            if (this.x > 1) this.x -= 101;
            break;
        case "right":
            if (this.x < 404) this.x += 101;
            break;
        case "up":
            if (this.y > 51)
                this.y -= 83;
            else {                                                                              //If the character has reached river, reset and reward it
                score += 50;
                this.reset();
                createGems();
            }
            break;
        case "down":
            if (this.y < 383) this.y += 83;
            break;
    }
    // console.log(this.x + "," + this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var Selector = function (x) {
    this.sprite = 'images/enemy-bug.png';
    this.y = y - 90;
    this.x = x;
}

Selector.prototype.render = function () {
    ctx.drawImage(Resources.get("images/Selector.png"), this.x, this.y);
}

var Gem = function (type) {                                                             //Reward Class
    this.y = 60 + Math.floor(Math.random() * 3) * 83;
    this.x = Math.floor(Math.random() * 5) * 101;
    this.type = type;
    var str = this.x.toString() + "," + this.y.toString();
    while (true) {                                                                      //Prevents each reward item from being put into a same block
        if (isGemOverlapped(this.x, this.y)) {
            this.y = 60 + Math.floor(Math.random() * 3) * 83;
            this.x = Math.floor(Math.random() * 5) * 101;
        }
        else break;
    }


    this.sprite = "";
    this.score = 0;
    switch (this.type) {                                                                //Defines the item's reward based on its type
        case 0: {
            this.sprite = "images/Gem Blue.png";
            this.score = 50;
        }
            break;
        case 1: {
            this.sprite = "images/Gem Green.png";
            this.score = 100;
        }
            break;
        case 2: {
            this.sprite = "images/Gem Orange.png";
            this.score = 150;
        }
            break;
        case 3: {
            this.sprite = "images/Heart.png";
        }
            break;
        case 4: {
            this.sprite = "images/Key.png";
            this.score = 150;
        }
            break;
    }
}

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

Gem.prototype.update = function () {                                                             //If the player and a reward collides,
    if (player.x >= this.x && player.x <= this.x + 101) {                                       //remove it from gems array and reward the player
        if (player.y >= this.y - 60 && player.y + 60 <= this.y + 83) {
            if (this.type == 3) {
                life++;
            }
            else if (this.type == 4) {
                life++;
            }

            score += this.score;
            gems.splice(gems.indexOf(this), 1);
        }
    }
}

var x = 203;
var y = 383;
var score = 0;
var life = 3;
var character = "images/char-boy.png";
var allEnemies = [];
var player = new Player(character, x, y);
var selector = new Selector(0);
var gems = [];
var isStarted = false;

function createGems() {                                                         //Generates reward items
    gems = [];
    gems.push(new Gem(Math.floor(Math.random() * 3)));
    gems.push(new Gem(Math.floor(Math.random() * 3)));
    gems.push(new Gem(Math.floor(Math.random() * 3)));
    var isHeart = Math.random() * 100;
    var isKey = Math.random() * 100;
    if (isHeart < 20)
        gems.push(new Gem(3));
    if (isKey < 5)
        gems.push(new Gem(4));
}

createGems();

function isGemOverlapped(x, y) {                                                //If two items are overlapped
    for (var i = 0; i < gems.length; i++) {
        var gem = gems[i];
        if (gem.x == x && gem.y == y)
            return true;
    }
    return false;
}

function createEnemy() {                                                        //Generates bugs
    if (!isStarted)
        return;

    allEnemies.push(new Enemy());
    setTimeout(function () {
        window.requestAnimationFrame(function () {
            createEnemy();
        })
    }, Math.random() * 1700 + 300);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener("click", function (e) {                                               //Allows the plays chooses a character
    if (isStarted)                                                                                //only when the game is not started
        return;
    var y_click = e.offsetY - 50;
    var x_click = e.offsetX;
    if (y_click >= 333 && y_click <= 414) {
        if (x_click <= 101) {
            selector = new Selector(0);
            player = new Player(p1.sprite, x, y);
        }
        else if (x_click <= 202) {
            selector = new Selector(101);
            player = new Player(p2.sprite, x, y);
        }
        else if (x_click <= 303) {
            selector = new Selector(202);
            player = new Player(p3.sprite, x, y);
        }
        else if (x_click <= 404) {
            selector = new Selector(303);
            player = new Player(p4.sprite, x, y);
        }
        else if (x_click <= 505) {
            selector = new Selector(404);
            player = new Player(p5.sprite, x, y);
        }
    }

})


function start() {                                                                            //Starts the game
    if (isStarted)
        return;
    score = 0;
    life = 3;
    isStarted = true;
    createEnemy();
}

// function stop() {                                                                           //Stops the game
//     isStarted = false;
//     player.reset();
//     allEnemies = [];
//     createGems();
// }

//Create characters for the player

var p1 = new Player('images/char-boy.png', 0, y - 83);
var p2 = new Player("images/char-cat-girl.png", 101, y - 83);
var p3 = new Player("images/char-horn-girl.png", 202, y - 83);
var p4 = new Player("images/char-pink-girl.png", 303, y - 83);
var p5 = new Player("images/char-princess-girl.png", 404, y - 83);




