import * as PIXI from 'pixi.js';

export type Basis = number | string | null;

export interface Element {
    container: PIXI.Container;
    strategy: SizingStrategy | null;
    anchor: PIXI.Point | null;
    originalSize: PIXI.Point | null;
}

export abstract class BasisHaver {
    basis: Basis;
    constructor(basis: Basis) {
        this.basis = basis;
    }
}

export class Row extends BasisHaver {
    cells: Array<Cell> = [];
};

export class Cell extends BasisHaver {
    elements: Array<Element> = [];
};

export const CellAnchor = {
    TopLeft: new PIXI.Point(0, 0),
    Top: new PIXI.Point(0.5, 0),
    TopRight: new PIXI.Point(1, 0),
    Left: new PIXI.Point(0, 0.5),
    Middle: new PIXI.Point(0.5, 0.5),
    Right: new PIXI.Point(1, 0.5),
    BottomLeft: new PIXI.Point(0, 1),
    Bottom: new PIXI.Point(0.5, 1),
    BottomRight: new PIXI.Point(1, 1),
};

// The namings of these aren't clear?
export type SizingStrategy =
    | null // place only, do not set size
    | 'contain' // cover as much as possible without overflowing, maintaining aspect ratio
    | 'cover' // completely cover the space, maintaining aspect ratio (might overflow)
    | 'cover!'
    | 'stretch' // set size to cell size -- this is a common one. i think it should be given a nicer name
    | 'grow' // grow to fit, keeping aspect ratio
    | 'shrink' // shrink to fit, keeping aspect ratio
    | 'grow!' // grow to fit, ignoring aspect ratio
    | 'shrink!'; // shrink to fit, ignoring aspect ratio