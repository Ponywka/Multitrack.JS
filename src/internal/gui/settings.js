/* eslint-disable max-classes-per-file */
import { createElement } from '../utils';
import { setVideo, setAudio, setSubtitles } from '../trackSwitcher';
import { setSpeed } from '../playback';

class SettingsButtons {
  constructor(name = null) {
    this.Name = name;
    this.Buttons = [];
    this.Content = createElement('div');
  }

  appendButton(name, action) {
    const btn = createElement('div', { class: 'mjs__settings_element' });
    btn.innerText = name;
    btn.onclick = () => {
      action();
    };
    this.Buttons.push(btn);
    this.Content.appendChild(btn);
  }
}

class SettingsRadioButtons {
  constructor(name = null) {
    this.Name = name;
    this.Buttons = [];
    this.Content = createElement('div');
  }

  appendButton(name, action) {
    // parameters : link: el.path,
    const btn = createElement('div', { class: 'mjs__settings_element' });
    btn.innerText = name;
    btn.onclick = () => {
      this.Buttons.forEach((el) => el.removeAttribute('selected'));
      btn.setAttribute('selected', 'true');
      action();
    };
    this.Buttons.push(btn);
    this.Content.appendChild(btn);
  }
}

class SettingsPage {
  constructor(name) {
    this.Name = name;
    this.Content = createElement('div');
  }
}

function resetMenu() {
  this._.form.settings.title.innerText = 'Настройки';
  this._.form.settings.header.setAttribute('showIcon', null);
  Object.keys(this._.form.settings.menu).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(this._.form.settings.menu, key)) return;

    const menu = this._.form.settings.menu[key];
    menu.Content.setAttribute('style', 'display: none');
  });
  this._.form.settings.menuSwitcher.Content.removeAttribute('style');
}

export function toggleSettings() {
  if (!this._.form.settings.opened) {
    resetMenu.call(this);
    this._.rootElement.classList.add('mjs__settings_show');
  } else {
    this._.rootElement.classList.remove('mjs__settings_show');
  }
  this._.form.settings.opened = !this._.form.settings.opened;
}

export function generateSettings() {
  this._.form.settings = {};
  this._.form.settings.opened = false;

  this._.form.settings.menu = {};

  this._.form.settings.menu.quality = new SettingsRadioButtons('Качество');
  this._.form.settings.menu.dubs = new SettingsRadioButtons('Озвучки');
  this._.form.settings.menu.subtitles = new SettingsRadioButtons('Субтитры');
  this._.form.settings.menu.playbackRate = new SettingsRadioButtons(
    'Скорость воспроизведения',
  );
  this._.form.settings.menu.info = new SettingsPage('Информация о плеере');
  this._.form.settings.menu.info.Content = createElement(
    'div',
    { blockName: 'info' },
    (el) => {
      const authorBlock = createElement(
        'div',
        { style: 'display: flex; padding-bottom: 12px' },
        (bl) => {
          const imageBlock = createElement('img', {
            src: 'https://avatars2.githubusercontent.com/u/26777464?s=96',
            width: 48,
            height: 48,
          });
          bl.appendChild(imageBlock);

          const infoBlock = createElement(
            'div',
            { style: 'line-height: 20px; padding: 4px 8px' },
            (inf) => {
              inf.innerHTML
                += 'Исходный код плеера:<br><a href="https://github.com/Ponywka/Multitrack.JS" style="color: #ffccff">Ponywka/Multitrack.JS</a>';
            },
          );
          bl.appendChild(infoBlock);
        },
      );
      el.appendChild(authorBlock);

      // eslint-disable-next-line no-undef
      el.innerHTML += `Build date: ${new Date(__TIMESTAMP__).toString()}`;
    },
  );

  this._.form.settings.title = createElement('div', {
    style: 'mjs__settingsHeader-title',
  });
  this._.form.settings.header = createElement(
    'div',
    { class: 'mjs__settingsHeader' },
    (el) => {
      el.addEventListener('click', () => {
        resetMenu.call(this);
      });
    },
  );

  this._.form.settings.menuSwitcher = new SettingsButtons();
  this._.form.settings._root = createElement('div', { class: 'mjs__settings' });

  // Append content
  this._.videos.forEach((video) => {
    this._.form.settings.menu.quality.appendButton(video.name, () => {
      setVideo.call(this, video.path);
    });
  });
  this._.form.settings.menu.quality.Buttons[0].click();

  this._.audios.forEach((audio) => {
    this._.form.settings.menu.dubs.appendButton(audio.name, () => {
      setAudio.call(this, audio.path);
    });
  });
  this._.form.settings.menu.dubs.Buttons[0].click();

  this._.form.settings.menu.subtitles.appendButton('Без субтитров', () => {
    setSubtitles.call(this);
  });
  this._.form.settings.menu.subtitles.Buttons[0].click();

  this._.subtitles.forEach((subtitle) => {
    this._.form.settings.menu.subtitles.appendButton(subtitle.name, () => {
      setSubtitles.call(this, subtitle.path);
    });
  });

  [0.5, 1, 1.5, 2].forEach((speed) => {
    this._.form.settings.menu.playbackRate.appendButton(`${speed}x`, () => {
      setSpeed.call(this, speed);
    });
  });
  this._.form.settings.menu.playbackRate.Buttons[1].click();

  Object.keys(this._.form.settings.menu).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(this._.form.settings.menu, key)) return;

    const menu = this._.form.settings.menu[key];
    this._.form.settings.menuSwitcher.appendButton(menu.Name, () => {
      resetMenu.call(this);
      this._.form.settings.header.setAttribute('showIcon', 'true');
      this._.form.settings.title.innerText = menu.Name;
      menu.Content.removeAttribute('style');
      this._.form.settings.menuSwitcher.Content.setAttribute(
        'style',
        'display: none;',
      );
    });
  });

  // AppendMenus
  this._.form.settings.body = createElement('div', {
    class: 'mjs__settingsBody',
  });
  this._.form.settings.body.appendChild(
    this._.form.settings.menuSwitcher.Content,
  );
  Object.keys(this._.form.settings.menu).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(this._.form.settings.menu, key)) return;

    const menu = this._.form.settings.menu[key];
    this._.form.settings.body.appendChild(menu.Content);
  });
  resetMenu.call(this);

  this._.form.settings.header.appendChild(this._.form.settings.title);
  this._.form.settings._root.appendChild(this._.form.settings.header);
  this._.form.settings._root.appendChild(this._.form.settings.body);
}
