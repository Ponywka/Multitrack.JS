import { createElement, getPosInElement } from '../utils';
import { mute } from '../volume';

export function generateVolume() {
  this._.form.buttons.volume = createElement(
    'button',
    {
      class: 'mjs__overlay-button',
      icon: 'volume',
      iconVar: 3,
    },
    (el) => {
      el.addEventListener('click', () => {
        mute.call(this, true);
      });
    },
  );
  this._.form.volumebar = {
    line: createElement('div', {
      class: 'mjs__overlay-volumeBar-background',
    }),
    selected: createElement('div', {
      class: 'mjs__overlay-volumeBar-selected',
    }),
    _root: createElement(
      'div',
      {
        class: 'mjs__overlay-volumeBar',
      },
      (el) => {
        const release = (event) => {
          this._.form.volumebar.updateStyle = false;
          // Получение координаты и вычисление позиции (от 0 до 1)
          const cursorX = getPosInElement(el, event).x;
          const position = cursorX / el.clientWidth;
          this.volume = position;
        };
        const move = (event) => {
          if (this._.form.volumebar.updateStyle) {
            // Получение координаты и вычисление позиции (от 0 до 1)
            const cursorX = getPosInElement(el, event).x;
            const position = cursorX / el.clientWidth;
            this.volume = position;
          }
        };
        el.addEventListener('mousedown', () => {
          this._.form.volumebar.updateStyle = true;
          this._.form.audio.lastVolume = this._.form.audio.volume;
          this._.moveEvents.push({
            move,
            release,
          });
        });
        el.addEventListener('touchstart', () => {
          this._.form.volumebar.updateStyle = true;
          this._.form.audio.lastVolume = this._.form.audio.volume;
          this._.moveEvents.push({
            move,
            release,
          });
        });
      },
    ),
  };
  this._.form.volumebar._root.appendChild(this._.form.volumebar.line);
  this._.form.volumebar._root.appendChild(this._.form.volumebar.selected);
}
