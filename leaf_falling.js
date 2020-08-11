const leafcontainer = document.getElementById("leaf-container");

var leaffalling_effect = setInterval ( () => {
    const leaf = document.createElement("span");
    leaf.className = "leaf";
    leafcontainer.appendChild(leaf);
    leaf.style.top = -(Math.floor(Math.random() * 50)) + "px";
    leaf.style.left = Math.floor(Math.random() * window.screen.width) + "px";
    setTimeout( () => {
        leaf.remove();
    }, 4000)
}, 2000)

clearLeafFalling = () => {
    clearInterval(leaffalling_effect);
}