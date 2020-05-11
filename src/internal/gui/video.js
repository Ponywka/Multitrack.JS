import { createElement, secondsToTime } from "../utils";
import { changeIsWaitingVideo, changePlaying } from "../playback";

export function generateVideo() {
    this._.form.video = createElement("video", {}, (el) => {
        // Обработка событий плей/пауза
        el._onplaying = () => {
            changePlaying.call(this, true);
        };
        el.onplaying = el._onplaying;
        el._onpause = (event) => {
            if (el === document.pictureInPictureElement || this._.pageFocused) {
                changePlaying.call(this, false);
            }
        };
        el.onpause = el._onpause;
        // Обработка событий загрузки
        el.onwaiting = () => {
            changeIsWaitingVideo.call(this, true);
        };
        el.oncanplay = () => {
            changeIsWaitingVideo.call(this, false);
        };
        el.onloadedmetadata = () => {
            this.duration = el.duration;
            this._.form.time.innerText = `${secondsToTime(
                this._.form.audio.currentTime
            )} / ${secondsToTime(this.duration)}`;
        };
        el.onprogress = () => {
            var element = this._.form.progressbar.loaded;
            var canvas = this._.form.progressbar.loaded._canvas;
            element.width = element.clientWidth;
            canvas.fillStyle = "white";
            canvas.clearRect(0, 0, element.width, 1);
            for (let i = 0; i < el.buffered.length; i++) {
                var startX =
                    (el.buffered.start(i) * element.width) / this.duration;
                var endX = (el.buffered.end(i) * element.width) / this.duration;
                var width = endX - startX;
                canvas.fillRect(Math.floor(startX), 0, Math.floor(width), 1);
            }
        };
    });
}
