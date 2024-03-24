import * as PIXI from 'pixi.js';

export default abstract class SizeableContainer extends PIXI.Container {
    private _width: number;
    private _height: number;

    setSize(value: number | PIXI.Optional<PIXI.Size, 'height'>, height?: number): void {
        let convertedWidth: number;
        let convertedHeight: number;

        if (typeof value !== 'object') {
            convertedWidth = value;
            convertedHeight = height ?? value;
        } else {
            convertedWidth = value.width;
            convertedHeight = value.height ?? value.width;
        }

        this._width = convertedWidth;
        this._height = convertedHeight;
        this.onSizeChanged();
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this.onSizeChanged();
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this.onSizeChanged();
    }

    onSizeChanged() {}
}
