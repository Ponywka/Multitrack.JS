import { createElement, secondsToTime } from "../utils";
import {
  changeIsWaitingVideo,
  changePlaying,
  setTime,
  setSpeed, synchronize, downloadStatusUpdate,
} from "../playback";

export function generateVideo() {
  this._.form.video = createElement("video", { playsinline: "", preload: "metadata" }, (el) => {
    // Обработка событий плей/пауза
    el._onplaying = () => {
      changePlaying.call(this, true);
    };
    el.onplaying = el._onplaying;

    el.mjs_play = () => {
      el.onplaying = null;
      el.play().then(() => {
        el.onplaying = el._onplaying;
      }).catch(err => {
        // TODO: Заменить костыль с Catch на что-то другое, более нормальное
        // Тут тип "фикс" ошибки "Unhandled Promise Rejection: AbortError: The operation was aborted." на устройства iOS
        el.onplaying = el._onplaying;
        changePlaying.call(this, false);
      });
    };

    el._onpause = () => {
      if (el === document.pictureInPictureElement || document.hasFocus()) {
        changePlaying.call(this, false);
      }
    };
    el.onpause = el._onpause;
    el.mjs_pause = () => {
      el.onpause = null;
      el.pause();
      setTimeout(() => {
        el.onpause = el._onpause;
      }, 16);
    };

    el._onseeking = (event) => {
      setTime.call(this, event.target.currentTime, true);
    };
    el.onseeking = el._onseeking;
    el.mjs_setTime = (val) => {
      el.onseeking = null;
      el.currentTime = val;
      el.onseeking = el._onseeking;
    };

    el._onratechange = () => {
      setSpeed.call(this, el.playbackRate);
    };
    el.onratechange = el._onratechange;
    el.mjs_setRate = (val) => {
      el.onratechange = null;
      el.playbackRate = val;
      setTimeout(() => {
        el.onratechange = el._onratechange;
      }, 16);
    };

    // Обработка событий загрузки
    el.onwaiting = () => {
      downloadStatusUpdate.call(this);
    };
    el.oncanplay = () => {
      downloadStatusUpdate.call(this);
    };

    el.onprogress = () => {
      var element = this._.form.progressbar.loaded;
      var canvas = this._.form.progressbar.loaded._canvas;
      element.width = element.clientWidth;
      canvas.fillStyle = "white";
      canvas.clearRect(0, 0, element.width, 1);
      for (let i = 0; i < el.buffered.length; i++) {
        var startX = (el.buffered.start(i) * element.width) / this.duration;
        var endX = (el.buffered.end(i) * element.width) / this.duration;
        var width = endX - startX;
        canvas.fillRect(Math.floor(startX), 0, Math.floor(width), 1);
      }
    };
  });
}
