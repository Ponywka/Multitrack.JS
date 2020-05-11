import "./style.scss";
import { init } from "./internal/init";
import { play, pause, rewind, setTime } from "./internal/playback";
//import { ASS } from 'assjs'

export default class {
    constructor(selector, dataArray) {
        init.call(this, selector, dataArray);
        return this;
    }

    play() {
        play.call(this);
    }

    pause() {
        pause.call(this);
    }

    rewind(val) {
        rewind.call(this, val);
    }

    setTime(val) {
        setTime.call(this, val);
    }

    mute(val) {
        mute.call(this, val);
    }

    resize() {
        if (this._.ass !== undefined) this._.ass.resize();
    }
}
