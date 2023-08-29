function wireCardStyler(card) {
    let cardBorderStyler = card.querySelector(".card-border-styler");
    let cardBorderSize = cardBorderStyler.querySelector(".border-size");
    let cardBorderColor = cardBorderStyler.querySelector(".border-color");

    cardBorderStyler.onchange = function() { changeCardBorder(card, cardBorderSize, cardBorderColor); };
}

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

function changeCardBorder(item, size, color) {
    console.log(item);
    console.log(size);
    console.log(item.style.border);

    item.style.border = size.value + "px solid " + color.value;
}

function removeCard(item) {
    item.remove();
}

function exportCard(item) {
    /**
     * Extracts the data from the selected element, applying before beforehand and after afterwards
     * @param selector selector for the element to extract data from
     * @param before applied before extracting data
     * @param after applied after extracting data, to revert the element to its olf state
     * @returns {string} the extracted data
     */
    let extractDataThrough = function(selector, before, after) {
        let elem = item.querySelector(selector);
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

function cloneCard(item) {
    let clone = item.cloneNode(true);
    wireCardButtons(clone);
    item.parentNode.appendChild(clone);
}

function changeRowSpan(item, diff) {
    let rows = (parseInt(item.style.gridRow.replace("span ", "")) || 0);
    if (rows <= 1) {
        rows = 1;
        if (diff > 0) {
            rows += diff;
        }
    } else {
        rows += diff;
    }

    item.style.gridRow = "span " + rows;
}

function toggleDoubleColumnCard(item) {
    item.classList.toggle("double-col");
}

function moveInOrder(item, direction) {
    let parentChildrenLength = item.parentNode.children.length;
    let prototypes = getNumberOfPrototypesIn(item.parentNode.children);
    for (let i = 0; i < parentChildrenLength; i++) {
        if (item.parentNode.children[i] == item) {
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
            item.parentNode.insertBefore(item, item.parentNode.children[other]);
            break;
        }
    }
}

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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}