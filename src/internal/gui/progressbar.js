import { createElement, getPosInElement, secondsToTime } from '../utils';

export function generateProgressbar() {
  this._.form.progressbar = {
    line: createElement('div', {
      class: 'mjs__overlay-progressBar-background',
    }),
    loaded: createElement(
      'canvas',
      {
        class: 'mjs__overlay-progressBar-loaded',
        height: 1,
      },
      (el) => {
        el._canvas = el.getContext('2d');
      },
    ),
    played: createElement('div', {
      class: 'mjs__overlay-progressBar-played',
    }),
    popup: createElement(
      'div',
      {
        class: 'mjs__overlay-progressPopup',
      },
      (el) => {
        el.text = createElement('div', {
          class: 'mjs__overlay-progressPopup-time',
        });
        el.image = createElement('div', {
          class: 'mjs__overlay-progressPopup-image',
        });
      },
    ),
    _root: createElement(
      'div',
      {
        class: 'mjs__overlay-progressBar',
      },
      (el) => {
        const updatePopup = (cursorX, position) => {
          // Обновление всплывающего пузырька
          this._.form.progressbar.popup.text.innerText = secondsToTime(
            this.duration * position,
          );
          this._.form.progressbar.popup.classList.add(
            'mjs__overlay-progressPopup-show',
          );
          if (this._.form.progressbar.popup.clientWidth !== 0) {
            this._.form.progressbar.popup.halfWidth = this._.form.progressbar.popup.clientWidth / 2;
          }
          if (cursorX < this._.form.progressbar.popup.halfWidth) {
            this._.form.progressbar.popup.setAttribute('style', 'left: 0px');
          } else if (
            cursorX
            < el.clientWidth - this._.form.progressbar.popup.halfWidth
          ) {
            this._.form.progressbar.popup.setAttribute(
              'style',
              `left: ${cursorX - this._.form.progressbar.popup.halfWidth}px`,
            );
          } else {
            this._.form.progressbar.popup.setAttribute(
              'style',
              `left: ${
                el.clientWidth - this._.form.progressbar.popup.halfWidth * 2
              }px`,
            );
          }
          // Отображение нужного тайла на экран
          if (this._.parameters.frames.image) {
            const framesAll = this._.parameters.frames.x * this._.parameters.frames.y;
            let frame = Math.floor(position * framesAll);
            if (frame >= framesAll) frame = framesAll - 1;
            const offsetX = (frame % this._.parameters.frames.x)
              / (this._.parameters.frames.x - 1);
            const offsetY = Math.floor(frame / this._.parameters.frames.x)
              / (this._.parameters.frames.y - 1);
            this._.form.progressbar.popup.image.setAttribute('style', `
              background-position: ${offsetX * 100}% ${offsetY * 100}%;
              background-size: ${this._.parameters.frames.x * 100}%;
              background-image: url(${this._.parameters.frames.image})`);
          } else {
            this._.form.progressbar.popup.image.setAttribute(
              'style',
              'display: none',
            );
          }
        };

        const move = (event) => {
          // Получение координаты и вычисление позиции (от 0 до 1)
          const cursor = getPosInElement(el, event);
          let position = cursor.x / el.clientWidth;
          if (position < 0) position = 0;
          if (position > 1) position = 1;
          // Обновление ширины текущей позиции
          if (this._.form.progressbar.updateStyle) {
            this._.form.progressbar.played.setAttribute(
              'style',
              `width: ${100 * position}%`,
            );
          }
          updatePopup(cursor.x, position);
        };
        const release = (event) => {
          this._.form.progressbar.updateStyle = false;
          this._.form.progressbar.popup.classList.remove(
            'mjs__overlay-progressPopup-show',
          );
          this.currentTime = (this.duration * getPosInElement(el, event).x) / el.clientWidth;
        };
        el.addEventListener('mousedown', () => {
          this._.form.progressbar.updateStyle = true;
          Object(this._.moveEvents).push({
            move,
            release,
          });
        });
        el.addEventListener('touchstart', () => {
          this._.form.progressbar.updateStyle = true;
          Object(this._.moveEvents).push({
            move,
            release,
          });
        });

        el.addEventListener('mousemove', (event) => {
          const cursor = getPosInElement(el, event);
          let position = cursor.x / el.clientWidth;
          if (position < 0) position = 0;
          if (position > 1) position = 1;
          if (this._.form.progressbar.updateStyle || cursor.y > 0) {
            updatePopup(cursor.x, position);
          } else {
            this._.form.progressbar.popup.classList.remove(
              'mjs__overlay-progressPopup-show',
            );
          }
        });
        el.addEventListener('mouseout', () => {
          this._.form.progressbar.popup.classList.remove(
            'mjs__overlay-progressPopup-show',
          );
        });
      },
    ),
  };
  this._.form.progressbar.popup.appendChild(
    this._.form.progressbar.popup.image,
  );
  this._.form.progressbar.popup.appendChild(this._.form.progressbar.popup.text);

  this._.form.progressbar._root.appendChild(this._.form.progressbar.popup);
  this._.form.progressbar._root.appendChild(this._.form.progressbar.line);
  this._.form.progressbar._root.appendChild(this._.form.progressbar.loaded);
  this._.form.progressbar._root.appendChild(this._.form.progressbar.played);
}
