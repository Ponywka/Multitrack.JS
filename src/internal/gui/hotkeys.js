import { setVolume } from "../volume";

export function hotkeys() {
    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "Space":
                event.preventDefault();
            case "KeyK":
                this.playing ? this.pause() : this.play();
                break;
            case "ArrowLeft":
                event.preventDefault();
                this.rewind(-5);
                break;
            case "ArrowRight":
                event.preventDefault();
                this.rewind(5);
                break;
            case "KeyJ":
                this.rewind(-10);
                break;
            case "KeyL":
                this.rewind(10);
                break;
            case "KeyM":
                this.mute(false);
                break;
            case "ArrowUp":
                event.preventDefault();
                if (this._.form.audio.volume)
                    this._.form.audio.lastVolume = this._.form.audio.volume;
                setVolume.call(this, this._.form.audio.volume + 0.05);
                break;
            case "ArrowDown":
                event.preventDefault();
                if (this._.form.audio.volume)
                    this._.form.audio.lastVolume = this._.form.audio.volume;
                setVolume.call(this, this._.form.audio.volume - 0.05);
                break;
            case "KeyF":
                toggleFullscreen.call(this);
                break;
            case "Digit0":
            case "Numpad0":
                this.setTime(this.duration * 0);
                break;
            case "Digit1":
            case "Numpad1":
                this.setTime(this.duration * 0.1);
                break;
            case "Digit2":
            case "Numpad2":
                this.setTime(this.duration * 0.2);
                break;
            case "Digit3":
            case "Numpad3":
                this.setTime(this.duration * 0.3);
                break;
            case "Digit4":
            case "Numpad4":
                this.setTime(this.duration * 0.4);
                break;
            case "Digit5":
            case "Numpad5":
                this.setTime(this.duration * 0.5);
                break;
            case "Digit6":
            case "Numpad6":
                this.setTime(this.duration * 0.6);
                break;
            case "Digit7":
            case "Numpad7":
                this.setTime(this.duration * 0.7);
                break;
            case "Digit8":
            case "Numpad8":
                this.setTime(this.duration * 0.8);
                break;
            case "Digit9":
            case "Numpad9":
                this.setTime(this.duration * 0.9);
                break;
        }
    });
}
