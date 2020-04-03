class MultitrackJS {
    // Конструктор
    constructor(selector, dataArray) {
        this._name = "MultitrackJS";
        this._parameters = {
            frames: {
                x: 10,
                y: 10,
                image: "frames.png"
            }
        }

        this._element = document.querySelector(selector);
        if (this._element) {
            this._element.setAttribute("multitrack-js", "")
            this._buildGUI()
            this._invisibleSync()

            this.form.video.src = dataArray.video
            this.form.audio.src = dataArray.audio
            if (dataArray.preview) this._parameters.frames.image = dataArray.preview

            // Subtitles
            if (dataArray.subtitles) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', dataArray.subtitles, false);
                xhr.send();
                if (xhr.status == 200) {
                    this.setSubtitles(xhr.responseText);
                } else {
                    alert(xhr.status + ': ' + xhr.statusText);
                }
            }
        } else this._logError(`Can not find "${selector}" element!`);
    }

    // Публичные методы
    play() {
        this._changePlaying(true);
    }

    pause() {
        this._changePlaying(false);
    }

    rewind(val) {
        val += this.form.audio.currentTime;
        if (val < 0) val = 0;
        this.form.video.currentTime = val;
        this.form.audio.currentTime = val;
    }

    setTime(val) {
        val = Math.floor(val);
        this.form.video.currentTime = val;
        this.form.audio.currentTime = val;
    }

    resize() {
        if (this.ass !== undefined) this.ass.resize()
    }

    setVideo(link) {
        this.form.video.src = link
        this.form.video.currentTime = this.form.audio.currentTime;
        if (this.playing) this._servicePlayingVideo(true)
    }

    setAudio(link) {
        let time = this.form.audio.currentTime
        this.form.audio.src = link
        this.form.audio.currentTime = time
        if (this.playing) {
            this._servicePlayingAudio(true)
        }
    }

    setSubtitles(content = null) {
        if (this.ass !== undefined) {
            this.ass.destroy()
            this.ass = undefined;
        }
        if (content != null) {
            try {
                this.ass = new ASS(content, this.form.video, {
                    container: this.form.subtitles
                })
                this.resize()
            } catch (e) {}
        }
    }

    // Служебные методы
    _getPosInElement(element, event) {
        return {
            x: (event.clientX - (element.getBoundingClientRect()).x),
            y: (event.clientY - (element.getBoundingClientRect()).y)
        }
    }

    _logError(text) {
        console.error(`${this._name} | ${text}`)
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

    _servicePlayingVideo(val) {
        console.trace(`_servicePlayingVideo(${val})`);
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
        console.trace(`_servicePlayingAudio(${val})`);
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

    // Полузаметная синхронизация дорожек
    _invisibleSync() {
        let diff = this.form.audio.currentTime - this.form.video.currentTime
        let mdiff = Math.abs(diff);
        if (this.playing && mdiff > (1 / 60)) {
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

    // Сборка графического интерфейса
    _buildGUI() {
        // Свернуто ли окно (нужно для правильной работы плеера, когда окно свернуто)
        this._pageFocused = true;
        window.addEventListener("resize", () => {
            this.resize()
        })
        window.addEventListener('focus', () => {
            this._pageFocused = true;
            if (this.playing) this._changePlaying(true);
        })
        window.addEventListener('blur', () => {
            this._pageFocused = false;
        })

        const createElement = (tag, params = {}, actions = () => {}) => {
            var el = document.createElement(tag);
            for (var name in params) el.setAttribute(name, params[name]);
            actions(el);
            return el;
        }

        // Генерация элементов GUI
        this.form = {
            // Видео
            video: createElement('video', {}, (el) => {
                el._ignoringAction = 0;
                el._servicePlay = false;
                // Обработка событий плей/пауза
                el.onplaying = () => {
                    console.log("VIDEO PLAY")
                    el._servicePlay = true;
                    if (!el._ignoringAction) this._changePlaying(true)
                }
                el.onpause = () => {
                    console.log("VIDEO PAUSE")
                    el._servicePlay = false;
                    if (!el._ignoringAction) {
                        if (el === document.pictureInPictureElement || this._pageFocused || el._leavedFromPiP) {
                            console.log("(video) PLAYBACK IS STOP!");
                            this._changePlaying(false);
                            el._leavedFromPiP = false;
                        }
                    }
                }
                // Обработка событий загрузки
                el.onwaiting = () => {
                    this._changeIsWaitingVideo(true);
                }
                el.oncanplay = () => {
                    this._changeIsWaitingVideo(false)
                }
                el.onloadedmetadata = () => {
                    this.duration = el.duration;
                    this.form.time.innerText = `${this._secondsToTime(this.form.audio.currentTime)} / ${this._secondsToTime(this.duration)}`;
                }
                el.onprogress = () => {
                    var element = this.form.progressbar.loaded;
                    var canvas = this.form.progressbar.loaded._canvas;
                    element.width = element.clientWidth;
                    canvas.fillStyle = 'white';
                    canvas.clearRect(0, 0, element.width, 1);
                    for (let i = 0; i < el.buffered.length; i++) {
                        var startX = el.buffered.start(i) * element.width / this
                            .duration;
                        var endX = el.buffered.end(i) * element.width / this.duration;
                        var width = endX - startX;

                        canvas.fillRect(Math.floor(startX), 0, Math.floor(width), 1);
                    }
                }
                // Остальные обработчики событий
                el.addEventListener('leavepictureinpicture', () => {
                    console.log("test")
                    this.form.buttons.pip.setAttribute('name', 'pipOn');
                    el._leavedFromPiP = true;
                })
            }),
            // Аудио
            audio: createElement('audio', {}, (el) => {
                el._ignoringAction = 0;
                el._servicePlay = false;
                // Обработка событий плей/пауза
                el.onplaying = () => {
                    console.log("AUDIO PLAY")
                    el._servicePlay = true;
                    if (!el._ignoringAction) this._changePlaying(true)
                }
                el.onpause = () => {
                    console.log("AUDIO PAUSE")
                    el._servicePlay = false;
                    if (!el._ignoringAction) {
                        console.log("(video) PLAYBACK IS STOP!");
                        this._changePlaying(false);
                    }
                }
                // Обработка событий загрузки
                el.onwaiting = () => {
                    this._changeIsWaitingAudio(true);
                }
                el.oncanplay = () => {
                    this._changeIsWaitingAudio(false);
                }
                // Остальные обработчики событий
                el.ontimeupdate = () => {
                    this.currentTime = el.currentTime
                    if (!this.form.progressbar.updateStyle) this.form.progressbar.played.setAttribute("style", `width: ${100 * el.currentTime / this.duration}%`);
                    this.form.time.innerText = `${this._secondsToTime(el.currentTime)} / ${this._secondsToTime(this.duration)}`;
                }
            }),
            // Субтитры
            subtitles: createElement('div', {
                id: 'subtitles'
            }),
            // Отображаемое время
            time: createElement('div', {
                name: 'time'
            }, (el) => {
                el.innerText = "--:-- / --:--";
            }),
            // Информация для гиков
            logger: createElement('div', {
                name: 'logger'
            }),
            // Окно настроек
            settings: {
                _root: createElement('div', {
                    name: 'settings'
                })
            },
            // Кнопки (массив)
            buttons: {
                // Плей/пауза
                play: createElement('button', {
                    name: 'playBtn'
                }, (el) => {
                    el.onclick = () => {
                        this.playing ? this.pause() : this.play();
                    };
                }),
                // Отмотать на 10 секунд
                backward10: createElement('button', {
                    name: 'backward10'
                }, (el) => {
                    el.onclick = () => {
                        this.rewind(-10);
                    };
                }),
                // Перемотать на 10 секунд
                forward10: createElement('button', {
                    name: 'forward10'
                }, (el) => {
                    el.onclick = () => {
                        this.rewind(10);
                    };
                }),
                // Кнопка полного экрана
                fullscreen: createElement('button', {
                    name: 'fullscreenOn'
                }, (el) => {
                    el.onclick = (btn) => {
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
                            if (navigator.userAgent.search(/Safari/) > 0) this._element.removeAttribute('style');
                            el.setAttribute('name', 'fullscreenOn');
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
                            if (navigator.userAgent.search(/Safari/) > 0) this._element.setAttribute('style', 'width: 100%; height: 100%;');
                            el.setAttribute('name', 'fullscreenOff');
                        }
                    };
                }),
                // Кнопка режима "Картинка-в-картинке"
                pip: createElement('button', {
                    name: 'pipOn'
                }, (el) => {
                    el.onclick = (btn) => {
                        if (('pictureInPictureEnabled' in document)) {
                            if (this.form.video !== document.pictureInPictureElement) {
                                this._piped = true
                                this.form.video.requestPictureInPicture();
                                el.setAttribute('name', 'pipOff');
                            } else {
                                this._piped = false
                                document.exitPictureInPicture()
                                el.setAttribute('name', 'pipOn');
                            }
                        } else {
                            this._logError('Sorry, your browser is not support picture-in-picture')
                        }
                    };
                }),
                // Кнопка звука
                volume: createElement('button', {
                    name: 'volume',
                    icon: 3
                }, (el) => {
                    el.addEventListener('click', () => {
                        if (this.form.audio.volume != 0) {
                            this.form.audio.lastVolume = this.form.audio.volume;
                            this.form.audio.volume = 0;
                        } else {
                            this.form.audio.volume = this.form.audio.lastVolume;
                        }
                    })
                })
            },
            // Прогресс-бар
            progressbar: {
                line: createElement('div', {
                    name: 'progress-line'
                }),
                loaded: createElement('canvas', {
                    name: 'progress-loaded',
                    height: 1
                }, (el) => {
                    el._canvas = el.getContext("2d");
                }),
                played: createElement('div', {
                    name: 'progress-played'
                }),
                popup: createElement('div', {
                    name: 'timeline-popup',
                    style: 'display: none'
                }, (el) => {
                    el.text = createElement('div', {
                        name: 'timeline-popup-time'
                    });
                    el.image = createElement('div', {
                        name: 'timeline-popup-image'
                    });
                }),
                _root: createElement('div', {
                    name: 'progress-all'
                }, (el) => {
                    el.addEventListener("mousedown", () => {
                        this.form.progressbar.updateStyle = true
                    })
                    el.addEventListener("mouseup", (event) => {
                        this.form.progressbar.updateStyle = false
                        this.form.progressbar.popup.setAttribute('style', 'display: none')
                        this.setTime(this.duration * this._getPosInElement(el, event).x / el.clientWidth)
                    })
                    el.addEventListener("mouseover", (event) => {
                        this.form.progressbar.popup.setAttribute('style', 'opacity: 0')
                    })
                    el.addEventListener("mouseout", (event) => {
                        this.form.progressbar.popup.setAttribute('style', 'display: none')
                    })
                    el.addEventListener("mousemove", (event) => {
                        // Получение координаты и вычисление позиции (от 0 до 1)
                        var cursorX = this._getPosInElement(el, event).x;
                        var position = cursorX / el.clientWidth;
                        if (position < 0) position = 0;
                        if (position > 1) position = 1;
                        // Обновление ширины текущей позиции
                        if (this.form.progressbar.updateStyle) {
                            this.form.progressbar.played.setAttribute("style", `width: ${100 * position}%`)
                        }
                        // Обновление всплывающего пузырька
                        this.form.progressbar.popup.text.innerText = this._secondsToTime(this.duration * position);
                        this.form.progressbar.popup.halfWidth = this.form.progressbar.popup.clientWidth / 2;
                        if (cursorX < this.form.progressbar.popup.halfWidth) {
                            this.form.progressbar.popup.setAttribute('style', `left: 0px`);
                        } else if (cursorX < (el.clientWidth - this.form.progressbar.popup.halfWidth)) {
                            this.form.progressbar.popup.setAttribute('style', `left: ${cursorX - this.form.progressbar.popup.halfWidth}px`);
                        } else {
                            this.form.progressbar.popup.setAttribute('style', `left: ${el.clientWidth - this.form.progressbar.popup.halfWidth * 2}px`);
                        }
                        // Отображение нужного тайла на экран
                        var framesAll = this._parameters.frames.x * this._parameters.frames.y;
                        var frame = Math.floor(position * framesAll);
                        if (frame >= framesAll) frame = framesAll - 1;
                        var offsetX = (frame % this._parameters.frames.x) / (this._parameters.frames.x - 1);
                        var offsetY = Math.floor(frame / this._parameters.frames.x) / (this._parameters.frames.y - 1);
                        this.form.progressbar.popup.image.setAttribute('style', `background-position: ${offsetX * 100}% ${offsetY * 100}%; background-size: ${this._parameters.frames.x * 100}%; background-image: url(${this._parameters.frames.image})`);
                    })
                })
            },
            // Ползунок громкости
            volumebar: {
                line: createElement('div', {
                    name: 'volumebar-line'
                }),
                selected: createElement('div', {
                    name: 'volumebar-selected'
                }),
                _root: createElement('div', {
                    name: 'volumebar-all'
                }, (el) => {
                    el.addEventListener("mousedown", () => {
                        this.form.volumebar.updateStyle = true
                    })
                    el.addEventListener("mouseup", (event) => {
                        this.form.volumebar.updateStyle = false
                        // Получение координаты и вычисление позиции (от 0 до 1)
                        var cursorX = this._getPosInElement(el, event).x;
                        var position = this._getPosInElement(el, event).x / el.clientWidth;
                        if (position < 0) position = 0;
                        if (position > 1) position = 1;
                        // Обновление ширины текущей позиции
                        this.form.volumebar.selected.setAttribute("style", `width: ${100 * position}%`)
                        this.form.audio.volume = position
                    })
                    el.addEventListener("mousemove", (event) => {
                        if (this.form.volumebar.updateStyle) {
                            // Получение координаты и вычисление позиции (от 0 до 1)
                            var cursorX = this._getPosInElement(el, event).x;
                            var position = cursorX / el.clientWidth;
                            if (position < 0) position = 0;
                            if (position > 1) position = 1;
                            // Обновление ширины текущей позиции
                            this.form.volumebar.selected.setAttribute("style", `width: ${100 * position}%`)
                            this.form.audio.volume = position
                        }
                    })
                })
            },
            // Оверлеи
            overlays: {
                _root: createElement('div', {
                    name: 'overlay'
                }, (el) => {

                }),
                bottom: createElement('div', {
                    name: 'overlay-bottom'
                })
            }
        }

        // Генерация формы
        this.form.progressbar.popup.appendChild(this.form.progressbar.popup.image)
        this.form.progressbar.popup.appendChild(this.form.progressbar.popup.text)

        this.form.progressbar._root.appendChild(this.form.progressbar.popup)
        this.form.progressbar._root.appendChild(this.form.progressbar.line)
        this.form.progressbar._root.appendChild(this.form.progressbar.loaded)
        this.form.progressbar._root.appendChild(this.form.progressbar.played)

        this.form.volumebar._root.appendChild(this.form.volumebar.line)
        this.form.volumebar._root.appendChild(this.form.volumebar.selected)

        this.form.overlays.bottom.appendChild(this.form.buttons.play)
        this.form.overlays.bottom.appendChild(this.form.buttons.backward10)
        this.form.overlays.bottom.appendChild(this.form.buttons.forward10)
        this.form.overlays.bottom.appendChild(this.form.buttons.volume)
        this.form.overlays.bottom.appendChild(this.form.volumebar._root)
        this.form.overlays.bottom.appendChild(this.form.time)
        this.form.overlays.bottom.appendChild(createElement('div', {
            'style': 'flex: auto'
        }))
        if ('pictureInPictureEnabled' in document && !(navigator.userAgent.search(/YaBrowser/) > 0)) this.form.overlays.bottom.appendChild(this.form.buttons.pip);
        this.form.overlays.bottom.appendChild(this.form.buttons.fullscreen);

        this.form.overlays._root.appendChild(this.form.overlays.bottom);
        this.form.overlays._root.appendChild(this.form.progressbar._root);

        this._element.appendChild(this.form.video);
        this._element.appendChild(this.form.audio);
        this._element.appendChild(this.form.subtitles);
        this._element.appendChild(this.form.overlays._root);
        this._element.appendChild(this.form.settings._root);
        this._element.appendChild(this.form.logger);

        // Информация для гиков
        setInterval(() => {
            this.form.logger.innerText = `  Количество игнорируемых действий с видео: ${this.form.video._ignoringAction}
                                            Количество игнорируемых действий с аудио: ${this.form.audio._ignoringAction}
                                            Ожидание загрузки видео: ${this.form.video._isWaiting}
                                            Ожидание загрузки аудио: ${this.form.audio._isWaiting}
                                            Разрыв дорожек: ${Math.floor(Math.abs(this.form.video.currentTime - this.form.audio.currentTime)*1000)/1000}`;
        }, 5);
    }
}