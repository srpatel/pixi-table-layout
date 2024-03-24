import * as PIXI from 'pixi.js';
import Button from './Button';

export default class TextButton extends Button {
    private bitmapText: PIXI.BitmapText;
    constructor(text: string, onClick: () => void) {
        super(onClick);

        // Get Font from style
        this.bitmapText = new PIXI.BitmapText();
        this.bitmapText.text = text;
        this.bitmapText.anchor.set(0.5);
        this.foreground.addChild(this.bitmapText);

        this.onSizeChanged();
    }

    updateStyle(): void {
        super.updateStyle();
        this.bitmapText.style = this.style.Text;
        this.bitmapText.tint = this.style.ShadowColour;
    }

    onSizeChanged(): void {
        super.onSizeChanged();
        if (this.bitmapText) {
            this.bitmapText.position.set(this.foreground.width / 2, this.foreground.height / 2);
            // set scale of label to fit
            this.bitmapText.scale.set(1);
            const scale = Math.min(
                this.foreground.width / this.bitmapText.width,
                this.foreground.height / this.bitmapText.height,
                1
            );
            this.bitmapText.scale.set(scale);
        }
    }
}
