export function getPosInElement(element, event) {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
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

  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

export function createElement(tag, params = {}, actions = () => {}) {
  var el = document.createElement(tag);
  Object.keys(params).forEach((name) => el.setAttribute(name, params[name]));
  actions(el);
  return el;
}

export function sleep(ms) {
  return new Promise((reject) => {
    setTimeout(() => {
      reject();
    }, ms);
  });
}
