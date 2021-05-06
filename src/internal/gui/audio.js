import { createElement, secondsToTime } from "../utils";
import { changePlaying, downloadStatusUpdate, synchronize } from "../playback";

export function generateAudio() {
  this._.form.audio = createElement("audio", {}, (el) => {
    // Обработка событий плей/пауза
    el._onplaying = () => {
      changePlaying.call(this, true);
    };
    el.onplaying = el._onplaying;
    el.mjs_play = () => {
      el.onplaying = null;
      el.play().then(() => {
        el.onplaying = el._onplaying;
      });
    };

    el._onpause = () => {
      changePlaying.call(this, false);
    };
    el.onpause = el._onpause;
    el.mjs_pause = () => {
      el.onpause = null;
      el.pause();
      setTimeout(() => {
        el.onpause = el._onpause;
      }, 16);
    };

    // Обработка событий загрузки
    el.onwaiting = () => {
      downloadStatusUpdate.call(this);
    };
    el.oncanplay = () => {
      downloadStatusUpdate.call(this);
    };

    // Остальные обработчики событий
    el.onloadedmetadata = () => {
      this._.form.time.innerText = `${secondsToTime(
        el.currentTime
      )} / ${secondsToTime(this.duration)}`;
    };
    el.ontimeupdate = () => {
      if (!this._.form.progressbar.updateStyle)
        this._.form.progressbar.played.setAttribute(
          "style",
          `width: ${(100 * el.currentTime) / this.duration}%`
        );
      this._.form.time.innerText = `${secondsToTime.call(
        this,
        el.currentTime
      )} / ${secondsToTime.call(this, this.duration)}`;
    };
  });
}
