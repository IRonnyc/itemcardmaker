/**
 * Saves the current value of the passed Element as system in the cookie.
 * 
 * @param {Element} systemselector The selector that is used to determine which system is used for cards
 */
function saveSystem(systemselector) {
    document.cookie = "system=" + systemselector.value;
}

/**
 * Gets the value of the passed cookie name.
 * 
 * @param {string} cname The name of the cookie to get
 * @returns The value of the cookie or an empty string if the value does not exist
 */
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * Loads the previously stored selection of the passed selector from the cookie.
 * 
 * @param {Element} systemselector The selector that is used to determine which system is used for cards
 */
function loadSystem(systemselector) {
    let system = getCookie("system");
    console.log(system, systemselector);
    if (system) {
        systemselector.value = system;
    }
}

// Load the previously saved system once the DOM is done loading
document.addEventListener('DOMContentLoaded', () => loadSystem(document.getElementById("systemselector")));