import { MutableRefObject } from 'react';

const getPanelRotation = (
    panelRef: MutableRefObject<HTMLDivElement | null>
): number => {
    if (!panelRef || !panelRef.current) {
        return 0;
    }

    const panel = panelRef.current;

    const panelComputedStyle: CSSStyleDeclaration = window.getComputedStyle(
        panel,
        null
    );

    const cssTransformValue: string =
        panelComputedStyle.getPropertyValue('-webkit-transform') ||
        panelComputedStyle.getPropertyValue('-moz-transform') ||
        panelComputedStyle.getPropertyValue('-ms-transform') ||
        panelComputedStyle.getPropertyValue('-o-transform') ||
        panelComputedStyle.getPropertyValue('transform');

    if (cssTransformValue.toLowerCase() === 'none') {
        return 0;
    }

    const { a, b } = new WebKitCSSMatrix(cssTransformValue);

    const rotationAngleDegrees = Math.round(Math.atan2(b, a) * (180 / Math.PI));

    return rotationAngleDegrees < 0
        ? rotationAngleDegrees + 360
        : rotationAngleDegrees;
};

export default getPanelRotation;
