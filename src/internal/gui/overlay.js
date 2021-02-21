import { createElement } from "../utils";

export function generateOverlay() {
  let GUItimeout;
  this._.element.addEventListener("mousemove", () => {
    this._.form.overlays._root.removeAttribute("style");
    clearTimeout(GUItimeout);
    GUItimeout = setTimeout(() => {
      this._.form.overlays._root.setAttribute(
        "style",
        "opacity: 0; cursor: none;"
      );
    }, 3000);
  });
  this._.element.addEventListener("mouseout", () => {
    clearTimeout(GUItimeout);
    this._.form.overlays._root.setAttribute("style", "opacity: 0;");
  });

  this._.form.overlays = {
    _root: createElement(
      "div",
      {
        name: "overlay",
      },
      (el) => {}
    ),
    bottom: createElement("div", {
      name: "overlay-bottom",
    }),
    top: createElement("div", {
      name: "overlay-top",
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
      this.playing ? this.pause() : this.play();
    }
  });
}
