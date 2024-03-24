import { Panel } from '..';
import Component from './Component';
import { DefaultSizes } from '../layout/Style';

export default class Button extends Component {
    protected static readonly OVERLAP = 10;
    protected foreground = new Panel();
    private background = new Panel();
    private onClick: () => void;
    constructor(onClick: () => void) {
        super();

        this.onClick = onClick;

        // Disabled?
        
        // Add two panels on top of each other
        this.background.y = Button.OVERLAP;
        this.foreground.position.y = 0;

        this.addChild(this.background);
        this.addChild(this.foreground);

        // Initial size
        this.setSize(DefaultSizes.Button.width, DefaultSizes.Button.height);

        this.cursor = "pointer";
        this.eventMode = "static";

        this.on("pointerover", this.onPointerOver.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
        this.on("pointerdown", this.onPointerDown.bind(this));
        this.on("pointerupoutside", this.onPointerUpOutside.bind(this));
        this.on("pointerup", this.onPointerUp.bind(this));
    }

    onSizeChanged(): void {
        this.background.setSize(this.width, this.height - Button.OVERLAP);
        this.foreground.setSize(this.width, this.height - Button.OVERLAP);
    }

    updateStyle() {
        this.background.tint = this.style.ShadowColour;
        this.foreground.tint = this.style.ForegroundColour;
    }

    onPointerOver() {
    }
    onPointerOut() {
    }
    onPointerDown() {
        this.foreground.y = Button.OVERLAP;
        this.background.visible = false;
    }
    onPointerUpOutside() {
        this.foreground.y = 0;
        this.background.visible = true;
    }
    onPointerUp() {
        this.onPointerUpOutside();
        this.onClick?.();
    }
}