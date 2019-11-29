
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

function togglePopup(searchIn, selector) {
    console.log(searchIn, selector);
    searchIn.querySelector(selector).classList.toggle("show");
}
