import { createElement, logError } from "../utils";
import { setVideo, setAudio, setSubtitles } from "../trackSwitcher";
import { setSpeed } from "../playback";

function resetMenu() {
  this._.form.settings.title.innerText = "Настройки";
  this._.form.settings.header.setAttribute("showIcon", null);
  for (let el in this._.form.settings.menu) {
    this._.form.settings.menu[el].content.setAttribute(
      "style",
      "display: none"
    );
  }
  this._.form.settings.menuSwitcher._root.removeAttribute("style");
}

export function toggleSettings() {
  if (!this._.form.settings.opened) {
    resetMenu.call(this);
    this._.form.settings._root.setAttribute("style", "display: block");
  } else {
    this._.form.settings._root.removeAttribute("style");
  }
  this._.form.settings.opened = !this._.form.settings.opened;
}

export function generateSettings() {
  this._.form.settings = {
    opened: false,
    menu: {
      quality: {
        titlename: "Качество",
        content: createElement("div"),
      },
      dubs: {
        titlename: "Озвучки",
        content: createElement("div"),
      },
      subtitles: {
        titlename: "Субтитры",
        content: createElement("div"),
      },
      playbackSpeed: {
        titlename: "Скорость воспроизведения",
        content: createElement("div"),
      },
      info: {
        titlename: "Информация о плеере",
        content: createElement(
          "div",
          {
            blockName: "info",
          },
          (el) => {
            let authorBlock = createElement(
              "div",
              {
                style: "display: flex; padding-bottom: 12px",
              },
              (bl) => {
                bl.appendChild(
                  createElement("img", {
                    src:
                      "https://avatars2.githubusercontent.com/u/26777464?s=96",
                    width: 48,
                    height: 48,
                  })
                );
                bl.appendChild(
                  createElement(
                    "div",
                    {
                      style: "line-height: 20px; padding: 4px 8px",
                    },
                    (inf) => {
                      inf.innerHTML +=
                        'Исходный код плеера:<br><a href="https://github.com/Ponywka/Multitrack.JS" style="color: #ffccff">Ponywka/Multitrack.JS</a>';
                      inf.innerHTML +=
                        "<!--| Да, Somepony, ты дождался его! |-->";
                    }
                  )
                );
              }
            );
            el.appendChild(authorBlock);
            el.innerHTML += "Build date: " + new Date(__TIMESTAMP__).toString();
          }
        ),
      },
    },
    title: createElement("div", {
      style: "mjs__settingsHeader-title",
    }),
    header: createElement(
      "div",
      {
        class: "mjs__settingsHeader",
      },
      (el) => {
        el.addEventListener("click", () => {
          resetMenu.call(this);
        });
      }
    ),
    body: createElement("div", {
      class: "mjs__settingsBody",
    }),
    menuSwitcher: {
      _root: createElement("div"),
    },
    _root: createElement("div", {
      class: "mjs__settings",
    }),
  };

  this._.form.settings.body.appendChild(
    this._.form.settings.menuSwitcher._root
  );

  for (let el in this._.form.settings.menu) {
    this._.form.settings.body.appendChild(
      this._.form.settings.menu[el].content
    );
    this._.form.settings.menuSwitcher[`btn${el}`] = createElement(
      "div",
      {
        class: "mjs__settings_element",
        page: el,
      },
      (btn) => {
        btn.innerText = this._.form.settings.menu[el].titlename;

        btn.onclick = (event) => {
          resetMenu.call(this);
          this._.form.settings.header.setAttribute("showIcon", "true");
          this._.form.settings.title.innerText = this._.form.settings.menu[
            el
          ].titlename;
          this._.form.settings.menu[el].content.removeAttribute("style");
          this._.form.settings.menuSwitcher._root.setAttribute(
            "style",
            "display: none;"
          );
        };
      }
    );
    this._.form.settings.menuSwitcher._root.appendChild(
      this._.form.settings.menuSwitcher[`btn${el}`]
    );
  }

  resetMenu.call(this);

  let firstBtn;

  firstBtn = true;
  for (let el of this._.videos) {
    let btn = createElement(
      "div",
      {
        class: "mjs__settings_element",
        link: el.path,
      },
      (btn) => {
        btn.innerText = el.name;
        btn.onclick = (event) => {
          for (let el1 of this._.form.settings.menu.quality.content.querySelectorAll(
            "*"
          ))
            el1.removeAttribute("selected");
          btn.setAttribute("selected", "true");
          setVideo.call(this, el.path);
        };
      }
    );
    this._.form.settings.menu.quality.content.appendChild(btn);
    if (firstBtn) {
      btn.click();
      firstBtn = false;
    }
  }

  firstBtn = true;
  for (let el of this._.audios) {
    let btn = createElement(
      "div",
      {
        class: "mjs__settings_element",
        link: el.path,
      },
      (btn) => {
        btn.innerText = el.name;
        btn.onclick = (event) => {
          for (let el1 of this._.form.settings.menu.dubs.content.querySelectorAll(
            "*"
          ))
            el1.removeAttribute("selected");
          btn.setAttribute("selected", "true");
          setAudio.call(this, el.path);
        };
      }
    );
    this._.form.settings.menu.dubs.content.appendChild(btn);
    if (firstBtn) {
      btn.click();
      firstBtn = false;
    }
  }

  let noSubtitles = createElement(
    "div",
    {
      class: "mjs__settings_element",
    },
    (btn) => {
      btn.innerText = "Отключено";
      btn.onclick = (event) => {
        for (let el1 of this._.form.settings.menu.subtitles.content.querySelectorAll(
          "*"
        ))
          el1.removeAttribute("selected");
        btn.setAttribute("selected", "true");
        setSubtitles.call(this);
      };
    }
  );
  this._.form.settings.menu.subtitles.content.appendChild(noSubtitles);
  noSubtitles.click();

  for (let el of this._.subtitles) {
    let btn = createElement(
      "div",
      {
        class: "mjs__settings_element",
        link: el.path,
      },
      (btn) => {
        btn.innerText = el.name;
        btn.onclick = (event) => {
          for (let el1 of this._.form.settings.menu.subtitles.content.querySelectorAll(
            "*"
          ))
            el1.removeAttribute("selected");
          btn.setAttribute("selected", "true");
          setSubtitles.call(this, el.path);
        };
      }
    );
    this._.form.settings.menu.subtitles.content.appendChild(btn);
  }

  for (let speed of [0.5, 1, 1.5, 2]) {
    let btn = createElement(
      "div",
      {
        class: "mjs__settings_element",
        speed: speed,
      },
      (btn) => {
        btn.innerText = speed + "x";
        btn.onclick = (event) => {
          for (let el1 of this._.form.settings.menu.playbackSpeed.content.querySelectorAll(
            "*"
          ))
            el1.removeAttribute("selected");
          btn.setAttribute("selected", "true");
          setSpeed.call(this, speed);
        };
      }
    );
    this._.form.settings.menu.playbackSpeed.content.appendChild(btn);
  }

  this._.form.settings.header.appendChild(this._.form.settings.title);
  this._.form.settings._root.appendChild(this._.form.settings.header);
  this._.form.settings._root.appendChild(this._.form.settings.body);
}
