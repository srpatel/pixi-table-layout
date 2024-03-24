import * as PIXI from 'pixi.js';
import { Panel } from '..';
import Component from './Component';
import { DefaultSizes } from '../layout/Style';

export type CheckboxType = 'cross' | 'circle';

export default class Checkbox extends Component {
    private static readonly OVERLAP = 10;
    private _checked: boolean;
    private pip: PIXI.Sprite;
    private background: PIXI.Container;
    private onToggle: (checked: boolean) => void;
    constructor(
        onToggle: (checked: boolean) => void = null,
        innerType: CheckboxType = 'cross',
        outerType: CheckboxType = null
    ) {
        super();

        this.onToggle = onToggle;

        if (!outerType) {
            outerType = innerType;
        }
        if (outerType == 'circle') {
            this.background = PIXI.Sprite.from('simple-ui/circle.png');
        } else {
            this.background = new Panel();
        }

        this.pip = PIXI.Sprite.from('simple-ui/' + innerType + '.png');
        this.pip.anchor.set(0.5);
        this.pip.alpha = 0;

        // Add two panels on top of each other
        this.addChild(this.background);
        this.addChild(this.pip);

        this.setSize(DefaultSizes.Button.height, DefaultSizes.Button.height);

        this.cursor = 'pointer';
        this.eventMode = 'static';

        this.on('pointerover', this.onPointerOver.bind(this));
        this.on('pointerout', this.onPointerOut.bind(this));
        this.on('pointerdown', this.onPointerDown.bind(this));
        this.on('pointerupoutside', this.onPointerUpOutside.bind(this));
        this.on('pointerup', this.onPointerUp.bind(this));
    }

    onSizeChanged(): void {
        this.background.setSize(this.width, this.height);
        this.pip.position.set(this.width / 2, this.height / 2);
        const scale = Math.min(
            (this.width * 0.5) / this.pip.texture.width,
            (this.height * 0.5) / this.pip.texture.height
        );
        this.pip.scale.set(scale);
    }

    updateStyle() {
        this.background.tint = this.style.ForegroundColour;
        this.pip.tint = this.style.ShadowColour;
    }

    set checked(c: boolean) {
        if (this._checked == c) return;
        this._checked = c;
        this.pip.alpha = this.checked ? 1 : 0;
    }

    get checked() {
        return this._checked;
    }

    onPointerOver() {
        // Show pip at half opacity
        this.pip.alpha = 0.5;
    }
    onPointerOut() {
        // Return pip to appropriate opacity
        this.pip.alpha = this.checked ? 1 : 0;
    }
    onPointerDown() {}
    onPointerUpOutside() {
        this.pip.alpha = this.checked ? 1 : 0;
    }
    onPointerUp() {
        this.checked = !this.checked;
        this.onToggle?.(this.checked);
    }
}
