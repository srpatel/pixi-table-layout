import * as PIXI from 'pixi.js';

export const DefaultSizes = {
    Button: {
        width: 150,
        height: 50,
    },
    Label: {
        width: 150,
        height: 50,
    },
    Divider: {
        width: 150,
        height: 2,
        proportion: 0.8,
    },
};

export type Style = {
    ShadowColour: PIXI.ColorSource;
    ForegroundColour: PIXI.ColorSource;
    Text: Partial<PIXI.TextStyle>;
};

export function makeStyle(style: Partial<Style>): Style {
    return {
        ...Themes.Default,
        ...style,
    };
}

export const Themes: { [key: string]: Style } = {
    Default: {
        ShadowColour: 0x333333,
        ForegroundColour: 0xffffff,
        Text: {},
    },
};
