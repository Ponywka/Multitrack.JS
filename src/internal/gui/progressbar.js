import { createElement, getPosInElement, secondsToTime } from "../utils";

export function generateProgressbar() {
    this._.form.progressbar = {
        line: createElement("div", {
            name: "progress-line",
        }),
        loaded: createElement(
            "canvas",
            {
                name: "progress-loaded",
                height: 1,
            },
            (el) => {
                el._canvas = el.getContext("2d");
            }
        ),
        played: createElement("div", {
            name: "progress-played",
        }),
        popup: createElement(
            "div",
            {
                name: "timeline-popup",
                style: "display: none",
            },
            (el) => {
                el.text = createElement("div", {
                    name: "timeline-popup-time",
                });
                el.image = createElement("div", {
                    name: "timeline-popup-image",
                });
            }
        ),
        _root: createElement(
            "div",
            {
                name: "progress-all",
            },
            (el) => {
                let updatePopup = (cursorX, position) => {
                    // Обновление всплывающего пузырька
                    this._.form.progressbar.popup.text.innerText = secondsToTime(
                        this.duration * position
                    );
                    if (this._.form.progressbar.popup.clientWidth != 0) {
                        this._.form.progressbar.popup.halfWidth =
                            this._.form.progressbar.popup.clientWidth / 2;
                    }
                    if (cursorX < this._.form.progressbar.popup.halfWidth) {
                        this._.form.progressbar.popup.setAttribute(
                            "style",
                            `left: 0px`
                        );
                    } else if (
                        cursorX <
                        el.clientWidth - this._.form.progressbar.popup.halfWidth
                    ) {
                        this._.form.progressbar.popup.setAttribute(
                            "style",
                            `left: ${
                                cursorX -
                                this._.form.progressbar.popup.halfWidth
                            }px`
                        );
                    } else {
                        this._.form.progressbar.popup.setAttribute(
                            "style",
                            `left: ${
                                el.clientWidth -
                                this._.form.progressbar.popup.halfWidth * 2
                            }px`
                        );
                    }
                    // Отображение нужного тайла на экран
                    if (this._.parameters.frames.image) {
                        var framesAll =
                            this._.parameters.frames.x *
                            this._.parameters.frames.y;
                        var frame = Math.floor(position * framesAll);
                        if (frame >= framesAll) frame = framesAll - 1;
                        var offsetX =
                            (frame % this._.parameters.frames.x) /
                            (this._.parameters.frames.x - 1);
                        var offsetY =
                            Math.floor(frame / this._.parameters.frames.x) /
                            (this._.parameters.frames.y - 1);
                        this._.form.progressbar.popup.image.setAttribute(
                            "style",
                            `
                            background-position: ${offsetX * 100}% ${
                                offsetY * 100
                            }%;
                            background-size: ${
                                this._.parameters.frames.x * 100
                            }%;
                            background-image: url(${
                                this._.parameters.frames.image
                            })`
                        );
                    } else {
                        this._.form.progressbar.popup.image.setAttribute(
                            "style",
                            "display: none"
                        );
                    }
                };

                let move = (event) => {
                    // Получение координаты и вычисление позиции (от 0 до 1)
                    var cursor = getPosInElement(el, event);
                    var position = cursor.x / el.clientWidth;
                    if (position < 0) position = 0;
                    if (position > 1) position = 1;
                    // Обновление ширины текущей позиции
                    if (this._.form.progressbar.updateStyle) {
                        this._.form.progressbar.played.setAttribute(
                            "style",
                            `width: ${100 * position}%`
                        );
                    }
                    updatePopup(cursor.x, position);
                };
                let release = (event) => {
                    this._.form.progressbar.updateStyle = false;
                    this._.form.progressbar.popup.setAttribute(
                        "style",
                        "display: none"
                    );
                    this.setTime(
                        (this.duration * getPosInElement(el, event).x) /
                            el.clientWidth
                    );
                };
                el.addEventListener("mousedown", (event) => {
                    this._.form.progressbar.updateStyle = true;
                    Object(this._.moveEvents).push({
                        move: move,
                        release: release,
                    });
                });
                el.addEventListener("touchstart", (event) => {
                    this._.form.progressbar.updateStyle = true;
                    Object(this._.moveEvents).push({
                        move: move,
                        release: release,
                    });
                });

                el.addEventListener("mousemove", (event) => {
                    var cursor = getPosInElement(el, event);
                    var position = cursor.x / el.clientWidth;
                    if (position < 0) position = 0;
                    if (position > 1) position = 1;
                    if (this._.form.progressbar.updateStyle || cursor.y > 0) {
                        updatePopup(cursor.x, position);
                    } else {
                        this._.form.progressbar.popup.setAttribute(
                            "style",
                            "display: none"
                        );
                    }
                });
                el.addEventListener("mouseout", (event) => {
                    this._.form.progressbar.popup.setAttribute(
                        "style",
                        "display: none"
                    );
                });
            }
        ),
    };
    this._.form.progressbar.popup.appendChild(
        this._.form.progressbar.popup.image
    );
    this._.form.progressbar.popup.appendChild(
        this._.form.progressbar.popup.text
    );

    this._.form.progressbar._root.appendChild(this._.form.progressbar.popup);
    this._.form.progressbar._root.appendChild(this._.form.progressbar.line);
    this._.form.progressbar._root.appendChild(this._.form.progressbar.loaded);
    this._.form.progressbar._root.appendChild(this._.form.progressbar.played);
}
