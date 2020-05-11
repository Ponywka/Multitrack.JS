import { changePlaying } from "../playback";

export function windowFocus() {
    this._.pageFocused = true;
    window.addEventListener("focus", () => {
        this._.pageFocused = true;
        if (this.playing) changePlaying.call(this, true);
    });
    window.addEventListener("blur", () => {
        this._.pageFocused = false;
    });
}
