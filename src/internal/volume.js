export function mute(undoLast = false) {
  if (undoLast && this.muted) {
    this.muted = false;
  } else {
    this.muted = true;
  }
}
