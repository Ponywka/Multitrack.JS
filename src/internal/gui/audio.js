import { createElement, secondsToTime } from "../utils";
import { changePlaying, changeIsWaitingAudio } from "../playback";

export function generateAudio() {
    this._.form.audio = createElement("audio", {}, (el) => {
        // Обработка событий плей/пауза
        el._onplaying = () => {
            changePlaying.call(this, true);
        };
        el.onplaying = el._onplaying;
        el._onpause = () => {
            changePlaying.call(this, false);
        };
        el.onpause = el._onpause;
        // Обработка событий загрузки
        el.onwaiting = () => {
            changeIsWaitingAudio.call(this, true);
        };
        el.oncanplay = () => {
            changeIsWaitingAudio.call(this, false);
        };
        // Остальные обработчики событий
        el.ontimeupdate = () => {
            this.currentTime = el.currentTime;
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
