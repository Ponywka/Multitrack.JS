export function getPosInElement(element, event) {
    return {
        x: event.clientX - element.getBoundingClientRect().x,
        y: event.clientY - element.getBoundingClientRect().y,
    };
}

export function logError(text) {
    console.error(`${this._.name} | ${text}`);
}

export function secondsToTime(sec) {
    sec = Math.floor(sec);
    let seconds = sec % 60;
    let minutes = Math.floor(sec / 60) % 60;
    let hours = Math.floor(sec / 3600);
    return hours > 0
        ? `${hours}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        : `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`;
}

export function createElement(tag, params = {}, actions = () => {}) {
    var el = document.createElement(tag);
    for (var name in params) el.setAttribute(name, params[name]);
    actions(el);
    return el;
}
