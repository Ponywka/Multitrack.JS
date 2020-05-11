export function servicePlayingVideo(val) {
    if (val) {
        this._.form.video.onplaying = null;
        this._.form.video.play().then(() => {
            this._.form.video.onplaying = this._.form.video._onplaying;
        });
    } else {
        this._.form.video.onpause = null;
        this._.form.video.pause();
        setTimeout(() => {
            this._.form.video.onpause = this._.form.video._onpause;
        }, 16);
    }
}

export function servicePlayingAudio(val) {
    if (val) {
        this._.form.audio.onplaying = null;
        this._.form.audio.play().then(() => {
            this._.form.audio.onplaying = this._.form.audio._onplaying;
        });
    } else {
        this._.form.audio.onpause = null;
        this._.form.audio.pause();
        setTimeout(() => {
            this._.form.audio.onpause = this._.form.audio._onpause;
        }, 16);
    }
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
        if (!this._.form.audio._isWaiting) servicePlayingVideo.call(this, true);
        if (!this._.form.video._isWaiting) servicePlayingAudio.call(this, true);
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
    this._.form.video.currentTime = val;
    this._.form.audio.currentTime = val;
}

export function setTime(val) {
    val = Math.floor(val);
    this._.form.video.currentTime = val;
    this._.form.audio.currentTime = val;
}
