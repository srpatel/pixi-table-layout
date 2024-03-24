import * as PIXI from 'pixi.js';
import Component from './Component';

export default class Panel extends Component {
    private pane: PIXI.NineSliceSprite;
    constructor() {
        super();

        this.pane = new PIXI.NineSliceSprite(PIXI.Texture.from('simple-ui/rounded-md.png'));
        this.addChild(this.pane);

        this.setSize(200, 200);
    }

    updateStyle() {
        this.pane.tint = this.style.ForegroundColour;
    }

    onSizeChanged(): void {
        this.pane.width = this.width;
        this.pane.height = this.height;
    }
}
