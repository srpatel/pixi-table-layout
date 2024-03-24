import * as PIXI from 'pixi.js';
import Component from './Component';
import { DefaultSizes } from '../layout/Style';

export default class Divider extends Component {
    private sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
    constructor() {
        super();

        this.sprite.anchor.set(0.5, 0);
        this.addChild(this.sprite);

        this.setSize(DefaultSizes.Divider.width, DefaultSizes.Divider.height);
    }

    updateStyle() {
        this.sprite.tint = this.style.ShadowColour;
    }

    onSizeChanged(): void {
        this.sprite.x = this.width / 2;
        this.sprite.width = this.width * DefaultSizes.Divider.proportion;
        this.sprite.height = this.height;
    }
}
