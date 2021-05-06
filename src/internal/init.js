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
    playbackRate: 1,
    enable_sync: false,
  };
  this._.playing = false;

  if ((this._.rootElement = document.querySelector(selector))) {
    gui.call(this);

    if (dataArray.placeholder) this._.form.video.poster = dataArray.placeholder;
    if (dataArray.preview) this._.parameters.frames.image = dataArray.preview;
    this._.form.title.innerText = dataArray.title;
    this.trySync = true;

    window.addEventListener("resize", () => {
      this.resize();
    });
  } else logError.call(this, `Can not find "${selector}" element!`);
}
