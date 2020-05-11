class MultitrackJS {
    // Конструктор
    constructor(selector, dataArray) {
        this._name = "MultitrackJS";
        this._parameters = {
            frames: {
                x: 10,
                y: 10
            }
        }

        this._subtitlesDownloader = null

        this._parameters.videos = dataArray.videos
        this._parameters.audios = dataArray.audios
        this._parameters.subtitles = dataArray.subtitles

        this._element = document.querySelector(selector);
        if (this._element) {
            this._element.setAttribute("application-name", "multitrack-js")
            this._buildGUI()
            if (dataArray.placeholder) this.form.video.poster = dataArray.placeholder
            this._invisibleSync()

            this.form.title.innerText = dataArray.title

            if (dataArray.preview) this._parameters.frames.image = dataArray.preview
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

    setVolume(val) {
        if (val < 0) val = 0;
        if (val > 1) val = 1;
        this.form.buttons.volume.setAttribute("icon", Math.ceil(val * 3))
        this.form.volumebar.selected.setAttribute("style", `width: ${100 * val}%`)
        this.form.audio.volume = val
    }

    resize() {
        if (this.ass !== undefined) this.ass.resize()
    }

    _setVideo(link) {
        this._servicePlayingVideo(false)
        this._changeIsWaitingVideo(true)
        this.form.video.src = link
        this.form.video.currentTime = this.form.audio.currentTime;
        if (this.playing) this._servicePlayingVideo(true)
    }

    _setAudio(link) {
        let time = this.form.audio.currentTime
        this._servicePlayingAudio(false)
        this._changeIsWaitingAudio(true)
        this.form.audio.src = link
        this.form.audio.currentTime = time
        if (this.playing) this._servicePlayingAudio(true)
    }

    downloadSubtitles(url) {
        clearTimeout(this._subtitlesDownloader)
        this._subtitlesDownloader = setTimeout(() => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send();
            if (xhr.status == 200) {
                this.setSubtitles(xhr.responseText);
            } else {
                alert(xhr.status + ': ' + xhr.statusText);
            }
        })
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

    mute(val = true) {
        if (this.form.audio.volume != 0) {
            this.form.audio.lastVolume = this.form.audio.volume;
            this.setVolume(0);
        } else if (!val) {
            this.setVolume(this.form.audio.lastVolume);
        }
    }

    toggleFullscreen() {
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
            this.form.buttons.fullscreen.setAttribute('name', 'fullscreenOn');
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
            this.form.buttons.fullscreen.setAttribute('name', 'fullscreenOff');
        }
    }

    toggleSettings() {
        if (!this.form.settings.opened) {
            this.form.overlays._root.setAttribute('style', 'display: none');
            this.form.settings._root.removeAttribute('style');
        } else {
            this.form.settings._root.setAttribute('style', 'display: none');
            this.form.overlays._root.removeAttribute('style');
        }
        this.form.settings.opened = !this.form.settings.opened;
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
            this.form.video.onplaying = null;
            this.form.video.play().then(() => {
                this.form.video.onplaying = this.form.video._onplaying;
            })
        } else {
            this.form.video.onpause = null;
            this.form.video.pause()
            setTimeout(() => {
                this.form.video.onpause = this.form.video._onpause;
            }, 16)
        }
    }

    _servicePlayingAudio(val) {
        console.trace(`_servicePlayingAudio(${val})`);
        if (val) {
            this.form.audio.onplaying = null;
            this.form.audio.play().then(() => {
                this.form.audio.onplaying = this.form.audio._onplaying;
            })
        } else {
            this.form.audio.onpause = null;
            this.form.audio.pause()
            setTimeout(() => {
                this.form.audio.onpause = this.form.audio._onpause;
            }, 16)
        }
    }

    _changePlaying(val) {
        console.trace(`_changePlaying(${val})`);
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
        this._moveEvents = [];
        document.addEventListener('mousemove', (event) => {
            for (let func of this._moveEvents) {
                func.move(event)
            }
        })

        document.addEventListener('mouseup', (event) => {
            for (let func of this._moveEvents) {
                func.release(event)
            }
            this._moveEvents = [];
        })

        document.addEventListener("touchmove", (event) => {
            for (let func of this._moveEvents) {
                func.move(event.touches[0])
            }
        }, false)
        document.addEventListener("touchend", (event) => {
            for (let func of this._moveEvents) {
                console.log(event)
                func.release(event.changedTouches[0])
            }
            this._moveEvents = [];
        }, false)

        document.addEventListener('keydown', (event) => {
            console.log(event.code)
            switch (event.code) {
                case "Space":
                case "KeyK":
                    this.playing ? this.pause() : this.play();
                    break;
                case "ArrowLeft":
                    this.rewind(-5);
                    break;
                case "ArrowRight":
                    this.rewind(5);
                    break;
                case "KeyJ":
                    this.rewind(-10);
                    break;
                case "KeyL":
                    this.rewind(10);
                    break;
                case "KeyM":
                    this.mute(false);
                    break;
                case "ArrowUp":
                    if (this.form.audio.volume) this.form.audio.lastVolume = this.form.audio.volume;
                    this.setVolume(this.form.audio.volume + .05);
                    break;
                case "ArrowDown":
                    if (this.form.audio.volume) this.form.audio.lastVolume = this.form.audio.volume;
                    this.setVolume(this.form.audio.volume - .05);
                    break;
                case "KeyF":
                    this.toggleFullscreen();
                    break;
                case "Digit0":
                case "Numpad0":
                    this.setTime(this.duration * 0);
                    break;
                case "Digit1":
                case "Numpad1":
                    this.setTime(this.duration * 0.1);
                    break;
                case "Digit2":
                case "Numpad2":
                    this.setTime(this.duration * 0.2);
                    break;
                case "Digit3":
                case "Numpad3":
                    this.setTime(this.duration * 0.3);
                    break;
                case "Digit4":
                case "Numpad4":
                    this.setTime(this.duration * 0.4);
                    break;
                case "Digit5":
                case "Numpad5":
                    this.setTime(this.duration * 0.5);
                    break;
                case "Digit6":
                case "Numpad6":
                    this.setTime(this.duration * 0.6);
                    break;
                case "Digit7":
                case "Numpad7":
                    this.setTime(this.duration * 0.7);
                    break;
                case "Digit8":
                case "Numpad8":
                    this.setTime(this.duration * 0.8);
                    break;
                case "Digit9":
                case "Numpad9":
                    this.setTime(this.duration * 0.9);
                    break;

            }
        })

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

        this._element.addEventListener('contextmenu', (event) => {
            if (event.target.nodeName != "A") {
                event.preventDefault();
                this.toggleSettings()
                return false;
            }
        }, false);

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
                // Обработка событий плей/пауза
                el._onplaying = () => {
                    console.log("VIDEO PLAY")
                    this._changePlaying(true)
                }
                el.onplaying = el._onplaying
                el._onpause = (event) => {
                    console.log("VIDEO PAUSE")
                    if (el === document.pictureInPictureElement || this._pageFocused || el._leavedFromPiP) {
                        console.log("(video) PLAYBACK IS STOP!")
                        this._changePlaying(false)
                        el._leavedFromPiP = false
                    }
                }
                el.onpause = el._onpause
                // Обработка событий загрузки
                el.onwaiting = () => {
                    this._changeIsWaitingVideo(true)
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
                    this.form.buttons.pip.setAttribute('name', 'pipOn');
                    el._leavedFromPiP = true;
                })
            }),
            // Аудио
            audio: createElement('audio', {}, (el) => {
                // Обработка событий плей/пауза
                el._onplaying = () => {
                    console.log("AUDIO PLAY")
                    this._changePlaying(true)
                }
                el.onplaying = el._onplaying
                el._onpause = () => {
                    console.log("AUDIO PAUSE")
                    this._changePlaying(false)
                }
                el.onpause = el._onpause;
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
            // Отображение названия
            title: createElement('div', {
                name: 'title'
            }, (el) => {
                el.innerText = "Loading...";
            }),
            // Информация для гиков
            logger: createElement('div', {
                name: 'logger'
            }),
            // Окно настроек
            settings: {
                opened: false,
                tabs: {
                    quality: {
                        titlename: "Качество",
                        icon: "quality",
                        _root: createElement('div')
                    },
                    dubs: {
                        titlename: "Озвучки",
                        icon: "dubs",
                        _root: createElement('div')
                    },
                    subtitles: {
                        titlename: "Субтитры",
                        icon: "subtitles",
                        _root: createElement('div')
                    },
                    info: {
                        titlename: "Информация",
                        icon: "info",
                        _root: createElement('div', {
                            'blockName': 'info'
                        }, (el) => {
                            el.innerHTML += '<a href="https://forms.gle/gTrxarVsZoof3CyW6" target="_blank" style="color: #ffccff; font-size: 24px">Баг-репорт</a> (перед отправкой проверьте ссылку ниже, возможно этот баг уже известен!)'
                            let authorBlock = createElement('div', {
                                'style': 'display: flex; padding: 12px 0px'
                            }, (bl) => {
                                bl.appendChild(createElement('img', {
                                    src: "https://avatars2.githubusercontent.com/u/26777464?s=96",
                                    width: 48,
                                    height: 48
                                }))
                                bl.appendChild(createElement('div', {
                                    'style': 'line-height: 20px; padding: 4px 8px'
                                }, (inf) => {
                                    inf.innerHTML += "Исходный код плеера:<br><a href=\"https://github.com/Ponywka/Multitrack.JS\" style=\"color: #ffccff\">Ponywka/Multitrack.JS</a>"
                                    inf.innerHTML += "<!--| Да, Somepony, ты дождался его! |-->"
                                }))

                            })
                            el.appendChild(authorBlock)
                        })
                    }
                },
                tabSwitcher: {
                    _root: createElement('div', {
                        name: 'tabs',
                    })
                },
                title: createElement('div', {
                    name: 'title',
                }),
                header: createElement('div', {
                    name: 'settingsHeader'
                }),
                body: createElement('div', {
                    name: 'settingsBody'
                }),
                _root: createElement('div', {
                    name: 'settings',
                    style: 'display: none'
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
                        this.toggleFullscreen();
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
                        this.mute(false);
                    })
                }),
                // Открыть меню
                openmenu: createElement('button', {
                    name: 'openmenu'
                }, (el) => {
                    el.addEventListener('click', () => {
                        this.toggleSettings()
                    })
                }),
                closemenu: createElement('button', {
                    name: 'closemenu'
                }, (el) => {
                    el.addEventListener('click', () => {
                        this.toggleSettings()
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
                    let updatePopup = (cursorX, position) => {
                        // Обновление всплывающего пузырька
                        this.form.progressbar.popup.text.innerText = this._secondsToTime(this.duration * position);
                        if (this.form.progressbar.popup.clientWidth != 0) {
                            this.form.progressbar.popup.halfWidth = this.form.progressbar.popup.clientWidth / 2;
                        }
                        if (cursorX < this.form.progressbar.popup.halfWidth) {
                            this.form.progressbar.popup.setAttribute('style', `left: 0px`);
                        } else if (cursorX < (el.clientWidth - this.form.progressbar.popup.halfWidth)) {
                            this.form.progressbar.popup.setAttribute('style', `left: ${cursorX - this.form.progressbar.popup.halfWidth}px`);
                        } else {
                            this.form.progressbar.popup.setAttribute('style', `left: ${el.clientWidth - this.form.progressbar.popup.halfWidth * 2}px`);
                        }
                        // Отображение нужного тайла на экран
                        if (this._parameters.frames.image) {
                            var framesAll = this._parameters.frames.x * this._parameters.frames.y;
                            var frame = Math.floor(position * framesAll);
                            if (frame >= framesAll) frame = framesAll - 1;
                            var offsetX = (frame % this._parameters.frames.x) / (this._parameters.frames.x - 1);
                            var offsetY = Math.floor(frame / this._parameters.frames.x) / (this._parameters.frames.y - 1);
                            this.form.progressbar.popup.image.setAttribute('style', `
                                background-position: ${offsetX * 100}% ${offsetY * 100}%;
                                background-size: ${this._parameters.frames.x * 100}%;
                                background-image: url(${this._parameters.frames.image})`);

                        } else {
                            this.form.progressbar.popup.image.setAttribute('style', 'display: none')
                        }
                    }

                    let move = (event) => {
                        // Получение координаты и вычисление позиции (от 0 до 1)
                        var cursor = this._getPosInElement(el, event);
                        var position = cursor.x / el.clientWidth;
                        if (position < 0) position = 0;
                        if (position > 1) position = 1;
                        // Обновление ширины текущей позиции
                        if (this.form.progressbar.updateStyle) {
                            this.form.progressbar.played.setAttribute("style", `width: ${100 * position}%`)
                        }
                        updatePopup(cursor.x, position)
                    }
                    let release = (event) => {
                        this.form.progressbar.updateStyle = false;
                        this.form.progressbar.popup.setAttribute('style', 'display: none');
                        this.setTime(this.duration * this._getPosInElement(el, event).x / el.clientWidth);
                    }
                    el.addEventListener("mousedown", (event) => {
                        this.form.progressbar.updateStyle = true
                        Object(this._moveEvents).push({
                            move: move,
                            release: release
                        })
                    })
                    el.addEventListener("touchstart", (event) => {
                        this.form.progressbar.updateStyle = true
                        Object(this._moveEvents).push({
                            move: move,
                            release: release
                        })
                    })

                    el.addEventListener("mousemove", (event) => {
                        var cursor = this._getPosInElement(el, event);
                        var position = cursor.x / el.clientWidth;
                        if (position < 0) position = 0;
                        if (position > 1) position = 1;
                        if (this.form.progressbar.updateStyle || cursor.y > 0) {
                            updatePopup(cursor.x, position)
                        } else {
                            this.form.progressbar.popup.setAttribute('style', 'display: none')
                        }
                    })
                    el.addEventListener("mouseout", (event) => {
                        this.form.progressbar.popup.setAttribute('style', 'display: none')
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
                    let release = (event) => {
                        this.form.volumebar.updateStyle = false
                        // Получение координаты и вычисление позиции (от 0 до 1)
                        var cursorX = this._getPosInElement(el, event).x;
                        var position = this._getPosInElement(el, event).x / el.clientWidth;
                        this.setVolume(position);
                    }
                    let move = (event) => {
                        if (this.form.volumebar.updateStyle) {
                            // Получение координаты и вычисление позиции (от 0 до 1)
                            var cursorX = this._getPosInElement(el, event).x;
                            var position = cursorX / el.clientWidth;
                            this.setVolume(position);
                        }
                    }
                    el.addEventListener("mousedown", () => {
                        this.form.volumebar.updateStyle = true
                        this.form.audio.lastVolume = this.form.audio.volume
                        Object(this._moveEvents).push({
                            move: move,
                            release: release
                        })
                    })
                    el.addEventListener("touchstart", () => {
                        this.form.volumebar.updateStyle = true
                        this.form.audio.lastVolume = this.form.audio.volume
                        Object(this._moveEvents).push({
                            move: move,
                            release: release
                        })
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
                }),
                top: createElement('div', {
                    name: 'overlay-top'
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

        this.form.overlays.top.appendChild(this.form.title)
        this.form.overlays.top.appendChild(this.form.buttons.openmenu)

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

        this.form.overlays._root.appendChild(this.form.overlays.top);
        this.form.overlays._root.appendChild(this.form.overlays.bottom);
        this.form.overlays._root.appendChild(this.form.progressbar._root);
        this.form.overlays._root.addEventListener("click", (event) => {
            if (event.target == this.form.overlays._root) {
                this.playing ? this.pause() : this.play();
            }
        })
        this.form.overlays._root.addEventListener("dblclick", (event) => {
            if (event.target === this.form.overlays._root) {
                this.toggleFullscreen()
            }
        }, false)
        let GUItimeout;
        this._element.addEventListener("mousemove", () => {
            if (!this.form.settings.opened) {
                this.form.overlays._root.removeAttribute('style')
                clearTimeout(GUItimeout)
                GUItimeout = setTimeout(() => {
                    this.form.overlays._root.setAttribute('style', 'opacity: 0; cursor: none')
                }, 3000)
            }
        })
        this._element.addEventListener("mouseout", () => {
            clearTimeout(GUItimeout)
            this.form.overlays._root.setAttribute('style', 'opacity: 0')
        })

        this.form.settings.body.appendChild(this.form.settings.tabSwitcher._root)
        const hideAllElements = () => {
            for (let page in this.form.settings.tabs) {
                this.form.settings.tabs[page]._root.setAttribute('style', 'display: none')
            }
        }
        let btnNum = 0;
        for (let el in this.form.settings.tabs) {
            this.form.settings.body.appendChild(this.form.settings.tabs[el]._root)
            this.form.settings.tabSwitcher[`btn${el}`] = createElement("div", {
                name: "listEl",
                page: el
            }, (btn) => {
                btn.appendChild(createElement("div", {
                    "name": "icon",
                    "icon": this.form.settings.tabs[el].icon
                }))
                btn.appendChild(createElement("span", {}, el1 => {
                    el1.innerText = this.form.settings.tabs[el].titlename
                }))

                //btn.innerText += this.form.settings.tabs[el].titlename
                btn.onclick = (event) => {
                    hideAllElements()
                    this.form.settings.tabs[el]._root.removeAttribute('style')
                    for (let el in this.form.settings.tabSwitcher) {
                        if (el != "_root") this.form.settings.tabSwitcher[el].removeAttribute('selected')
                    }
                    btn.setAttribute('selected', 'true')
                }
            })
            this.form.settings.tabSwitcher._root.appendChild(this.form.settings.tabSwitcher[`btn${el}`])
            if (btnNum == 0) this.form.settings.tabSwitcher[`btn${el}`].click()
            btnNum++;
        }

        btnNum = 0;
        for (let el of this._parameters.videos) {
            let btn = createElement("div", {
                name: "listEl",
                link: el.path
            }, (btn) => {
                btn.appendChild(createElement("span", {}, el1 => {
                    el1.innerText = el.name
                }))
                btn.onclick = (event) => {
                    for (let el1 of this.form.settings.tabs.quality._root.querySelectorAll("*")) el1.removeAttribute('selected')
                    btn.setAttribute('selected', 'true')
                    this._setVideo(el.path)
                }
            })
            this.form.settings.tabs.quality._root.appendChild(btn)
            if (btnNum == 0) btn.click()
            btnNum++;
        }

        btnNum = 0;
        for (let el of this._parameters.audios) {
            let btn = createElement("div", {
                name: "listEl",
                link: el.path
            }, (btn) => {
                btn.appendChild(createElement("span", {}, el1 => {
                    el1.innerText = el.name
                }))
                btn.onclick = (event) => {
                    for (let el1 of this.form.settings.tabs.dubs._root.querySelectorAll("*")) el1.removeAttribute('selected')
                    btn.setAttribute('selected', 'true')
                    this._setAudio(el.path)
                }
            })
            this.form.settings.tabs.dubs._root.appendChild(btn)
            if (btnNum == 0) btn.click()
            btnNum++;
        }

        let noSubtitles = createElement("div", {
            name: "listEl"
        }, (btn) => {
            btn.appendChild(createElement("span", {}, el1 => {
                el1.innerText = "Отключено"
            }))
            btn.onclick = (event) => {
                for (let el1 of this.form.settings.tabs.subtitles._root.querySelectorAll("*")) el1.removeAttribute('selected')
                btn.setAttribute('selected', 'true')
                this.setSubtitles()
                return false
            }
        })
        this.form.settings.tabs.subtitles._root.appendChild(noSubtitles)
        noSubtitles.click()
        for (let el of this._parameters.subtitles) {
            this.form.settings.tabs.subtitles._root.appendChild(createElement("div", {
                name: "listEl",
                link: el.path
            }, (btn) => {
                btn.appendChild(createElement("span", {}, el1 => {
                    el1.innerText = el.name
                }))
                btn.onclick = (event) => {
                    try {
                        for (let el1 of this.form.settings.tabs.subtitles._root.querySelectorAll("*")) el1.removeAttribute('selected')
                        btn.setAttribute('selected', 'true')
                        this.downloadSubtitles(el.path)
                    } catch (e) {
                        console.error(e)
                    }
                }
            }))
        }

        this.form.settings.title.innerText += "Настройки";
        this.form.settings.header.appendChild(this.form.settings.title);
        this.form.settings.header.appendChild(this.form.buttons.closemenu);

        this.form.settings._root.appendChild(this.form.settings.header);
        this.form.settings._root.appendChild(this.form.settings.body);

        this._element.appendChild(this.form.video);
        this._element.appendChild(this.form.audio);
        this._element.appendChild(this.form.subtitles);
        this._element.appendChild(this.form.overlays._root);
        this._element.appendChild(this.form.settings._root);
    }
}