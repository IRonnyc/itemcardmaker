/**
 * Connects the onchange event for the card border.
 * 
 * @param {Element} card The card to connect the onchange event on
 */
function wireCardStyler(card) {
    let cardBorderStyler = card.querySelector(".card-border-styler");
    let size = cardBorderStyler.querySelector(".border-size");
    let color = cardBorderStyler.querySelector(".border-color");

    cardBorderStyler.onchange = () => card.style.border = size.value + "px solid " + color.value;
}

/**
 * Connects the onclick event for the card title bar.
 * 
 * @param {Element} card The caard to connect the onclick events on
 */
function wireCardButtons(card) {
    card.querySelector(".remove-card").onclick = function() { removeCard(card); };
    card.querySelector(".export-card").onclick = function() { exportCard(card); };
    card.querySelector(".clone-card").onclick = function() { cloneCard(card); };

    card.querySelector(".increase-row-span").onclick = function() { changeRowSpan(card, 1) };
    card.querySelector(".decrease-row-span").onclick = function() { changeRowSpan(card, -1) };
    card.querySelector(".double-col-card").onclick = function() { toggleDoubleColumnCard(card) };

    card.querySelector(".move-forward-in-order").onclick = function () { moveInOrder(card, -1) };
    card.querySelector(".move-backward-in-order").onclick = function () { moveInOrder(card, 1) };
}

/**
 * Deletes the passed card from the DOM.
 * 
 * @param {Element} card The card to be deleted
 */
function removeCard(card) {
    card.remove();
}

/**
 * Creates a file from the passed card, containing all the information required to recreate it and offers it as a download.
 * 
 * @param {Element} card The card to exported.
 */
function exportCard(card) {
    /**
     * Extracts the data from the selected element, applying before beforehand and after afterwards
     * 
     * @param {string}   selector selector for the element to extract data from
     * @param {Function} before applied before extracting data
     * @param {Function} after  applied after extracting data, to revert the element to its olf state
     * @returns {string} the extracted data
     */
    let extractDataThrough = function(selector, before, after) {
        let elem = card.querySelector(selector);
        if (elem == undefined) {
            return "";
        }
        before(elem);
        let innerText = elem.innerText;
        after(elem);
        return innerText;
    };
    let title = extractDataThrough(".card-title", startEditing, stopEditing);
    let level = extractDataThrough(".card-level", startEditing, stopEditing);
    let tags = extractDataThrough(".card-tags", startEditingTags, stopEditingTags);
    let meta = extractDataThrough(".card-meta-data", startEditing, stopEditing);
    let description = extractDataThrough(".card-description", startEditing, stopEditing);

    download(title + ".dat", "@title:" + title +
        "@level:" + level +
        "@tags:" + tags +
        "@meta-data:" + meta +
        "@description:" + description);
}

/**
 * Creates a text file from the passed filename and text and offers it for download.
 * This happens by creating a temporary <a> object with the passed data and clicking it.
 * 
 * @param {string} filename The name of the file to create.
 * @param {string} text     The content of the file.
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * Creates a copy of an existing card.
 * 
 * @param {Element} card The card to be cloned
 */
function cloneCard(card) {
    let clone = card.cloneNode(true);
    wireCardButtons(clone);
    card.parentNode.appendChild(clone);
}

/**
 * Changes how many rows the passed card takes up.
 * 
 * @param {Element} card The card to be modified
 * @param {number} diff  The difference to be applied to the number of rows the card spans between
 */
function changeRowSpan(card, diff) {
    let rows = (parseInt(card.style.gridRow.replace("span ", "")) || 0);
    if (rows <= 1) {
        rows = 1;
        if (diff > 0) {
            rows += diff;
        }
    } else {
        rows += diff;
    }

    card.style.gridRow = "span " + rows;
}

/**
 * Toggles if the card takes up one or two columns.
 * 
 * @param {Element} card The card to be modified
 */
function toggleDoubleColumnCard(card) {
    card.classList.toggle("double-col");
}

/**
 * Moves the card in the display order. Passing a positive value or 0 will move the card forwards. 
 * A negative value will move the card backwards.
 * 
 * @param {Element} card The card to be moved
 * @param {number} direction The direction in which to move the card.
 * 
 */
function moveInOrder(card, direction) {
    let parentChildrenLength = card.parentNode.children.length;
    let prototypes = getNumberOfPrototypesIn(card.parentNode.children);
    for (let i = 0; i < parentChildrenLength; i++) {
        if (card.parentNode.children[i] == card) {
            let other = i + direction;
            if (direction > 0) { // if direction > 0
                other++; // insert after
            }

            if (other <= prototypes){
                other = prototypes;
            }
            else if (other > parentChildrenLength) {
                other = parentChildrenLength - 1;
            }
            card.parentNode.insertBefore(card, card.parentNode.children[other]);
            break;
        }
    }
}

/**
 * Returns the number of prototypes in the given array.
 * 
 * @param {Array} array The array of cards to count Elements with the prototype class in
 * @returns The number of elements with the prototype class
 */
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

/**
 * Creates a card from the passed string, assuming it follows the same rules as the
 * exported cards.
 * 
 * @param {string} stringData The data to create the card from.
 */
function createCard(stringData) {
    let card = addCard();
    let parts = stringData.split("@");
    console.log(parts);
    parts.forEach(function (elem) {
        if (elem != "") {
            console.log("elem: ", elem);
            let separationIndex = elem.indexOf(":");
            let readClass = ".card-" + elem.substring(0, separationIndex);
            console.log("readClass: ", readClass);
            let field = card.querySelector(readClass);
            console.log("field: ", field);
            if (field != undefined) {
                field.innerText = elem.substring(separationIndex + 1);

                if (readClass == ".card-tags") {
                    stopEditingTags(field);
                }
                stopEditing(field);
            }
        }
    });
}

/**
 * Creates a new card from the prototype matching the currently selected system.
 * 
 * @returns The newly created card
 */
function addCard() {
    let container = document.getElementById("cardcontainer");

    let prototype = document.getElementById("cardprototype-" + document.getElementById("systemselector").value);
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

/**
 * Loads a local text file to try to create a new card from.
 */
function loadCard() {
    let fileSelector = document.getElementById("fileSelector");
    fileSelector.onchange = function() {
        let files = fileSelector.files;
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            reader.readAsText(files[i], "UTF-8");
            reader.onload = function (evt) {
                createCard(evt.target.result);
            }
        }
    };
    fileSelector.click();
}
