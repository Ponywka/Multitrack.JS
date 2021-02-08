export function synchronize() {
    let video = this._.form.video;
    let audio = this._.form.audio;

    if(video.syncTimeout) clearTimeout(video.syncTimeout);

    let diff = audio.currentTime - video.currentTime;

    console.log(`Difference: `, diff);
    let absDiff = Math.abs(diff);
    if (this.playing && absDiff > 1 / 60) {
        if (absDiff < 3) {
            let scale = absDiff + 1;
            video.playbackRate = (diff > 0) ? scale : 1 / scale;
            video.syncTimeout = setTimeout(() => {
                this._.form.video.playbackRate = 1;
            }, 1000);
        } else {
            video.mjs_setTime(this._.form.audio.currentTime);
        }
    }else{
        console.log('Not need sync');
    }
}

function servicePlaying(el, val, rootClass){
    if (val) {
        el.onplaying = null;
        el.play().then(() => {
            el.onplaying = el._onplaying;
            synchronize.call(rootClass);
        });
    } else {
        el.onpause = null;
        el.pause();
        setTimeout(() => {
            el.onpause = el._onpause;
        }, 16);
    }
}

export function servicePlayingVideo(val) {
    servicePlaying(this._.form.video, val, this);
}

export function servicePlayingAudio(val) {
    servicePlaying(this._.form.audio, val, this);
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
    this._.form.audio.currentTime = val;
    this._.form.video.mjs_setTime(val);
}

export function setTime(val, isVideo = false) {
    this._.form.audio.currentTime = val;
    if (!isVideo) this._.form.video.mjs_setTime(val);
}