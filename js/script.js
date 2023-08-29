function addCard() {
    let container = document.getElementById("cardcontainer");

    let prototype = document.getElementById("cardprototype-" + getSysteme());
    let clone = prototype.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("prototype");
    // wire up events and buttons
    wireCardStyler(clone);
    wireCardButtons(clone);

    container.appendChild(clone);
    console.log("created card");
    return clone;
}

function getSysteme() {
    return document.getElementById("systemselector").value;
}

function getNumberOfPrototypesIn(array) {
    let count = 0;
    console.log(array);
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i].classList.contains("prototype")) {
            count++;
        } else {
            return count;
        }
    }
}

function togglePopup(searchIn, selector) {
    console.log(searchIn, selector);
    searchIn.querySelector(selector).classList.toggle("show");
}
