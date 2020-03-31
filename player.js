class MultitrackJS {
    _name = "MultitrackJS";

    _setSubtitles(content = null){
        if(this.ass !== undefined){
            this.ass.destroy()
            this.ass = undefined;
        }
        if(content != null){
            try{
                this.ass = new ASS(content, this.form.video, {
                    container: this.form.subs
                })
            }catch(e){}
        }
    }

    parameters = {
        frames: {
            x: 10,
            y: 10
        }
    }

    form = {
        video: this._createElement('video'),
        audio: this._createElement('audio'),
        subs: this._createElement('div', {
            id: 'subs'
        }),
        time: this._createElement('div', {
            name: 'time'
        }),
        logger: this._createElement('div', {
            name: 'logger'
        }),
        settings: {
            _root: this._createElement('div', {
                name: 'settings'
            })
        },
        buttons: {
            play: this._createElement('button', {
                name: 'playBtn'
            }),
            backward10: this._createElement('button', {
                name: 'backward10'
            }),
            forward10: this._createElement('button', {
                name: 'forward10'
            }),
            fullscreen: this._createElement('button', {
                name: 'fullscreenOn'
            }),
            pip: this._createElement('button', {
                name: 'pipOn'
            }),
            volume: this._createElement('button', {
                name: 'volume',
                icon: 3
            })
        },
        progressbar: {
            _root: this._createElement('div', {
                name: 'progress-all'
            }),
            line: this._createElement('div', {
                name: 'progress-line'
            }),
            loaded: this._createElement('canvas', {
                name: 'progress-loaded',
                height: 1
            }),
            played: this._createElement('div', {
                name: 'progress-played'
            }),
            popup: this._createElement('div', {
                name: 'timeline-popup'
            })
        },
        volumebar: {
            _root: this._createElement('div', {
                name: 'volumebar-all'
            }),
            line: this._createElement('div', {
                name: 'volumebar-line'
            }),
            selected: this._createElement('div', {
                name: 'volumebar-selected'
            })
        },
        overlays: {
            _root: this._createElement('div', {
                name: 'overlay'
            }),
            bottom: this._createElement('div', {
                name: 'overlay-bottom'
            })
        }
    }

    _createElement(tag, params = {}) {
        var el = document.createElement(tag);
        for (var name in params) el.setAttribute(name, params[name]);
        return el;
    }

    _getPosInElement(element, event){
        return {
            x: (event.clientX - (element.getBoundingClientRect()).x),
            y: (event.clientY - (element.getBoundingClientRect()).y)
        }
    }

    _pageFocused = true;

    _logError(text) {
        console.error(`${this._name} | ${text}`)
    }

    play() {
        this._changePlaying(true);
    }

    pause() {
        this._changePlaying(false);
    }

    _setTime(val) {
        val = Math.floor(val);
        this.form.video.currentTime = val;
        this.form.audio.currentTime = val;
    }

    _forward(val) {
        val += this.form.audio.currentTime;
        if (val < 0) val = 0;
        this.form.video.currentTime = val;
        this.form.audio.currentTime = val;
    }

    randomplace() {
        this._setTime(Math.random() * this.duration)
    }

    _secondsToTime(sec) {
        sec = Math.floor(sec);
        let seconds = sec % 60;
        let minutes = Math.floor(sec / 60) % 60;
        let hours = Math.floor(sec / 3600);
        return hours > 0 ?
            `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` :
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    _changeVideo(link) {
        this.form.video.src = link
        this.form.video.currentTime = this.form.audio.currentTime;
        if (this.playing) this._servicePlayingVideo(true)
    }

    _changeAudio(link) {
        let time = this.form.audio.currentTime
        this.form.audio.src = link
        this.form.audio.currentTime = time
        if (this.playing) {
            this._servicePlayingAudio(true)
        }
    }

    _servicePlayingVideo(val) {
        if (val) {
            if (!this.form.video._servicePlay) {
                this.form.video._ignoringAction += 1
                this.form.video.play().then(() => {
                    this.form.video._ignoringAction -= 1
                })
            }
        } else {
            if (this.form.video._servicePlay) {
                this.form.video._ignoringAction += 1
                this.form.video.pause()
                setTimeout(() => {
                    console.log("(video | func) -1");
                    this.form.video._ignoringAction -= 1
                }, 10);
            }
        }
    }

    _servicePlayingAudio(val) {
        if (val) {
            if (!this.form.audio._servicePlay) {
                this.form.audio._ignoringAction += 1
                this.form.audio.play().then(() => {
                    console.log("(audio | func) -1");
                    this.form.audio._ignoringAction -= 1
                })
            }
        } else {
            if (this.form.audio._servicePlay) {
                this.form.audio._ignoringAction += 1
                this.form.audio.pause()
                setTimeout(() => {
                    this.form.audio._ignoringAction -= 1
                }, 10);
            }
        }
    }

    _changePlaying(val) {
        if (val) {
            if (!this.form.audio._isWaiting) this._servicePlayingVideo(true);
            if (!this.form.video._isWaiting) this._servicePlayingAudio(true);
            this.form.buttons.play.setAttribute("name", "pauseBtn");
        } else {
            this._servicePlayingVideo(false)
            this._servicePlayingAudio(false)
            this.form.buttons.play.setAttribute("name", "playBtn");
        }
        this.playing = val;
    }

    _changeIsWaitingVideo(val) {
        if (val) {
            this._servicePlayingAudio(false)
        } else if (this.playing) {
            this._servicePlayingAudio(true)
        }
        this.form.video._isWaiting = val;
    }

    _changeIsWaitingAudio(val) {
        if (val) {
            this._servicePlayingVideo(false)
        } else if (this.playing) {
            this._servicePlayingVideo(true)
        }
        this.form.audio._isWaiting = val;
    }

    // Invisible sync
    _invisibleSync() {
        let diff = this.form.audio.currentTime - this.form.video.currentTime
        let mdiff = Math.abs(diff);
        if (this.playing && mdiff > (1/60)) {
            console.log("syncing...")
            if (mdiff < 3) {
                var scale = mdiff + 1;
                if (diff > 0) {
                    this.form.video.playbackRate = scale;
                    setTimeout(() => {
                        this.form.video.playbackRate = 1;
                        this._invisibleSync();
                    }, 1000)
                } else {
                    this.form.video.playbackRate = 1 / scale;
                    setTimeout(() => {
                        this.form.video.playbackRate = 1;
                        this._invisibleSync();
                    }, scale * 1000);
                }
            } else {
                this.form.video.currentTime = this.form.audio.currentTime;
                this._invisibleSync();
            }
        } else {
            setTimeout(() => {
                this._invisibleSync()
            }, 1000);
        }
    }

    constructor(selector, dataArray) {
        this._element = document.querySelector(selector);
        if (this._element) {
            this._element.setAttribute("multitrack-js", "")

            // Main elements
            this.form.video._ignoringAction = 0;
            this.form.audio._ignoringAction = 0;

            // Time
            this.form.time.innerText = "--:-- / --:--";

            // Play button
            this.form.buttons.play.onclick = () => {
                this.playing ? this.pause() : this.play();
            };

            // Backward 10 sec
            this.form.buttons.backward10.onclick = () => {
                this._forward(-10);
            };

            // Forward 10 sec
            this.form.buttons.forward10.onclick = () => {
                this._forward(10);
            };

            // Fullscreen
            this.form.buttons.fullscreen.onclick = (btn) => {
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    btn.target.setAttribute('name', 'fullscreenOn');
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
                    btn.target.setAttribute('name', 'fullscreenOff');
                }
            };

            // Picture-in-Picture
            this.form.buttons.pip.onclick = (btn) => {
                if (('pictureInPictureEnabled' in document)) {
                    if (this.form.video !== document.pictureInPictureElement) {
                        this._piped = true
                        this.form.video.requestPictureInPicture();
                        btn.target.setAttribute('name', 'pipOff');
                    } else {
                        this._piped = false
                        document.exitPictureInPicture()
                        btn.target.setAttribute('name', 'pipOn');
                    }
                } else {
                    this._logError('Sorry, your browser is not support picture-in-picture')
                }
            };

            // Progress bar
            this.form.progressbar._root.addEventListener("click", (event) => {
                this._setTime(this._getPosInElement(this.form.progressbar._root, event) / this.form.progressbar._root.clientWidth);
            });

            this.form.progressbar.popup.text = this._createElement('div', {
                name: 'timeline-popup-time'
            });
            this.form.progressbar.popup.image = this._createElement('div', {
                name: 'timeline-popup-image'
            });
            this.form.progressbar.popup.appendChild(this.form.progressbar.popup.image)
            this.form.progressbar.popup.appendChild(this.form.progressbar.popup.text)
            this.form.progressbar._root.appendChild(this.form.progressbar.popup)

            this.form.progressbar.popup.setAttribute('style', 'display: none');
            
            this.form.progressbar._root.addEventListener("mousedown", (event) => {
                this.form.progressbar.updateStyle = true;
            });

            this.form.progressbar._root.addEventListener("mouseup", (event) => {
                this.form.progressbar.updateStyle = false;
                this.form.progressbar.popup.setAttribute('style', 'display: none');
                var cursorX = this._getPosInElement(this.form.progressbar._root, event).x;
                console.log(cursorX)
                this.form.progressbar.newTime = this.duration * cursorX / this.form.progressbar._root.clientWidth;
                this._setTime(this.form.progressbar.newTime);
            });
            
            
            this.form.progressbar._root.addEventListener("mouseover", (event) => {
                this.form.progressbar.popup.setAttribute('style', 'opacity: 0');
            });
            this.form.progressbar._root.addEventListener("mousemove", (event) => {
                var cursorX = this._getPosInElement(this.form.progressbar._root, event).x;
                var position = cursorX / this.form.progressbar._root.clientWidth;
                if(position < 0) position = 0;
                if(position > 1) position = 1;
                if(this.form.progressbar.updateStyle) this.form.progressbar.played.setAttribute("style", `width: ${100 * position}%`);
                this.form.progressbar.popup.text.innerText = this._secondsToTime(this.duration * position);
                this.form.progressbar.popup.halfWidth = this.form.progressbar.popup.clientWidth / 2; 

                if(cursorX < this.form.progressbar.popup.halfWidth){
                    this.form.progressbar.popup.setAttribute('style', `left: 0px`);
                }else if(cursorX < (this.form.progressbar._root.clientWidth - this.form.progressbar.popup.halfWidth)){
                    this.form.progressbar.popup.setAttribute('style', `left: ${cursorX - this.form.progressbar.popup.halfWidth}px`);
                }else{
                    this.form.progressbar.popup.setAttribute('style', `left: ${this.form.progressbar._root.clientWidth - this.form.progressbar.popup.halfWidth * 2}px`);
                }

                var framesAll = this.parameters.frames.x * this.parameters.frames.y;
                var frame = Math.floor(position * framesAll);
                if(frame >= framesAll) frame = framesAll - 1;

                var offsetX = (frame%this.parameters.frames.x) / (this.parameters.frames.x - 1);
                var offsetY = Math.floor(frame / this.parameters.frames.x) / (this.parameters.frames.y - 1);
                this.form.progressbar.popup.image.setAttribute('style', `background-position: ${offsetX * 100}% ${offsetY * 100}%; background-size: ${this.parameters.frames.x * 100}%`);
            });

            this.form.progressbar._root.addEventListener("mouseout", (event) => {
                if(!this.form.progressbar.updateStyle) this.form.progressbar.popup.setAttribute('style', 'display: none');
            });

            // Volume bar
            this.form.volumebar._root.appendChild(this.form.volumebar.line);
            this.form.volumebar._root.appendChild(this.form.volumebar.selected);
            this.form.buttons.volume.addEventListener('click', () => {
                if(this.form.audio.volume != 0){
                    this.form.audio.lastVolume = this.form.audio.volume;
                    this.form.audio.volume = 0;
                }else{
                    this.form.audio.volume = this.form.audio.lastVolume;
                }
            })

            // Adding to element
            this.form.progressbar.loaded._canvas = this.form.progressbar.loaded.getContext("2d");
            this.form.progressbar._root.appendChild(this.form.progressbar.line);
            this.form.progressbar._root.appendChild(this.form.progressbar.loaded);
            this.form.progressbar._root.appendChild(this.form.progressbar.played);

            this.form.overlays.bottom.appendChild(this.form.buttons.play);
            this.form.overlays.bottom.appendChild(this.form.buttons.backward10);
            this.form.overlays.bottom.appendChild(this.form.buttons.forward10);
            this.form.overlays.bottom.appendChild(this.form.buttons.volume);
            this.form.overlays.bottom.appendChild(this.form.volumebar._root);
            this.form.overlays.bottom.appendChild(this.form.time);
            this.form.overlays.bottom.appendChild(this._createElement('div', {
                'style': 'flex: auto'
            }));
            if ('pictureInPictureEnabled' in document && !(navigator.userAgent.search(/YaBrowser/) > 0)) this.form.overlays.bottom.appendChild(this.form.buttons.pip);
            this.form.overlays.bottom.appendChild(this.form.buttons.fullscreen);
            this.form.overlays._root.appendChild(this.form.overlays.bottom);
            this.form.overlays._root.appendChild(this.form.progressbar._root);

            this._element.appendChild(this.form.video);
            this._element.appendChild(this.form.audio);
            this._element.appendChild(this.form.subs);
            this._element.appendChild(this.form.overlays._root);
            this._element.appendChild(this.form.settings._root);
            this._element.appendChild(this.form.logger);

            // Logger
            setInterval(() => {
                this.form.logger.innerText = `  Количество игнорируемых действий с видео: ${this.form.video._ignoringAction}
                                                Количество игнорируемых действий с аудио: ${this.form.audio._ignoringAction}
                                                Ожидание загрузки видео: ${this.form.video._isWaiting}
                                                Ожидание загрузки аудио: ${this.form.audio._isWaiting}
                                                Разрыв дорожек: ${Math.floor(Math.abs(this.form.video.currentTime - this.form.audio.currentTime)*1000)/1000}`;
            }, 5);

            // Update video duration
            this.form.video.onloadedmetadata = () => {
                this.duration = this.form.video.duration;
                this.form.time.innerText = `${this._secondsToTime(this.form.audio.currentTime)} / ${this._secondsToTime(this.duration)}`;
            }

            // Sync video loading
            this.form.video.onwaiting = () => {
                this._changeIsWaitingVideo(true);
            }
            this.form.video.oncanplay = () => {
                this._changeIsWaitingVideo(false);
            }

            // Sync audio loading
            this.form.audio.onwaiting = () => {
                this._changeIsWaitingAudio(true);
            }
            this.form.audio.oncanplay = () => {
                this._changeIsWaitingAudio(false);
            }

            // Sync time
            this.form.audio.ontimeupdate = () => {
                this.currentTime = this.form.audio.currentTime
                if(!this.form.progressbar.updateStyle) this.form.progressbar.played.setAttribute("style", `width: ${100 * this.form.audio.currentTime / this.duration}%`);
                this.form.time.innerText = `${this._secondsToTime(this.form.audio.currentTime)} / ${this._secondsToTime(this.duration)}`;
            }

            // Sync pause audio
            this.form.audio.onpause = () => {
                this.form.audio._servicePlay = false;
                if (this.form.audio._ignoringAction == 0) {
                    console.log("(video) PLAYBACK IS STOP!");
                    this._changePlaying(false);
                }
            }

            // Sync playing audio
            this.form.audio.onplaying = () => {
                this.form.audio._servicePlay = true;
                if (this.form.audio._ignoringAction == 0) {
                    this._changePlaying(true);
                }
            }

            // Sync pause video
            this.form.video.onpause = () => {
                this.form.video._servicePlay = false;
                if (this.form.video._ignoringAction == 0) {
                    if (this.form.video === document.pictureInPictureElement || this._pageFocused || this.form.video._leavedFromPiP) {
                        console.log("(video) PLAYBACK IS STOP!");
                        this._changePlaying(false);
                        this.form.video._leavedFromPiP = false;
                    }
                }
            }

            // Sync playing video
            this.form.video.onplaying = () => {
                this.form.video._servicePlay = true;
                if (this.form.audio._ignoringAction == 0) {
                    this._changePlaying(true);
                }
            }

            this.form.video.addEventListener('leavepictureinpicture', () => {
                this.form.buttons.pip.setAttribute('name', 'pipOn');
                this.form.video._leavedFromPiP = true;
            });

            window.addEventListener('focus', () => {
                this._pageFocused = true;
                if (this.playing) this._changePlaying(true);
            });

            window.addEventListener('blur', () => {
                this._pageFocused = false;
            });

            // Progress bar
            this.form.video.onprogress = () => {
                var element = this.form.progressbar.loaded;
                var canvas = this.form.progressbar.loaded._canvas;
                element.width = element.clientWidth;
                canvas.fillStyle = 'white';
                canvas.clearRect(0, 0, element.width, 1);
                for (let i = 0; i < this.form.video.buffered.length; i++) {
                    var startX = this.form.video.buffered.start(i) * element.width / this
                        .duration;
                    var endX = this.form.video.buffered.end(i) * element.width / this.duration;
                    var width = endX - startX;

                    canvas.fillRect(Math.floor(startX), 0, Math.floor(width), 1);
                }
            }

            this._invisibleSync();

            this.form.video.src = dataArray.video
            this.form.audio.src = dataArray.audio
        } else this._logError(`Can not find "${selector}" element!`);
    }
}