import { gui } from "./gui.js";
import { logError } from "./utils.js";

export function init(selector, dataArray) {
    this._ = {
        name: "Multitrack.JS",
        parameters: {
            frames: {
                x: 10,
                y: 10,
            },
        },
        subtitlesDownloader: null,
        videos: dataArray.videos,
        audios: dataArray.audios,
        subtitles: dataArray.subtitles,
    };
    this.playing = false;

    if ((this._.element = document.querySelector(selector))) {
        this._.element.setAttribute("application-name", "multitrack-js");
        gui.call(this);

        if (dataArray.placeholder)
            this._.form.video.poster = dataArray.placeholder;
        if (dataArray.preview)
            this._.parameters.frames.image = dataArray.preview;
        this._.form.title.innerText = dataArray.title;
        // Полузаметная синхронизация дорожек
        // ТРЕБУЕТСЯ ПЕРЕПИСАТЬ
        let video = this._.form.video;
        let audio = this._.form.audio;

        function _invisibleSync() {
            let diff = audio.currentTime - video.currentTime;
            let mdiff = Math.abs(diff);
            if (this.playing && mdiff > 1 / 60) {
                if (mdiff < 3) {
                    var scale = mdiff + 1;
                    if (diff > 0) {
                        this._.form.video.playbackRate = scale;
                        setTimeout(() => {
                            this._.form.video.playbackRate = 1;
                            _invisibleSync.call(this);
                        }, 1000);
                    } else {
                        this._.form.video.playbackRate = 1 / scale;
                        setTimeout(() => {
                            this._.form.video.playbackRate = 1;
                            _invisibleSync.call(this);
                        }, scale * 1000);
                    }
                } else {
                    this._.form.video.currentTime = this._.form.audio.currentTime;
                    _invisibleSync.call(this);
                }
            } else {
                setTimeout(() => {
                    _invisibleSync.call(this);
                }, 1000);
            }
        }
        _invisibleSync.call(this);
    } else logError.call(this, `Can not find "${selector}" element!`);
}
