import { MyDisplay } from "../core/myDisplay";
import { Func } from "../core/func";
import { Tween } from "../core/tween";
import { TextItem } from "./textItem";
import { Util } from "../libs/util";
import { Val } from "../libs/val";
import { Point } from "../libs/point";

// -----------------------------------------
//
// -----------------------------------------
export class Text extends MyDisplay {

  private _parentTxt: HTMLElement;
  private _blocksEl: HTMLElement;

  private _line: number = 4;
  private _items: Array<TextItem> = [];

  private _fixRate: Val = new Val();
  private _showRate: Val = new Val();

  private _myPos: Point = new Point();

  constructor(opt:any) {
    super(opt)

    this._parentTxt = this.qs('.js-text-org') as HTMLElement;
    this._blocksEl = this.qs('.js-text-blocks') as HTMLElement;

    const num = this._line * this._line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      b.classList.add('js-text-item');
      this._blocksEl.append(b);
      b.append(this._parentTxt.cloneNode(true));

      const item = new TextItem({
        el: b,
        key: i,
      });
      this._items.push(item);
    }
    Util.shuffle(this._items);
  }


  private _updateItemSize(): void {
    const sw = Func.sw();
    const sh = Func.sh();

    const fontSize = Math.min(sw, sh) * Func.val(0.5, 0.4);
    Tween.set(this._parentTxt, {
      fontSize:  fontSize,
    });

    const txtSize = this.getRect(this._parentTxt);
    const txtWidth = txtSize.width;
    const txtHeight = txtSize.height;

    const blockWidth = txtWidth / this._line;
    const blockHeight = txtHeight / this._line;

    if(this._c % 20 == 0) {
      const rect = this.getOffset(this.el)
      this._myPos.x = rect.x;
      this._myPos.y = rect.y;
    }

    Tween.set(this._parentTxt, {
      x: 0,
      y: 0,
    })

    const r = ~~(Util.map(this._fixRate.val, 0, this._items.length - 1, 0, 1));

    this._items.forEach((val,i) => {
      const key = r >= i ? i : val.key;
      const fixKey = i;

      const ix = ~~(key / this._line);
      const iy = ~~(key % this._line);

      const ix2 = ~~(fixKey / this._line);
      const iy2 = ~~(fixKey % this._line);

      const x = ix * blockWidth;
      const y = iy * blockHeight;

      const x2 = ix2 * blockWidth;
      const y2 = iy2 * blockHeight;

      Tween.set(val.el, {
        width: blockWidth,
        height: blockHeight,
        left: x,
        top: y,
      })

      Tween.set(val.inner, {
        fontSize: fontSize,
      })

      val.center.x = this._myPos.x + blockWidth * 0.5;
      val.center.y = this._myPos.y + blockHeight * 0.5;

      val.pos.width = blockWidth;
      val.pos.x = x2 + blockWidth * 0.5;
      val.pos.y = y2 + blockHeight * 0.5;

      val.innerPos.x = -ix2 * blockWidth;
      val.innerPos.y = -iy2 * blockHeight;
    })
  }

  protected _update(): void {
    super._update();

    if((this._fixRate.isUse && this._c % 1 == 0) || this._c % 30 == 0) {
      this._updateItemSize();
    }

    Tween.set(this.el, {
      opacity: Util.map(this._showRate.val, 0, 1, 0.1, 0.35),
    })
  }

  public change(t: string): void {
    this.startNormal({
      onComplete: () => {
        this._parentTxt.innerHTML = t;
        this._items.forEach((val) => {
          val.inner.innerHTML = t;
        })
        this.startFix({delay:0})
      }
    })
  }

  public startFix(opt: any): void {
    Tween.a(this._fixRate, {
      val:[0, 1]
    }, 0.5, opt.delay, Tween.EaseNone, () => {
      this._fixRate.isUse = true;
    }, null, () => {
      this._fixRate.isUse = false;
    })

    Tween.a(this._showRate, {
      val:[0, 1]
    }, 0.5, opt.delay, Tween.EaseNone);
  }

  public startNormal(opt: any): void {
    Tween.a(this._fixRate, {
      val:[1, 0]
    }, 0.5, opt.delay, Tween.EaseNone, () => {
      this._fixRate.isUse = true;
    }, null, () => {
      this._fixRate.isUse = false;
    })

    Tween.a(this._showRate, {
      val:[1, 0]
    }, 0.5, opt.delay, Tween.EaseNone, null, null, () => {
      if(opt.onComplete != undefined) opt.onComplete();
    });
  }
}