export function synchronize(target = null) {
  console.log("sync...");
  const root = (target) ? target : this;
  return new Promise(resolve => {
    const video = root._.form.video;
    const audio = root._.form.audio;
    const playbackSpeed = root._.playbackSpeed;
    const diff = video.currentTime - audio.currentTime;

    audio.playbackRate = playbackSpeed;
    video.mjs_setRate(playbackSpeed);
    if (video.syncTimeout) clearTimeout(video.syncTimeout);
    video.syncTimeout = null;

    if (root.playing && Math.abs(diff) > 1 / 60) {
      let scale = playbackSpeed - diff;
      if (0.25 <= scale && scale <= 4) {
        video.mjs_setRate(scale);
        video.syncTimeout = setTimeout(() => {
          video.mjs_setRate(playbackSpeed);
          video.syncTimeout = null;
        }, 1000);
	setTimeout(() => {
	  resolve();
	}, 1050);
      } else {
        video.mjs_setTime(audio.currentTime);
        resolve();
      }
    }else{
      resolve();
    }
  })
}

export function downloadStatusUpdate(){
  const allowedStates = [3,4];
  const video = this._.form.video;
  const audio = this._.form.audio;
  if(this.playing){
    if(allowedStates.includes(video.readyState) && allowedStates.includes(audio.readyState)){
      audio.mjs_play();
      video.mjs_play();
    }else{
      if(!allowedStates.includes(video.readyState)) audio.mjs_pause();
      if(!allowedStates.includes(audio.readyState)) video.mjs_pause();
    }
  }
}

export function changePlaying(val) {
  if(val){
    if(this._.form.audio._isWaiting && this._.form.video._isWaiting){
      this._.form.audio.play();
    }else{
      if(!this._.form.audio._isWaiting) this._.form.video.mjs_play();
      if(!this._.form.video._isWaiting) this._.form.audio.mjs_play();
    }
    this._.form.buttons.play.setAttribute("icon", "pauseBtn");
  }else{
    this._.form.video.mjs_pause();
    this._.form.audio.mjs_pause();
    this._.form.buttons.play.setAttribute("icon", "playBtn");
  }
  this.playing = val;
}

export function play() {
  changePlaying.call(this, true);
}

export function pause() {
  changePlaying.call(this, false);
}

export function rewind(val) {
  val += this._.form.audio.currentTime;
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
  this._.playbackSpeed = val;
  synchronize.call(this);
}
