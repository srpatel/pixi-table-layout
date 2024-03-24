import { Style, Themes } from '../layout/Style';
import SizeableContainer from '../primitives/SizeableContainer';
import Table from '../layout/Table';

export default abstract class Component extends SizeableContainer {
    private _style: Style = null;
    constructor() {
        super();

        this.on('added', this.onAdded.bind(this));
    }

    onAdded() {
        this.updateStyle();
    }

    set style(style: Style) {
        this._style = style;

        this.updateStyle();
    }
    get style() {
        if (this._style) return this._style;
        let currentParent = this.parent;
        let table: Table = null;
        do {
            if (!currentParent) break;
            if (currentParent instanceof Table) {
                table = currentParent;
                break;
            }
            currentParent = currentParent.parent;
        } while (currentParent);
        if (table) {
            return table.style;
        }
        return Themes.Default;
    }

    updateStyle(): void {}
}
