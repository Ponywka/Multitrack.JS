export function synchronize() {
    let video = this._.form.video;
    let audio = this._.form.audio;
    let playbackSpeed = this._.playbackSpeed;
    let diff = video.currentTime - audio.currentTime;

    audio.playbackRate = playbackSpeed;
    video.mjs_setRate(playbackSpeed);
    if(video.syncTimeout) clearTimeout(video.syncTimeout);
    video.syncTimeout = null

    if (this.playing && Math.abs(diff) > 1 / 60) {
        let scale = playbackSpeed - diff;
        if(0.25 <= scale && scale <= 4) {
            video.mjs_setRate(scale);
            video.syncTimeout = setTimeout(() => {
                video.mjs_setRate(playbackSpeed);
                video.syncTimeout = null;
            }, 1000);
        }else{
            video.mjs_setTime(audio.currentTime);
        }
    }
}

export function servicePlayingVideo(val) {
    let el = this._.form.video;
    (val) ? el.mjs_play() : el.mjs_pause();
}

export function servicePlayingAudio(val) {
    let el = this._.form.audio;
    (val) ? el.mjs_play() : el.mjs_pause();
}

export function changeIsWaitingVideo(val) {
    if (val) {
        servicePlayingAudio.call(this, false);
    } else if (this.playing) {
        servicePlayingAudio.call(this, true);
    }
    this._.form.video._isWaiting = val;
}

export function changeIsWaitingAudio(val) {
    if (val) {
        servicePlayingVideo.call(this, false);
    } else if (this.playing) {
        servicePlayingVideo.call(this, true);
    }
    this._.form.audio._isWaiting = val;
}

export function changePlaying(val) {
    if (val) {
        if(this._.form.audio._isWaiting && this._.form.video._isWaiting){
            this._.form.audio.play();

        }else{
            if (!this._.form.audio._isWaiting) servicePlayingVideo.call(this, true);
            if (!this._.form.video._isWaiting) servicePlayingAudio.call(this, true);
        }
        this._.form.buttons.play.setAttribute("name", "pauseBtn");
    } else {
        servicePlayingVideo.call(this, false);
        servicePlayingAudio.call(this, false);
        this._.form.buttons.play.setAttribute("name", "playBtn");
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
    if(val < 0.25) val = 0.25;
    if(val > 2) val = 2;
    this._.playbackSpeed = val;
    synchronize.call(this);
}