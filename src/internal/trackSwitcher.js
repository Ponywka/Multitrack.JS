import { logError } from './utils';

// Надо ждать, пока загрузится страница, а иначе - ошибка
let ASS;
document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  ASS = require('assjs').default;
});

export function setVideo(link) {
  const { currentTime } = this;
  const { playbackRate } = this;
  this._.form.video.mjs_pause();
  this._.form.video.src = link;
  this._.form.video.mjs_setTime(currentTime);
  this._.form.video.mjs_setRate(playbackRate);
  if (this._.playing) this._.form.video.mjs_play();
}

export function setAudio(link) {
  const { currentTime } = this;
  const { playbackRate } = this;
  this._.form.audio.mjs_pause();
  this._.form.audio.src = link;
  this._.form.audio.mjs_setTime(currentTime);
  this._.form.audio.mjs_setRate(playbackRate);
  if (this._.playing) this._.form.audio.mjs_play();
}

export function setSubtitles(url) {
  clearTimeout(this._.subtitlesDownloader);
  if (this._.ass !== undefined) {
    this._.ass.destroy();
    this._.ass = undefined;
  }
  if (url) {
    this._.subtitlesDownloader = setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send();
      if (xhr.status === 200) {
        try {
          this._.ass = new ASS(xhr.responseText, this._.form.video, {
            container: this._.form.subtitles,
          });
          this.resize();
        } catch (e) {
          logError.call(this, "Can't use ASS library");
        }
      }
    });
  }
}
