import { createElement } from "../utils";

export function generateOverlay() {
  let GUItimeout;

  function showOverlay(){
    this._.rootElement.classList.remove("mjs__overlay_hidden");
    clearTimeout(GUItimeout);
    GUItimeout = setTimeout(() => {
      this._.rootElement.classList.add("mjs__overlay_hidden");
    }, 3000);
  }

  this._.element.addEventListener("mousemove", () => {
    showOverlay.call(this);
  });
  this._.element.addEventListener("touchmove", () => {
    showOverlay.call(this);
  });


  this._.element.addEventListener("mouseout", () => {
    const overlayEl = this._.form.overlays._root;
    clearTimeout(GUItimeout);
    this._.rootElement.classList.add("mjs__overlay_hidden");
  });

  this._.form.overlays = {
    _root: createElement(
      "div",
      {
        class: "mjs__overlay",
      },
      (el) => {}
    ),
    bottom: createElement("div", {
      class: "mjs__overlay-bottom",
    }),
    top: createElement("div", {
      class: "mjs__overlay-top",
    }),
  };

  this._.form.overlays.top.appendChild(this._.form.title);

  this._.form.overlays.bottom.appendChild(this._.form.buttons.play);
  this._.form.overlays.bottom.appendChild(this._.form.buttons.backward10);
  this._.form.overlays.bottom.appendChild(this._.form.buttons.forward10);
  this._.form.overlays.bottom.appendChild(this._.form.buttons.volume);
  this._.form.overlays.bottom.appendChild(this._.form.volumebar._root);
  this._.form.overlays.bottom.appendChild(this._.form.time);
  this._.form.overlays.bottom.appendChild(
    createElement("div", {
      style: "flex: auto",
    })
  );
  if ("pictureInPictureEnabled" in document) {
    this._.form.overlays.bottom.appendChild(this._.form.buttons.pip);
  }
  this._.form.overlays.bottom.appendChild(this._.form.buttons.menu);
  this._.form.overlays.bottom.appendChild(this._.form.buttons.fullscreen);

  this._.form.overlays._root.appendChild(this._.form.overlays.top);
  this._.form.overlays._root.appendChild(this._.form.overlays.bottom);
  this._.form.overlays._root.appendChild(this._.form.progressbar._root);
  this._.form.overlays._root.addEventListener("click", (event) => {
    if (event.target == this._.form.overlays._root) {
      this._.playing ? this.pause() : this.play();
    }
  });
}
