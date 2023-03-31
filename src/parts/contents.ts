import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Text } from "./text";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _num: number = 3;
  private _text: Array<Text> = [];
  private _emojis: Array<string> = ["😀", "😊", "😎", "😜", "🤔", "🤑", "🤩", "🥳", "🤗", "😴", "😷", "🤢", "🤯", "🤖", "👻", "👽"];

  constructor(opt:any) {
    super(opt)

    for(let i = 0; i < this._num; i++) {
      const el = document.createElement('div');
      el.classList.add('js-text')

      const el_p = document.createElement('p');
      el_p.classList.add('js-text-org');
      el_p.innerHTML = Util.randomArr(this._emojis);
      el.append(el_p);

      const el_div = document.createElement('div');
      el_div.classList.add('js-text-blocks');
      el.append(el_div);

      document.querySelector('main')?.append(el);

      this._text.push(
        new Text({
          el: el
        })
      );
    }

    this._change();
  }

  private _change(): void {
    this._text.forEach((val) => {
      val.change(Util.randomArr(this._emojis))
    })
  }

  protected _update(): void {
    super._update();

    if(this._c % (60 * 3) == 0) {
      this._change();
    }
  }
}