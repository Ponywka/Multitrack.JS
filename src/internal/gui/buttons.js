import { createElement, logError } from "../utils";
import { toggleSettings } from "../gui/settings";

export function toggleFullscreen() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        this._.form.buttons.fullscreen.setAttribute("name", "fullscreenOn");
    } else {
        var element = this._.element;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        this._.form.buttons.fullscreen.setAttribute("name", "fullscreenOff");
    }
}

export function generateButtons() {
    this._.form.buttons = {
        // Плей/пауза
        play: createElement(
            "button",
            {
                name: "playBtn",
            },
            (el) => {
                el.onclick = () => {
                    this.playing ? this.pause() : this.play();
                };
            }
        ),
        // Отмотать на 10 секунд
        backward10: createElement(
            "button",
            {
                name: "backward10",
            },
            (el) => {
                el.onclick = () => {
                    this.rewind(-10);
                };
            }
        ),
        // Перемотать на 10 секунд
        forward10: createElement(
            "button",
            {
                name: "forward10",
            },
            (el) => {
                el.onclick = () => {
                    this.rewind(10);
                };
            }
        ),
        // Кнопка полного экрана
        fullscreen: createElement(
            "button",
            {
                name: "fullscreenOn",
            },
            (el) => {
                el.onclick = (btn) => {
                    toggleFullscreen.call(this);
                };
            }
        ),
        // Кнопка режима "Картинка-в-картинке"
        pip: createElement(
            "button",
            {
                name: "pipOn",
            },
            (el) => {
                el.onclick = (btn) => {
                    if ("pictureInPictureEnabled" in document) {
                        if (
                            this._.form.video !==
                            document.pictureInPictureElement
                        ) {
                            this._.form.video.requestPictureInPicture();
                            el.setAttribute("name", "pipOff");
                        } else {
                            document.exitPictureInPicture();
                            el.setAttribute("name", "pipOn");
                        }
                    } else {
                        logError.call(
                            this,
                            "Sorry, your browser is not support picture-in-picture"
                        );
                    }
                };
            }
        ),
        // Открыть меню
        openmenu: createElement(
            "button",
            {
                name: "openmenu",
            },
            (el) => {
                el.addEventListener("click", () => {
                    toggleSettings.call(this);
                });
            }
        ),
        closemenu: createElement(
            "button",
            {
                name: "closemenu",
            },
            (el) => {
                el.addEventListener("click", () => {
                    toggleSettings.call(this);
                });
            }
        ),
    };
}
