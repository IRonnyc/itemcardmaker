
function getSysteme() {
    return document.getElementById("systemselector").value;
}

function addCard() {
    let container = document.getElementById("cardcontainer");

    let prototype = document.getElementById("cardprototype-" + getSysteme());
    let clone = prototype.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("prototype");
    // wire up remove button
    wireCardButtons(clone);

    container.appendChild(clone);
    console.log("created card");
    return clone;
}

function wireCardButtons(card) {
    card.querySelector(".remove-card").onclick = function() {removeCard(card);};
    card.querySelector(".export-card").onclick = function() {exportCard(card);};
    card.querySelector(".clone-card").onclick = function() {cloneCard(card);};

    card.querySelector(".increase-row-span").onclick = function() {changeRowSpan(card, 1)};
    card.querySelector(".decrease-row-span").onclick = function() {changeRowSpan(card, -1)};
    card.querySelector(".double-col-card").onclick = function() {toggleDoubleColumnCard(card)};

    card.querySelector(".move-forward-in-order").onclick = function () {moveInOrder(card, -1)};
    card.querySelector(".move-backward-in-order").onclick = function () {moveInOrder(card, 1)};
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
    for (let i = 0; i < parentChildrenLength; i++) {
        if (item.parentNode.children[i] == item) {
            let other = i + direction;
            if (other < 0){
                other = 0;
            }
            else if (other >= parentChildrenLength) {
                other = parentChildrenLength - 1;
            }
            item.parentNode.insertBefore(item, item.parentNode.children[other]);
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

function startEditing(elem) {
    let text = elem.innerHTML;
    text = revertFormatting(text, "b", "*");
    text = revertFormatting(text, "del", "~");
    text = revertFormatting(text, "i", "_");
    text = revertFormatting(text, "sub", "§");
    text = revertFormatting(text, "sup", "^");

    text = text.replace(S_INVENTORY, "{Sinventory}");
    text = text.replace(M_INVENTORY, "{Minventory}");
    text = text.replace(L_INVENTORY, "{Linventory}");
    text = text.replace(XL_INVENTORY, "{XLinventory}");

    elem.innerHTML = text;
}

function stopEditing(elem) {
    formatInput(elem);
}

function startEditingTags(elem) {
    startEditing(elem);
    let children = elem.children;
    console.log(children);
    let text = "";
    for (let i = 0; i < children.length; i++) {
        console.log(children[i]);
        text += children[i].innerHTML;
        if (i < children.length -1) {
            text += "; ";
        }
    }

    elem.innerHTML = text;
}

// Make the first characters upper case, because the traits are being normalized.
let specialTagClasses = new Map ([
    ['Uncommon', 'rarity-uncommon'],
    ['Rare', 'rarity-rare'],
    ['Unique', 'rarity-unique']
]);
function stopEditingTags(elem) {
    let tags = elem.innerHTML.split(";");
    let html = "";

    tags.forEach(function(e) {
        let traitName = e.trim();

        if (elem.parentElement.classList.contains("pf2")) {
            traitName = traitName.charAt(0).toUpperCase() + traitName.slice(1);
        }
        let classes = ["trait"];

        for (let key of specialTagClasses.keys()) {
            if (traitName == key) {
                classes.push(specialTagClasses.get(key));
                break;
            }
        }

        html += "<div class=\"" + classes.join(" ") + "\">" + traitName + "</div>";
    });

    elem.innerHTML = html;
    stopEditing(elem);
}

function revertFormatting(text, tag, placeholder) {
    re = new RegExp("</{0,1}" + tag + ">", "gm");
    return text.split(re).reduce((a, b) => a + placeholder + b);
}

function echoAndReturn(prefix, p) {
    console.log(prefix + ": " + p);
    return p;
}
function applyFormatting(text, search, tag) {
    return text.split(search).reduce((a, b, i) => i % 2 == 0 ? a + "</" + tag + ">" + b : a + "<" + tag + ">" + b);
}

const S_INVENTORY = "<table class=\"inventory-small\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const M_INVENTORY = "<table class=\"inventory\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const L_INVENTORY = "<table class=\"inventory-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const XL_INVENTORY = "<table class=\"inventory-extra-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";

function formatInput(elem) {
    let text = elem.innerHTML;

    text = text.replace("{Sinventory}", S_INVENTORY);
    text = text.replace("{Minventory}", M_INVENTORY);
    text = text.replace("{Linventory}", L_INVENTORY);
    text = text.replace("{XLinventory}", XL_INVENTORY);

    text = applyFormatting(text, "*", "b");
    text = applyFormatting(text, "~", "del");
    text = applyFormatting(text, "_", "i");
    text = applyFormatting(text, "§", "sub");
    text = applyFormatting(text, "^", "sup");

    elem.innerHTML = text;
}

function togglePopup(searchIn, selector) {
    console.log(searchIn, selector);
    searchIn.querySelector(selector).classList.toggle("show");
}
