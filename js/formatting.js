const FORMATTERS = {
    // bold text <b>
    "*": "b",
    // strikethrough <del>
    "~": "del",
    // italic <i>
    "_": "i",
    // subscript <sub>
    "§": "sub",
    // superscript <sup>
    "^": "sup"
};

const PLACEHOLDERS = {
    // Small inventory field
    Sinventory: "<table class=\"inventory-small\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>",
    // Medium inventory field
    Minventory: "<table class=\"inventory\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>",
    // Large inventory field
    Linventory: "<table class=\"inventory-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>",
    // Extra large inventory field
    Xlinventory: "<table class=\"inventory-extra-large\"><thead><tr><th>Item</th><th>Bulk</th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>",
    // Charge field for players to cross out
    C: "<input type=\"checkbox\" class=\"charge-tracker\">"
};

// A map connecting some tags with css classes
let specialTagClasses = new Map([
    ['Uncommon', 'rarity-uncommon'],
    ['Rare', 'rarity-rare'],
    ['Unique', 'rarity-unique']
]);

/**
 * Formats the textfield for editing by the user.
 * 
 * @param {Element} elem The textfield the user wants to edit
 */
function startEditing(elem) {
    let text = elem.innerHTML;

    for (let formatter in FORMATTERS) {
        text = revertFormatting(text, FORMATTERS[formatter], formatter);
    }

    for (let placeholder in PLACEHOLDERS) {
        text = text.replaceAll(PLACEHOLDERS[placeholder], placeholderKey(placeholder));
    }

    elem.innerHTML = text;
}

/**
 * Formats the textfield after the user is done editing it.
 * 
 * @param {Element} elem The textfield the user has been editing
 */
function stopEditing(elem) {
    let text = elem.innerHTML;

    for (let placeholder in PLACEHOLDERS) {
        text = text.replaceAll(placeholderKey(placeholder), PLACEHOLDERS[placeholder]);
    }

    for (let formatter in FORMATTERS) {
        text = applyFormatting(text, formatter, FORMATTERS[formatter]);
    }

    elem.innerHTML = text;
}

/**
 * Surrounds the passed key with curly brackets.
 * 
 * @param {string} key The placeholder's key in the PLACEHOLDERS array
 * @returns 
 */
function placeholderKey(key) {
    return "{" + key + "}";
}

/**
 * Formats the tags textfield the user wants to edit.
 * 
 * @param {Element} elem The element containing the tags
 */
function startEditingTags(elem) {
    startEditing(elem);
    let children = elem.children;
    console.log(children);
    let text = "";
    for (let i = 0; i < children.length; i++) {
        console.log(children[i]);
        text += children[i].innerHTML;
        if (i < children.length - 1) {
            text += "; ";
        }
    }

    elem.innerHTML = text;
}

/**
 * Formats the tags textfield after the user is done editing it.
 * 
 * @param {Element} elem The element containing the tags
 */
function stopEditingTags(elem) {
    let tags = elem.innerHTML.split(";");
    let html = "";

    tags.forEach(function (e) {
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

/**
 * Replaces all occurences of the passed html tag with the passed html tag.
 * 
 * @param {string} text        The text to apply the formatting to
 * @param {string} tag         The html tag (without the <>) to search for and then replace with the placeholder string
 * @param {string} placeholder The string to replace the tag with
 * @returns The deformatted text
 */
function revertFormatting(text, tag, placeholder) {
    re = new RegExp("</{0,1}" + tag + ">", "gm");
    return text.split(re).reduce((a, b) => a + placeholder + b);
}

/**
 * Replaces the passed placeholder with the passed html tag.
 * 
 * @param {string} text The text to apply the formatting to
 * @param {string} search The placeholder to search for
 * @param {string} tag The html tag (without the <>) to replace the placeholder with
 * @returns The formatted string
 */
function applyFormatting(text, search, tag) {
    return text.split(search)
        .reduce((a, b, i) =>
            i % 2 == 0 // are we on an even replication of this of this? 
                ? a + "</" + tag + ">" + b // even: close the tag
                : a + "<" + tag + ">" + b // odd: open the tag
        );
}
