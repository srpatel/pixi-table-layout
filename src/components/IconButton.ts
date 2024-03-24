import * as PIXI from 'pixi.js';
import Button from './Button';
import { DefaultSizes } from '../layout/Style';

export default class IconButton extends Button {
    private icon: PIXI.Sprite;
    constructor(icon: PIXI.Sprite, onClick: () => void) {
        super(onClick);

        this.icon = icon;
        this.icon.anchor.set(0.5);
        this.foreground.addChild(this.icon);

        this.setSize(DefaultSizes.Button.height, DefaultSizes.Button.height + Button.OVERLAP);

        this.onSizeChanged();
    }

    updateStyle(): void {
        super.updateStyle();
        this.icon.tint = this.style.ShadowColour;
    }

    onSizeChanged(): void {
        super.onSizeChanged();
        if (this.icon) {
            this.icon.position.set(this.foreground.width / 2, this.foreground.height / 2);
            // set scale of label to fit
            this.icon.scale.set(1);
            const scale = Math.min(
                (this.foreground.width * 0.8) / this.icon.width,
                (this.foreground.height * 0.8) / this.icon.height,
                1
            );
            this.icon.scale.set(scale);
        }
    }
}
