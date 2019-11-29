const S_INVENTORY = "<table class=\"inventory-small\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const M_INVENTORY = "<table class=\"inventory\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const L_INVENTORY = "<table class=\"inventory-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";
const XL_INVENTORY = "<table class=\"inventory-extra-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>";

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

function applyFormatting(text, search, tag) {
    return text.split(search).reduce((a, b, i) => i % 2 == 0 ? a + "</" + tag + ">" + b : a + "<" + tag + ">" + b);
}