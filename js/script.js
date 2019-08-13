function addCard() {
    let container = document.getElementById("cardcontainer");

    let prototype = document.getElementById("cardprototype");
    let clone = prototype.cloneNode(true);
    clone.removeAttribute("id");
    // wire up remove button
    clone.querySelector(".remove-card").onclick = function() {removeCard(clone);};
    clone.querySelector(".export-card").onclick = function() {exportCard(clone);};

    container.appendChild(clone);
    return clone;
}

function removeCard(item) {
    item.remove();
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
            field.innerText = elem.substring(separationIndex + 1);
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

function exportCard(item) {
    startEditing(item);
    let title = item.querySelector(".card-title").innerText;
    let level = item.querySelector(".card-level").innerText;
    let tags = item.querySelector(".card-tags").innerText;
    let meta = item.querySelector(".card-meta-data").innerText;
    let description = item.querySelector(".card-description").innerText;
    download(title + ".dat", "@title:" + title +
        "@level:" + level +
        "@tags:" + tags +
        "@meta-data:" + meta +
        "@description:" + description);
    stopEditing(item);
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
    text = revertFormatting(text, "i", "_");
    elem.innerHTML = text;
}

function stopEditing(elem) {
    formatInput(elem);
}

function startEditingTags(elem) {
    let children = elem.children;
    console.log(children);
    let text = "";
    for (let i = 0; i < children.length; i++) {
        console.log(children[i]);
        text += children[i].innerHTML;
        if (i < children.length -1) {
            text += ", ";
        }
    }

    elem.innerHTML = text;
}

function stopEditingTags(elem) {
    let tags = elem.innerHTML.split(",");
    let html = "";

    tags.forEach(function(e) {
        html += "<div class=\"trait\">" + e.trim() + "</div>";
    });

    elem.innerHTML = html;
}

function revertFormatting(text, tag, placeholder) {
    let re = new RegExp("</{0,1}" + tag + ">", "gm");
    return text.split(re).reduce((a,b) => a + placeholder + b);
}

function applyFormatting(text, search, tag) {
    return text.split(search).reduce((a, b, i) => i % 2 == 0 ? a + "</" + tag + "> " + b : a + "<" + tag + ">" + b);
}

function formatInput(elem) {
    let text = elem.innerHTML;
    text = applyFormatting(text, "*", "b");
    text = applyFormatting(text, "_", "i");
    elem.innerHTML = text;
}