import {
    servicePlayingVideo,
    servicePlayingAudio,
    changeIsWaitingVideo,
    changeIsWaitingAudio,
} from "./playback";

import { logError } from "./utils";

// Надо ждать, пока загрузится страница, а иначе - ошибка
let ASS;
document.addEventListener("DOMContentLoaded", function () {
    ASS = require("assjs").default;
});

export function setVideo(link) {
    servicePlayingVideo.call(this, false);
    changeIsWaitingVideo.call(this, true);
    this._.form.video.src = link;
    this._.form.video.currentTime = this._.form.audio.currentTime;
    if (this.playing) servicePlayingVideo.call(this, true);
}

export function setAudio(link) {
    let time = this._.form.audio.currentTime;
    servicePlayingAudio.call(this, false);
    changeIsWaitingAudio.call(this, true);
    this._.form.audio.src = link;
    this._.form.audio.currentTime = time;
    if (this.playing) servicePlayingAudio.call(this, true);
}

export function setSubtitles(url) {
    clearTimeout(this._.subtitlesDownloader);
    if (this._.ass !== undefined) {
        this._.ass.destroy();
        this._.ass = undefined;
    }
    if (url) {
        this._.subtitlesDownloader = setTimeout(() => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send();
            if (xhr.status == 200) {
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
