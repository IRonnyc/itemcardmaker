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
            let separationIndex = elem.indexOf(":");
            let readClass = ".item-" + elem.substring(0, separationIndex);

            let field = card.querySelector(readClass);
            field.value = elem.substring(separationIndex + 1);
            if (field.oninput) {
                field.oninput.apply(field);
            }
        }
    });
}

function loadCard() {
    let fileSelector = document.getElementById("fileSelector");
    fileSelector.onchange = function() {
        let files = fileSelector.files;
        let reader = new FileReader();
        console.log(files);
        for (var i = 0; i < files.length; i++) {
            reader.readAsText(files[i], "UTF-8");
            reader.onload = function (evt) {
                createCard(evt.target.result);
            }
        }
    };
    fileSelector.click();
}

function exportCard(item) {
    let title = item.querySelector(".item-title").value;
    let level = item.querySelector(".item-level").value;
    let tags = item.querySelector(".item-tags").value;
    let meta = item.querySelector(".item-meta-data").value;
    let description = item.querySelector(".item-description").value;
    download(title + ".dat", "@title:" + title +
        "@level:" + level +
        "@tags:" + tags +
        "@meta-data:" + meta +
        "@description:" + description);
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