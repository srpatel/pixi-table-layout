import * as PIXI from 'pixi.js';
import SizeableContainer from '../primitives/SizeableContainer';
import { Style, Themes } from './Style';

// null, 20, "20%"
type Basis = number | string | null;

interface Element {
    container: PIXI.Container;
    strategy: SizingStrategy | null;
    anchor: PIXI.Point | null;
    originalSize: PIXI.Point | null;
}

interface BasisHaver {
    basis: Basis;
}

type Row = BasisHaver & {
    cells: Array<Cell>;
};
type Cell = BasisHaver & {
    elements: Array<Element>;
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
type SizingStrategy =
    | null // place only, do not set size
    | 'contain' // cover as much as possible without overflowing, maintaining aspect ratio
    | 'cover' // completely cover the space, maintaining aspect ratio (might overflow)
    | 'cover!'
    | 'stretch' // set size to cell size -- this is a common one. i think it should be given a nicer name
    | 'grow' // grow to fit, keeping aspect ratio
    | 'shrink' // shrink to fit, keeping aspect ratio
    | 'grow!' // grow to fit, ignoring aspect ratio
    | 'shrink!'; // shrink to fit, ignoring aspect ratio

// TODO : grow-to-fit, with and without aspect ratio
/**
 * A layout is a container which automatically lays out the children according to a table-based layout.
 */
export default class Table extends SizeableContainer {
    private rows: Array<Row> = [];
    private elements: Array<Element> = [];

    private previousRow: Row = null;
    private previousCell: Cell = null;

    private hasChildrenChanged = false;

    private debugGraphic: PIXI.Graphics = null;

    private _style: Style = Themes.Default;
    set style(style: Style) {
        if (style) {
            this._style = style;
        } else {
            this._style = Themes.Default;
        }
    }
    get style() {
        return this._style;
    }

    onSizeChanged() {
        this.update();
    }

    get debug(): boolean {
        return !!this.debugGraphic;
    }

    set debug(d: boolean) {
        if (d) {
            this.debugGraphic = new PIXI.Graphics();
            this.addChild(this.debugGraphic);
            this.update();
        } else if (this.debugGraphic) {
            this.removeChild(this.debugGraphic);
            this.debugGraphic = null;
        }
    }

    row(basis: Basis = null) {
        const r: Row = {
            basis,
            cells: [],
        };
        this.rows.push(r);
        this.previousRow = r;
        this.previousCell = null;
        return this;
    }

    cell(basis: Basis = null) {
        if (!this.previousRow) {
            throw new Error('You must start a row first');
        }
        const c: Cell = {
            basis,
            elements: [],
        };
        this.previousRow.cells.push(c);
        this.previousCell = c;

        return this;
    }

    element(e: PIXI.Container, strategy: SizingStrategy | PIXI.Point = null, anchor: PIXI.Point = null) {
        if (!this.previousRow) {
            throw new Error('You must start a row first');
        }
        let sizingStrategy: SizingStrategy = null;
        if (strategy instanceof PIXI.Point) {
            // If you only supply an anchor, don't size element
            anchor = strategy;
            sizingStrategy = null;
        } else {
            sizingStrategy = strategy;
        }

        if (!this.previousCell) {
            // Add a cell which occupies the entire row, and add elements here
            this.cell();
        }

        this.previousCell.elements.push({
            container: e,
            strategy: sizingStrategy,
            anchor,
            originalSize: new PIXI.Point(e.width, e.height),
        });

        this.hasChildrenChanged = true;

        return this;
    }

    private calcSizes(availableSize: number, items: Array<BasisHaver>): Array<number> {
        const outSizes = [];
        let remainingSize = availableSize;
        let numberNulls = 0;
        for (const i of items) {
            let size = 0;
            if (i.basis == null) {
                numberNulls++;
            } else if (typeof i.basis == 'string') {
                const percentage = parseFloat(i.basis);
                size = availableSize * (percentage / 100);
            } else {
                size = +i.basis;
            }
            if (isNaN(size)) {
                size = 0;
            }
            outSizes.push(size);
            remainingSize -= size;
        }
        // Go back and fix up the "remaining size" elements
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.basis == null) {
                outSizes[i] = remainingSize / numberNulls;
            }
        }
        return outSizes;
    }

    update() {
        if (this.hasChildrenChanged) {
            this.hasChildrenChanged = false;
            this.removeChildren();

            // Add all children
            for (const r of this.rows) {
                for (const c of r.cells) {
                    for (const e of c.elements) {
                        this.addChild(e.container);
                    }
                }
            }
        }

        if (this.debug) {
            this.addChild(this.debugGraphic);
            this.debugGraphic.clear();
            this.debugGraphic.rect(0, 0, this.width, this.height).stroke({ width: 1, color: 0xff0000 });
        }

        const rowSizes = this.calcSizes(this.height, this.rows);
        let currentY = 0;
        for (let i = 0; i < this.rows.length; i++) {
            const row = this.rows[i];
            const rsize = rowSizes[i];

            // Lay out the cells...
            const cellSizes = this.calcSizes(this.width, row.cells);
            let currentX = 0;
            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                const csize = cellSizes[j];

                if (this.debug) {
                    this.debugGraphic.rect(currentX, currentY, csize, rsize).stroke({ width: 1, color: 0xff0000 });
                }

                for (let k = 0; k < cell.elements.length; k++) {
                    const { container, strategy, originalSize, anchor } = cell.elements[k];
                    // Size
                    let targetWidth = originalSize.x;
                    let targetHeight = originalSize.y;
                    if (strategy == 'cover!' || strategy == 'stretch') {
                        // Fill the space as much as possible, maintaining aspect ratio
                        [targetWidth, targetHeight] = [csize, rsize];
                    } else if (strategy == 'cover') {
                        // Cover the space, maintaining aspect ratio
                        const scale = Math.max(csize / originalSize.x, rsize / originalSize.y);
                        [targetWidth, targetHeight] = [originalSize.x * scale, originalSize.y * scale];
                    } else if (strategy == 'contain') {
                        // Shrink to fit, maintaining aspect ratio
                        const scale = Math.min(csize / originalSize.x, rsize / originalSize.y);
                        [targetWidth, targetHeight] = [originalSize.x * scale, originalSize.y * scale];
                    } else if (strategy == 'shrink!' || strategy == 'shrink') {
                        // Shrink to fit
                        if (originalSize.x > csize || originalSize.y > rsize) {
                            if (strategy == 'shrink!') {
                                [targetWidth, targetHeight] = [
                                    Math.min(originalSize.x, csize),
                                    Math.min(originalSize.y, rsize),
                                ];
                            } else {
                                const xscale = Math.min(originalSize.x, csize) / originalSize.x;
                                const yscale = Math.min(originalSize.y, rsize) / originalSize.y;
                                const scale = Math.min(xscale, yscale);
                                [targetWidth, targetHeight] = [originalSize.x * scale, originalSize.y * scale];
                            }
                        } else {
                            [targetWidth, targetHeight] = [originalSize.x, originalSize.y];
                        }
                    } else if (strategy == 'grow!' || strategy == 'grow') {
                        // Grow to fit
                        if (originalSize.x < csize || originalSize.y < rsize) {
                            if (strategy == 'grow!') {
                                [targetWidth, targetHeight] = [
                                    Math.max(originalSize.x, csize),
                                    Math.max(originalSize.y, rsize),
                                ];
                            } else {
                                const xscale = Math.max(originalSize.x, csize) / originalSize.x;
                                const yscale = Math.max(originalSize.y, rsize) / originalSize.y;
                                const scale = Math.min(xscale, yscale);
                                [targetWidth, targetHeight] = [originalSize.x * scale, originalSize.y * scale];
                            }
                        } else {
                            [targetWidth, targetHeight] = [originalSize.x, originalSize.y];
                        }
                    }
                    container.width = targetWidth;
                    container.height = targetHeight;

                    // Position according to anchor
                    let ax = 0.5;
                    let ay = 0.5;
                    if (anchor) {
                        ax = anchor.x ?? 0.5;
                        ay = anchor.y ?? ax;
                    }
                    // Anchor applies to container AND to sprite
                    // that is to say, 0.5 aligns middle of component to middle of cell
                    container.position.set(
                        currentX + (csize - container.width) * ax,
                        currentY + (rsize - container.height) * ay
                    );
                }
                currentX += csize;
            }

            currentY += rsize;
        }
    }
}
