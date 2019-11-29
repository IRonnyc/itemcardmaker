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