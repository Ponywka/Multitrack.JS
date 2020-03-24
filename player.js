class MultitrackJS {
    buildGUI() {
        // Main elements
        this._video = document.createElement('video');
        this._audio = document.createElement('audio');
        this._element.appendChild(this._video);
        this._element.appendChild(this._audio);

        // Time
        this._timeEl = document.createElement('div');
        this._timeEl.setAttribute("name", "time");
        this._timeEl.innerText = "--:-- / --:--";

        // Play button
        this._playBtn = document.createElement('button');
        this._playBtn.setAttribute("name", "playBtn");
        this._playBtn.onclick = () => {
            this.playing ? this.pause() : this.play();
        };

        // Backward 10 sec
        this._backward10 = document.createElement('button');
        this._backward10.setAttribute("name", "backward10");
        this._backward10.onclick = () => {
            this._forward(-10);
        };

        // Forward 10 sec
        this._forward10 = document.createElement('button');
        this._forward10.setAttribute("name", "forward10");
        this._forward10.onclick = () => {
            this._forward(10);
        };

        // Fullscreen
        this._fullscreen = document.createElement('button');
        this._fullscreen.setAttribute("name", "fullscreenOn");
        this._fullscreen.onclick = (btn) => {
            if (
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                btn.target.setAttribute("name", "fullscreenOn");
            } else {
                var element = this._element;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                btn.target.setAttribute("name", "fullscreenOff");
            }
        };

        // Picture-in-Picture
        this._pip = document.createElement('button');
        this._pip.setAttribute("name", "pipOn");
        this._pip.onclick = (btn) => {
            if (('pictureInPictureEnabled' in document)) {
                if (this._video !== document.pictureInPictureElement) {
                    this._piped = true
                    this._video.requestPictureInPicture();
                    btn.target.setAttribute("name", "pipOff");
                } else {
                    this._piped = false
                    document.exitPictureInPicture()
                    btn.target.setAttribute("name", "pipOn");
                }
            } else {
                this._logError("Sorry, your browser is not support PiP")
            }
        };

        // Overlays
        this._overlay = document.createElement('div');
        this._overlay.setAttribute("name", "overlay")

        this._overlay_bottom = document.createElement('div');
        this._overlay_bottom.setAttribute("name", "overlay-bottom")
        this._overlay.appendChild(this._overlay_bottom);

        // Bottom overlay
        this._overlay_bottom.appendChild(this._playBtn);
        this._overlay_bottom.appendChild(this._backward10);
        this._overlay_bottom.appendChild(this._forward10);

        this._overlay_bottom.appendChild(this._timeEl);

        var flexEl = document.createElement('div');
        flexEl.setAttribute("style", "flex: auto")
        this._overlay_bottom.appendChild(flexEl);

        this._overlay_bottom.appendChild(this._pip);
        this._overlay_bottom.appendChild(this._fullscreen);

        this._element.appendChild(this._overlay);
    }

    _pageFocused = true;
    _ignoringActionVideo = 0;
    _ignoringActionAudio = 0;
    _name = "MultitrackJS";

    _logError(text) {
        console.error(`${this._name} | ${text}`)
    }

    // Functions from Vue.JS
    play() {
        this._changePlaying(true);
    }

    pause() {
        this._changePlaying(false);
    }

    _newTime(val) {
        val = Math.floor(val);
        console.log(`newTime changed to ${val}`);
        this._video.currentTime = val;
        this._audio.currentTime = val;
    }

    _forward(val) {
        val += this._audio.currentTime;
        if (val < 0) val = 0;
        this._video.currentTime = val;
        this._audio.currentTime = val;
    }

    randomplace() {
        this._newTime(Math.random() * this.duration)
    }

    /*progressBarClick(event) {
        this.newTime = ((event.layerX - event.target.offsetLeft) / event.target.parentElement
            .clientWidth) * this.duration;
    }*/

    _secondsToTime(sec) {
        sec = Math.floor(sec);
        let seconds = sec % 60;
        let minutes = (sec - seconds) / 60;
        let hours = (sec - minutes * 60 - seconds) / 3600;
        return hours > 0 ?
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /*invisibleSync() {
        if (this.playing) {
            this.serviceVideoPlay()
        }
    }*/

    /*changeVid: function (link) {
        console.log(`Video changed to ${link}`)
        //this.serviceVideoPause()
        this.$refs.videoel.src = link
        this.isWaitingVideo = true
        this.syncThisShit()
        console.log(`COMPLETE! Video changed to ${link}`)
    }

    changeAud: function (link) {
        console.log(`Audio changed to ${link}`)
        let time = this.$refs.audioel.currentTime
        //this.serviceAudioPause()
        this.$refs.audioel.src = link
        this.isWaitingAudio = true
        this.$refs.audioel.currentTime = time
        this.syncThisShit()
        console.log(`COMPLETE! Audio changed to ${link}`)
    }*/

    _servicePlayingVideo(val) {
        if (val) {
            if (this._video.paused) {
                this._ignoringActionVideo += 1
                console.trace("Video+1 Play")
                this._video.play()
            }
        } else {
            if (!this._video.paused) {
                this._ignoringActionVideo += 1
                console.trace("Video+1 Pause")
                this._video.pause()
            }
        }
    }

    _servicePlayingAudio(val) {
        if (val) {
            if (this._audio.paused) {
                this._ignoringActionAudio += 1
                console.trace("Audio+1 Play")
                this._audio.play()
            }
        } else {
            if (!this._audio.paused) {
                this._ignoringActionAudio += 1
                console.trace("Audio+1 Pause")
                this._audio.pause()
            }
        }
    }

    // Watchers from Vue.JS
    _changePlaying(val) {
        console.log(`isPlaying changed to ${val}`);
        if (val) {
            if (!this._isWaitingAudio && !this._isWaitingVideo) {
                this._servicePlayingVideo(true);
                this._servicePlayingAudio(true);
            }
            this._playBtn.setAttribute("name", "pauseBtn");
            /*if (Math.abs(this.$refs.videoel.currentTime - this.$refs.audioel.currentTime) > 0.2)
                this.$refs.videoel.currentTime = this.$refs.audioel.currentTime;*/
        } else {
            this._servicePlayingVideo(false)
            this._servicePlayingAudio(false)
            this._playBtn.setAttribute("name", "playBtn");
        }
        this.playing = val;
    }

    _changeIsWaitingVideo(val) {
        console.log(`isWaitingVideo changed to ${val}`);
        if (val) {
            this._servicePlayingAudio(false)
        } else if (this.playing && !this._isWaitingAudio) {
            this._servicePlayingAudio(true)
        }
        this._isWaitingVideo = val;
    }

    _changeIsWaitingAudio(val) {
        console.log(`isWaitingAudio changed to ${val}`);
        if (val) {
            this._servicePlayingVideo(false)
        } else if (this.playing) {
            this._servicePlayingVideo(true)
        }
        this._isWaitingAudio = val;
    }

    constructor(selector, dataArray) {
        this._element = document.querySelector(selector);
        if (!this._element) this._logError(`Can not find "${selector}" element!`);

        this._element.setAttribute("multitrack-js", "")

        this.buildGUI();

        // Update video duration
        this._video.onloadedmetadata = () => {
            this.duration = this._video.duration;
            this._timeEl.innerText = `${this._secondsToTime(this._audio.currentTime)} / ${this._secondsToTime(this.duration)}`;
        }

        // Sync video loading
        this._video.onwaiting = () => {
            this._changeIsWaitingVideo(true);
        }
        this._video.oncanplay = () => {
            this._changeIsWaitingVideo(false);
        }

        // Sync audio loading
        this._audio.onwaiting = () => {
            this._changeIsWaitingAudio(true);
        }
        this._audio.oncanplay = () => {
            this._changeIsWaitingAudio(false);
        }

        // Sync time
        this._audio.ontimeupdate = () => {
            //this._log1.innerHTML = `${this._audio.currentTime} | ${this._video.currentTime}`;
            //this._log2.innerHTML = this._audio.currentTime - this._video.currentTime;

            this.currentTime = this._audio.currentTime
            this.currentTimeVideo = this._video.currentTime
            this._timeEl.innerText = `${this._secondsToTime(this._audio.currentTime)} / ${this._secondsToTime(this.duration)}`;
        }

        /*this._video.ontimeupdate = () => {
            this.currentTimeVideo = this._video.currentTime
        }*/

        // Sync pause audio
        this._audio.onpause = () => {
            console.log(`>>>>> Audio pause ${this._ignoringActionAudio}`);
            if (this._ignoringActionAudio == 0) {
                this._changePlaying(false);
            } else {
                this._ignoringActionAudio -= 1;
            }
        }

        // Sync playing audio
        this._audio.onplaying = () => {
            console.log(`>>>>> Audio play ${this._ignoringActionAudio}`);
            if (this._ignoringActionAudio == 0) {
                this._changePlaying(true);
            } else {
                this._ignoringActionAudio -= 1;
            }
        }

        // Sync pause video
        this._video.onpause = () => {
            console.log(`>>>>> Video pause ${this._ignoringActionVideo}`);
            if (this._ignoringActionVideo == 0) {
                if (this._video === document.pictureInPictureElement || _pageFocused)
                    this._changePlaying(false);
            } else {
                this._ignoringActionVideo -= 1;
            }
        }

        // Sync playing video
        this._video.onplaying = () => {
            console.log(`>>>>> Video play ${this._ignoringActionVideo}`);
            if (this._ignoringActionVideo == 0) {
                this._changePlaying(true);
            } else {
                this._ignoringActionVideo -= 1;
            }
        }

        this._video.src = dataArray.video
        this._audio.src = dataArray.audio

        // Invisible sync
        setInterval(() => {
            let diff = this._audio.currentTime - this._video.currentTime
            let mdiff = Math.abs(diff);
            if (this.playing && mdiff > 0.2) {
                if (mdiff < 3) {
                    if (diff > 0) {
                        this._video.playbackRate = diff + 1;
                        console.log(`VIDEO: ${this._video.playbackRate}`)
                    } else {
                        this._audio.playbackRate = 1 - diff;
                        console.log(`AUDIO: ${this._audio.playbackRate}`)
                    }
                    setTimeout(() => {
                        this._video.playbackRate = 1;
                        this._audio.playbackRate = 1;
                        console.log("STOP SYNC");
                    }, 1000)
                } else {
                    this._video.currentTime = this._audio.currentTime;
                }
            }
        }, 1500);

        window.addEventListener('focus', () => {
            console.log("focus");
            this._pageFocused = true;
        });

        window.addEventListener('blur', () => {
            console.log("blur");
            this._pageFocused = false;
        });
        // Progress bar
        /*this._video.onprogress = () => {
            player.loadbar.width = player.loadbar.clientWidth;
            this.canvas.fillStyle = 'white';
            this.canvas.clearRect(0, 0, player.loadbar.width, 1);
            for (let i = 0; i < this._video.buffered.length; i++) {
                var startX = this._video.buffered.start(i) * player.loadbar.width / this
                    .duration;
                var endX = this._video.buffered.end(i) * player.loadbar.width / this.duration;
                var width = endX - startX;

                this.canvas.fillRect(Math.floor(startX), 0, Math.floor(width), 1);
            }
        }*/
    }
}