export function setVolume(val) {
    if (val < 0) val = 0;
    if (val > 1) val = 1;
    this._.form.buttons.volume.setAttribute("icon", Math.ceil(val * 3));
    this._.form.volumebar.selected.setAttribute(
        "style",
        `width: ${100 * val}%`
    );
    this._.form.audio.volume = val;
}

export function mute(val = true) {
    if (this._.form.audio.volume != 0) {
        this._.form.audio.lastVolume = this._.form.audio.volume;
        setVolume.call(this, 0);
    } else if (!val) {
        setVolume.call(this, this._.form.audio.lastVolume);
    }
}
