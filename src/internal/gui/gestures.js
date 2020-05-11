import { toggleSettings } from "../gui/settings";
import { toggleFullscreen } from "../gui/buttons";

export function gestures() {
    this._.moveEvents = [];
    document.addEventListener("mousemove", (event) => {
        for (let func of this._.moveEvents) {
            func.move(event);
        }
    });
    document.addEventListener("mouseup", (event) => {
        for (let func of this._.moveEvents) {
            func.release(event);
        }
        this._.moveEvents = [];
    });
    document.addEventListener(
        "touchmove",
        (event) => {
            for (let func of this._.moveEvents) {
                func.move(event.touches[0]);
            }
        },
        false
    );
    document.addEventListener(
        "touchend",
        (event) => {
            for (let func of this._.moveEvents) {
                func.release(event.changedTouches[0]);
            }
            this._.moveEvents = [];
        },
        false
    );
    this._.form.overlays._root.addEventListener(
        "dblclick",
        (event) => {
            if (event.target === event.currentTarget) {
                toggleFullscreen.call(this);
            }
        },
        false
    );
    this._.element.addEventListener(
        "contextmenu",
        (event) => {
            event.preventDefault();
            toggleSettings.call(this);
            return false;
        },
        false
    );
}
