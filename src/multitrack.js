import "./style.scss";
import { init } from "./internal/init";
import { play, pause, rewind, setTime, synchronize } from "./internal/playback";
import { sleep } from "./internal/utils";
//import { ASS } from 'assjs'

export default class {
  get trySync(){
    return this._.enable_sync;
  }

  set trySync(val){
    const root = this;
    if(val == true) val = true;
    if(val == false) val = false;
    const old = this._.enable_sync;
    this._.enable_sync = val;

    if(val == true && old != true){
      (async function(){
        let now = Date.now() - 1000;
        while(root._.enable_sync){
          if(Date.now() - now > 900) {
            await synchronize(root);
            now = Date.now();
          }else{
            await sleep(1000);
          }
        }
      })()
    }
  }

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

  sync() {
    synchronize.call(this);
  }
}
