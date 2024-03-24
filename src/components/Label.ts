import * as PIXI from 'pixi.js';
import Component from './Component';
import { DefaultSizes } from '../layout/Style';

/*
Text component. Wrapper around BitmapText, will draw itself within given bounds.
Text will scale to fit bounds.
Horizontally aligned according to alignment.
Vertically centered.
*/
export default class Label extends Component {
    private bitmapText: PIXI.BitmapText;
    private _align: PIXI.TextStyleAlign;
    private _wordWrap: boolean;
    constructor(text: string, align: PIXI.TextStyleAlign = 'center', wordWrap = false) {
        super();

        this._align = align;
        this._wordWrap = wordWrap;

        // Get Font from style
        this.bitmapText = new PIXI.BitmapText();
        this.bitmapText.text = text;
        this.addChild(this.bitmapText);

        this.setSize(DefaultSizes.Label.width, DefaultSizes.Label.height);
    }

    get text() {
        return this.bitmapText.text;
    }

    set text(s: string) {
        this.bitmapText.text = s;
        this.onSizeChanged();
    }

    get align() {
        return this._align;
    }

    set align(a: PIXI.TextStyleAlign) {
        this._align = a;
        this.updateStyle();
    }

    get wordWrap() {
        return this._wordWrap;
    }

    set wordWrap(w: boolean) {
        this._wordWrap = w;
        this.updateStyle();
    }

    updateStyle(): void {
        super.updateStyle();
        this.bitmapText.style = this.style.Text;
        this.bitmapText.style.align = this.align;
        this.bitmapText.style.wordWrap = this.wordWrap;
        this.bitmapText.tint = this.style.ShadowColour;
        this.onSizeChanged();
    }

    onSizeChanged(): void {
        super.onSizeChanged();
        // set scale of label to fit
        this.bitmapText.scale.set(1);
        this.bitmapText.style.wordWrapWidth = this.width;
        const scale = Math.min(this.width / this.bitmapText.width, this.height / this.bitmapText.height, 1);
        this.bitmapText.scale.set(scale);
        if (this.align == 'center' || this.align == 'justify') {
            this.bitmapText.x = (this.width - this.bitmapText.width) / 2;
        } else if (this.align == 'right') {
            this.bitmapText.x = this.width - this.bitmapText.width;
        } else if (this.align == 'left') {
            this.bitmapText.x = 0;
        }

        this.bitmapText.y = (this.height - this.bitmapText.height) / 2;
    }
}
