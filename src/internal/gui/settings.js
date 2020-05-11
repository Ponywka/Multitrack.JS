import { createElement, logError } from "../utils";
import { setVideo, setAudio, setSubtitles } from "../trackSwitcher";

export function toggleSettings() {
    if (!this._.form.settings.opened) {
        this._.form.overlays._root.setAttribute("style", "display: none");
        this._.form.settings._root.removeAttribute("style");
    } else {
        this._.form.settings._root.setAttribute("style", "display: none");
        this._.form.overlays._root.removeAttribute("style");
    }
    this._.form.settings.opened = !this._.form.settings.opened;
}

export function generateSettings() {
    this._.form.settings = {
        opened: false,
        tabs: {
            quality: {
                titlename: "Качество",
                icon: "quality",
                _root: createElement("div"),
            },
            dubs: {
                titlename: "Озвучки",
                icon: "dubs",
                _root: createElement("div"),
            },
            subtitles: {
                titlename: "Субтитры",
                icon: "subtitles",
                _root: createElement("div"),
            },
            info: {
                titlename: "Информация",
                icon: "info",
                _root: createElement(
                    "div",
                    {
                        blockName: "info",
                    },
                    (el) => {
                        el.innerHTML +=
                            '<a href="https://forms.gle/gTrxarVsZoof3CyW6" target="_blank" style="color: #ffccff; font-size: 24px">Баг-репорт</a> (перед отправкой проверьте ссылку ниже, возможно этот баг уже известен!)';
                        let authorBlock = createElement(
                            "div",
                            {
                                style: "display: flex; padding: 12px 0px",
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
                                            style:
                                                "line-height: 20px; padding: 4px 8px",
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
                    }
                ),
            },
        },
        tabSwitcher: {
            _root: createElement("div", {
                name: "tabs",
            }),
        },
        title: createElement("div", {
            name: "title",
        }),
        header: createElement("div", {
            name: "settingsHeader",
        }),
        body: createElement("div", {
            name: "settingsBody",
        }),
        _root: createElement("div", {
            name: "settings",
            style: "display: none",
        }),
    };
    this._.form.settings.body.appendChild(
        this._.form.settings.tabSwitcher._root
    );
    const hideAllElements = () => {
        for (let page in this._.form.settings.tabs) {
            this._.form.settings.tabs[page]._root.setAttribute(
                "style",
                "display: none"
            );
        }
    };
    let btnNum = 0;
    for (let el in this._.form.settings.tabs) {
        this._.form.settings.body.appendChild(
            this._.form.settings.tabs[el]._root
        );
        this._.form.settings.tabSwitcher[`btn${el}`] = createElement(
            "div",
            {
                name: "listEl",
                page: el,
            },
            (btn) => {
                btn.appendChild(
                    createElement("div", {
                        name: "icon",
                        icon: this._.form.settings.tabs[el].icon,
                    })
                );
                btn.appendChild(
                    createElement("span", {}, (el1) => {
                        el1.innerText = this._.form.settings.tabs[el].titlename;
                    })
                );

                //btn.innerText += this._.form.settings.tabs[el].titlename
                btn.onclick = (event) => {
                    hideAllElements();
                    this._.form.settings.tabs[el]._root.removeAttribute(
                        "style"
                    );
                    for (let el in this._.form.settings.tabSwitcher) {
                        if (el != "_root")
                            this._.form.settings.tabSwitcher[
                                el
                            ].removeAttribute("selected");
                    }
                    btn.setAttribute("selected", "true");
                };
            }
        );
        this._.form.settings.tabSwitcher._root.appendChild(
            this._.form.settings.tabSwitcher[`btn${el}`]
        );
        if (btnNum == 0) this._.form.settings.tabSwitcher[`btn${el}`].click();
        btnNum++;
    }

    btnNum = 0;
    for (let el of this._.videos) {
        let btn = createElement(
            "div",
            {
                name: "listEl",
                link: el.path,
            },
            (btn) => {
                btn.appendChild(
                    createElement("span", {}, (el1) => {
                        el1.innerText = el.name;
                    })
                );
                btn.onclick = (event) => {
                    for (let el1 of this._.form.settings.tabs.quality._root.querySelectorAll(
                        "*"
                    ))
                        el1.removeAttribute("selected");
                    btn.setAttribute("selected", "true");
                    setVideo.call(this, el.path);
                };
            }
        );
        this._.form.settings.tabs.quality._root.appendChild(btn);
        if (btnNum == 0) btn.click();
        btnNum++;
    }

    btnNum = 0;
    for (let el of this._.audios) {
        let btn = createElement(
            "div",
            {
                name: "listEl",
                link: el.path,
            },
            (btn) => {
                btn.appendChild(
                    createElement("span", {}, (el1) => {
                        el1.innerText = el.name;
                    })
                );
                btn.onclick = (event) => {
                    for (let el1 of this._.form.settings.tabs.dubs._root.querySelectorAll(
                        "*"
                    ))
                        el1.removeAttribute("selected");
                    btn.setAttribute("selected", "true");
                    setAudio.call(this, el.path);
                };
            }
        );
        this._.form.settings.tabs.dubs._root.appendChild(btn);
        if (btnNum == 0) btn.click();
        btnNum++;
    }

    let noSubtitles = createElement(
        "div",
        {
            name: "listEl",
        },
        (btn) => {
            btn.appendChild(
                createElement("span", {}, (el1) => {
                    el1.innerText = "Отключено";
                })
            );
            btn.onclick = (event) => {
                for (let el1 of this._.form.settings.tabs.subtitles._root.querySelectorAll(
                    "*"
                ))
                    el1.removeAttribute("selected");
                btn.setAttribute("selected", "true");
                setSubtitles.call(this);
                return false;
            };
        }
    );
    this._.form.settings.tabs.subtitles._root.appendChild(noSubtitles);
    noSubtitles.click();
    for (let el of this._.subtitles) {
        this._.form.settings.tabs.subtitles._root.appendChild(
            createElement(
                "div",
                {
                    name: "listEl",
                    link: el.path,
                },
                (btn) => {
                    btn.appendChild(
                        createElement("span", {}, (el1) => {
                            el1.innerText = el.name;
                        })
                    );
                    btn.onclick = (event) => {
                        try {
                            for (let el1 of this._.form.settings.tabs.subtitles._root.querySelectorAll(
                                "*"
                            ))
                                el1.removeAttribute("selected");
                            btn.setAttribute("selected", "true");
                            setSubtitles.call(this, el.path);
                        } catch (e) {
                            logError.call(this, "Can'y download subtitles");
                        }
                    };
                }
            )
        );
    }

    this._.form.settings.title.innerText += "Настройки";
    this._.form.settings.header.appendChild(this._.form.settings.title);
    this._.form.settings.header.appendChild(this._.form.buttons.closemenu);

    this._.form.settings._root.appendChild(this._.form.settings.header);
    this._.form.settings._root.appendChild(this._.form.settings.body);
}
