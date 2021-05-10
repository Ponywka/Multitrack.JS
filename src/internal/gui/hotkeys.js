import { setVolume, mute } from "../volume";
import { toggleFullscreen } from "../gui/buttons";
import { seek } from "../playback";

export function hotkeys() {
  document.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "Space":
        event.preventDefault();
      case "KeyK":
        this._.playing ? this.pause() : this.play();
        break;
      case "ArrowLeft":
        event.preventDefault();
        seek.call(this, -5);
        break;
      case "ArrowRight":
        event.preventDefault();
        seek.call(this, 5);
        break;
      case "KeyJ":
        seek.call(this, -10);
        break;
      case "KeyL":
        seek.call(this, 10);
        break;
      case "KeyM":
        mute.call(this, true);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.volume += 0.05;
        break;
      case "ArrowDown":
        event.preventDefault();
        this.volume -= 0.05;
        break;
      case "KeyF":
        toggleFullscreen.call(this);
        break;
      case "Digit0":
      case "Numpad0":
        this.currentTime = this.duration * 0;
        break;
      case "Digit1":
      case "Numpad1":
        this.currentTime = this.duration * 0.1;
        break;
      case "Digit2":
      case "Numpad2":
        this.currentTime = this.duration * 0.2;
        break;
      case "Digit3":
      case "Numpad3":
        this.currentTime = this.duration * 0.3;
        break;
      case "Digit4":
      case "Numpad4":
        this.currentTime = this.duration * 0.4;
        break;
      case "Digit5":
      case "Numpad5":
        this.currentTime = this.duration * 0.5;
        break;
      case "Digit6":
      case "Numpad6":
        this.currentTime = this.duration * 0.6;
        break;
      case "Digit7":
      case "Numpad7":
        this.currentTime = this.duration * 0.7;
        break;
      case "Digit8":
      case "Numpad8":
        this.currentTime = this.duration * 0.8;
        break;
      case "Digit9":
      case "Numpad9":
        this.currentTime = this.duration * 0.9;
        break;
      case "Comma":
        if(!this._.playing) seek.call(this, -(1 / 24));
        break;
      case "Period":
        if(!this._.playing) seek.call(this, (1 / 24));
        break;
      default:
        if (process.env.NODE_ENV !== "production")
          console.log(`Key pressed: ${event.code}`);
        break;
    }
  });
}
