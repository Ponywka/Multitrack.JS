export function synchronize(target = null) {
  if (process.env.NODE_ENV !== "production") console.log("Sync: Call");
  const root = target ? target : this;
  return new Promise((resolve) => {
    const video = root._.form.video;
    const audio = root._.form.audio;
    const playbackRate = root.playbackRate;
    const diff = video.currentTime - audio.currentTime;

    audio.playbackRate = playbackRate;
    video.mjs_setRate(playbackRate);
    if (video.syncTimeout) clearTimeout(video.syncTimeout);
    video.syncTimeout = null;

    if (root._.playing && Math.abs(diff) > 1 / 60) {
      if (process.env.NODE_ENV !== "production")
        console.log("Sync: Need to sync");
      let scale = playbackRate - diff;
      if (0.25 <= scale && scale <= 4) {
        if (document.hasFocus()) {
          if (process.env.NODE_ENV !== "production")
            console.log(`Sync: Rate changed to ${scale}`);
          video.mjs_setRate(scale);
          video.syncTimeout = setTimeout(() => {
            if (process.env.NODE_ENV !== "production")
              console.log("Sync: Rate changed back");
            video.mjs_setRate(playbackRate);
            video.syncTimeout = null;
          }, 1000);
          setTimeout(() => {
            resolve();
          }, 1050);
        } else {
          resolve();
        }
      } else {
        if (process.env.NODE_ENV !== "production")
          console.log(`Sync: Seeked to ${audio.currentTime}`);
        video.mjs_setTime(audio.currentTime);
        resolve();
      }
    } else {
      resolve();
    }
  });
}

export function downloadStatusUpdate() {
  const allowedStates = [3, 4];
  const video = this._.form.video;
  const audio = this._.form.audio;
  if (this._.playing) {
    if (
      allowedStates.includes(video.readyState) &&
      allowedStates.includes(audio.readyState)
    ) {
      audio.mjs_play();
      video.mjs_play();
    } else {
      if (!allowedStates.includes(video.readyState) && document.hasFocus())
        audio.mjs_pause();
      if (!allowedStates.includes(audio.readyState)) video.mjs_pause();
    }
  }
}

export function changePlaying(val) {
  if (val) {
    this._.form.video.mjs_play();
    this._.form.audio.mjs_play();
    this._.form.buttons.play.setAttribute("icon", "pauseBtn");
  } else {
    this._.form.video.mjs_pause();
    this._.form.audio.mjs_pause();
    this._.form.buttons.play.setAttribute("icon", "playBtn");
  }
  this._.playing = val;
}

export function play() {
  changePlaying.call(this, true);
}

export function pause() {
  changePlaying.call(this, false);
}

export function rewind(val) {
  val += this.currentTime;
  if (val < 0) val = 0;
  this._.form.audio.currentTime = val;
  this._.form.video.mjs_setTime(val);
}

export function setTime(val, isVideo = false) {
  this._.form.audio.currentTime = val;
  if (!isVideo) this._.form.video.mjs_setTime(val);
}

export function setSpeed(val) {
  if (val < 0.25) val = 0.25;
  if (val > 2) val = 2;
  this._.playbackRate = val;
  synchronize.call(this);
}
