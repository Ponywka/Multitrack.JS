import { toggleSettings } from './settings';
import { toggleFullscreen } from './buttons';

export function gestures() {
  this._.moveEvents = [];
  document.addEventListener('mousemove', (event) => {
    this._.moveEvents.forEach((func) => {
      func.move(event);
    });
  });
  document.addEventListener('mouseup', (event) => {
    this._.moveEvents.forEach((func) => {
      func.release(event);
    });
    this._.moveEvents = [];
  });
  document.addEventListener(
    'touchmove',
    (event) => {
      this._.moveEvents.forEach((func) => {
        func.move(event.touches[0]);
      });
    },
    false,
  );
  document.addEventListener(
    'touchend',
    (event) => {
      this._.moveEvents.forEach((func) => {
        func.release(event.changedTouches[0]);
      });
      this._.moveEvents = [];
    },
    false,
  );
  this._.form.overlays._root.addEventListener(
    'dblclick',
    (event) => {
      if (event.target === this._.form.overlays._root) {
        toggleFullscreen.call(this);
      }
    },
    false,
  );
  this._.element.addEventListener(
    'contextmenu',
    (event) => {
      event.preventDefault();
      toggleSettings.call(this);
      return false;
    },
    false,
  );
}
