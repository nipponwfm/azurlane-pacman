//--------------------------------------------------------------------INTTIALS
//const value
const frame = document.getElementById("frame");
const pacman = document.getElementById("pacman");
var bots = 1;
var dotPosition = []; //store dot position
var botPosition = []; //store bot position
//create dots
changeBotAmount = (x) => {
    if (x == "+") bots++;
    else if (x == "-" && bots > 1) bots--;
    document.getElementById("screenAmountBot").textContent = bots
}
createDot = (j, i) => {
    let dot = document.createElement("span"); dot.className = "dot";
    dot.style.top = 70 + j * 63 + 'px'; dot.style.left = 70 + i * 63 + 'px';
    frame.appendChild(dot);
    dotPosition.push({ x: dot.offsetLeft, y: dot.offsetTop });
}
for (var j = 0; j < 8; j++)
    for (var i = 0; i < 8; i++) createDot(j, i);
const dot = document.querySelectorAll(".dot");

//check dots-bots position
checkPosition = (pLeft, pTop, arr, width, height) => {
    let length = arr.length;
    var pLp = pLeft + 47, pTp = pTop + 66; //pacman width - height
    for (var i = 0; i < length; i++) {
        var x = arr[i].x, y = arr[i].y, xp = x + width; var yp = y + height;
        if (
            (pLeft <= x && x <= pLp && pTop <= y && y <= pTp)
            || (pLeft <= xp && xp <= pLp && pTop <= y && y <= pTp)
            || (pLeft <= x && x <= pLp && pTop <= yp && yp <= pTp)
            || (pLeft <= xp && xp <= pLp && pTop <= yp && yp <= pTp)
        ) return i;

    }
}
//bot check player position
botCheckPlayer = (vbot) => {
    let directPack = [];
    if (pacman.offsetLeft < vbot.offsetLeft) directPack.push("left");
    if (pacman.offsetLeft > vbot.offsetLeft) directPack.push("right");
    if (pacman.offsetTop < vbot.offsetTop) directPack.push("top")
    if (pacman.offsetTop > vbot.offsetTop) directPack.push("bottom")
    let index = Math.floor(Math.random() * directPack.length);
    return directPack[index];
}
//moving
moveLeft = (obj) => {
    obj.style.transform = "scaleX(-1)"
    if (obj.offsetLeft == 10) obj.offsetLeft = 10;
    else obj.style.left = obj.offsetLeft - 1 + "px";
}
moveRight = (obj) => {
    obj.style.transform = "scaleX(1)";
    if (obj.offsetLeft == 540) obj.offsetLeft = 540;
    else obj.style.left = obj.offsetLeft + 1 + "px";
}
moveTop = (obj) => {
    if (obj.offsetTop == 10) obj.offsetTop = 10;
    else obj.style.top = obj.offsetTop - 1 + "px";
}
moveBottom = (obj) => {
    if (obj.offsetTop == 520) obj.offsetTop = 520;
    else obj.style.top = obj.offsetTop + 1 + "px";
}
//controller
controller = (key) => {
    let pl = pacman.offsetLeft; let pt = pacman.offsetTop;
    let index = checkPosition(pl, pt, dotPosition, 15, 15);
    if (bots != 0 && !isNaN(index)) dot[index].remove();
    //check lose condition
    if (!isNaN(checkPosition(pl, pt, botPosition, 47, 66))) {
        window.alert("You was captured by your beloved senpai!!");
        clearInterval(botMove);
        clearInterval(pacmanMove);
    }
    botPosition = []; //reset bot position
    //pacman moving
    switch (key) {
        case 'a': {
            moveLeft(pacman);
            break;
        }
        case 'w': {
            moveTop(pacman);
            break;
        }
        case 'd': {
            moveRight(pacman);
            break;
        }
        case 's': {
            moveBottom(pacman);
            break;
        }
        default: {
        }
    }
}
//------------------------------------------------------------------------MAIN
//initial interval variables
var botMove = 0;
var pacmanMove = 0;
var signal = false;
var direct = [];
//----------------------------------------------------------------------------
gameStart = () => {
    document.getElementById("setting").style.display = "none";
    let smart = document.getElementById("smart").value;
    let speed = document.getElementById("speed").value;
    frame.style.opacity = 1;
    //create bots
    for (var i = 0; i < bots; i++) {
        let bot = document.createElement("span"); bot.className = "bot";
        frame.appendChild(bot)
    }
    const bot = document.querySelectorAll(".bot");

    //check win condition
    var wincondition = setInterval(() => {
        let amount = document.querySelectorAll(".dot").length;
        document.getElementById("point").textContent = 64 - amount + '/64';
        if (amount == 0) {
            window.alert("Congratulation!! You have escaped from your senpai");
            clearInterval(wincondition);
            clearInterval(botMove);
            clearInterval(pacmanMove);
        }
    }, 100)
    //signal for bot moving 
    setInterval(() => { signal = true }, 201 - smart);
    botMove = setInterval(() => {
        if (bots == 0) {
            clearInterval(botMove)
        }
        if (signal) {
            signal = false;
            bot.forEach((vbot, index) => {
                direct[index] = botCheckPlayer(vbot);
            })
        }
        bot.forEach((vbot, index) => {
            if (direct[index] == "left") moveLeft(vbot);
            else if (direct[index] == "right") moveRight(vbot);
            else if (direct[index] == "top") moveTop(vbot);
            else moveBottom(vbot);
            botPosition.push({ x: vbot.offsetLeft, y: vbot.offsetTop })
        })
    }, (601 - speed * 100) / 100)
    //keyboard event
    document.addEventListener("keypress", (event) => {
        clearInterval(pacmanMove);
        pacmanMove = setInterval(controller, 5, event.key);
    })
}