function saveSystem(systemselector) {
    document.cookie = "system=" + systemselector.value;
}

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

function loadSystem(systemselector) {
    let system = getCookie("system");
    console.log(system, systemselector);
    if (system) {
        systemselector.value = system;
    }
}

document.addEventListener('DOMContentLoaded', () => loadSystem(document.getElementById("systemselector")));