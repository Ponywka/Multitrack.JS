import { createElement } from './utils';
import { hotkeys } from './gui/hotkeys';
import { gestures } from './gui/gestures';
import { generateMedia } from './gui/media';
import { generateVolume } from './gui/volume';
import { generateSettings } from './gui/settings';
import { generateProgressbar } from './gui/progressbar';
import { generateButtons } from './gui/buttons';
import { generateOverlay } from './gui/overlay';

export function gui() {
  this._.rootElement.classList.add('mjs');
  this._.element = createElement('div', { class: 'mjs__root' });

  this._.form = {};
  // Генерация элементов GUI
  generateMedia.call(this);

  this._.form.subtitles = createElement('div', { class: 'mjs__subtitles' });
  this._.form.time = createElement('div', { class: 'mjs__overlay-time' });
  this._.form.time.innerText = '--:-- / --:--';
  this._.form.title = createElement('div', { class: 'mjs__overlay-title' });

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

  this._.rootElement.appendChild(this._.element);
}
