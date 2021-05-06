import { createElement, logError } from "../utils";
import { toggleSettings } from "../gui/settings";
import { rewind } from "../playback";

export function toggleFullscreen() {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitsExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    this._.form.buttons.fullscreen.setAttribute("icon", "fullscreenOn");
  } else {
    var element = this._.element;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
    else {
      // For stupid users with iPhone
      element = this._.form.video;
      if (element.webkitEnterFullscreen) element.webkitEnterFullscreen();
    }
    this._.form.buttons.fullscreen.setAttribute("icon", "fullscreenOff");
  }
}

export function generateButtons() {
  this._.form.buttons = {
    // Плей/пауза
    play: createElement(
      "button",
      {
        icon: "playBtn",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.onclick = () => {
          this._.playing ? this.pause() : this.play();
        };
      }
    ),
    // Отмотать на 10 секунд
    backward10: createElement(
      "button",
      {
        icon: "backward10",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.onclick = () => {
          rewind.call(this, -10);
        };
      }
    ),
    // Перемотать на 10 секунд
    forward10: createElement(
      "button",
      {
        icon: "forward10",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.onclick = () => {
          rewind.call(this, 10);
        };
      }
    ),
    // Кнопка полного экрана
    fullscreen: createElement(
      "button",
      {
        icon: "fullscreenOn",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.onclick = (btn) => {
          toggleFullscreen.call(this);
        };
      }
    ),
    // Кнопка режима "Картинка-в-картинке"
    pip: createElement(
      "button",
      {
        icon: "pipOn",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.onclick = (btn) => {
          if ("pictureInPictureEnabled" in document) {
            if (this._.form.video !== document.pictureInPictureElement) {
              this._.form.video.requestPictureInPicture();
              el.setAttribute("icon", "pipOff");
            } else {
              document.exitPictureInPicture();
              el.setAttribute("icon", "pipOn");
            }
          } else {
            logError.call(
              this,
              "Sorry, your browser is not support picture-in-picture"
            );
          }
        };
      }
    ),
    // Открыть меню
    menu: createElement(
      "button",
      {
        icon: "menu",
        class: "mjs__overlay-button",
      },
      (el) => {
        el.addEventListener("click", () => {
          toggleSettings.call(this);
        });
      }
    ),
  };
}
