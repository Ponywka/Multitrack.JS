import { createElement } from "./utils";
import { hotkeys } from "./gui/hotkeys";
import { gestures } from "./gui/gestures";
import { windowFocus } from "./gui/windowFocus";
import { generateVideo } from "./gui/video";
import { generateAudio } from "./gui/audio";
import { generateVolume } from "./gui/volume";
import { generateSettings } from "./gui/settings";
import { generateProgressbar } from "./gui/progressbar";
import { generateButtons } from "./gui/buttons";
import { generateOverlay } from "./gui/overlay";

export function gui() {
    this._.form = {};
    // Генерация элементов GUI
    generateVideo.call(this);
    generateAudio.call(this);

    this._.form.subtitles = createElement("div", {
        id: "subtitles",
    });
    this._.form.time = createElement(
        "div",
        {
            name: "time",
        },
        (el) => {
            el.innerText = "--:-- / --:--";
        }
    );
    this._.form.title = createElement("div", {
        name: "title",
    });

    // Кнопки (массив)
    generateButtons.call(this);
    generateProgressbar.call(this);
    generateVolume.call(this);
    generateSettings.call(this);
    generateOverlay.call(this);

    this._.element.appendChild(this._.form.video);
    this._.element.appendChild(this._.form.audio);
    this._.element.appendChild(this._.form.subtitles);
    this._.element.appendChild(this._.form.overlays._root);
    this._.element.appendChild(this._.form.settings._root);

    gestures.call(this);
    hotkeys.call(this);
    windowFocus.call(this);
}
