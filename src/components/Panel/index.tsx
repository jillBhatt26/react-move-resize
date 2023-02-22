import { FC, useRef, useCallback } from 'react';
import { Direction } from '../../enums';
import PanelHeader from '../PanelHeader';
import Resizer from '../Resizer';
import Rotate from '../Rotate';
import { IPanelProps } from './interfaces';

const Panel: FC<IPanelProps> = ({ children }): JSX.Element => {
    // component refs
    const panelRef = useRef<HTMLDivElement | null>(null);

    // component callbacks
    const getPanelRotationDegreesCB: () => number | null = useCallback(() => {
        let rotationAngleDegrees: number | null = null;

        if (panelRef && panelRef.current) {
            const panel = panelRef.current;

            const panelComputedStyle: CSSStyleDeclaration =
                window.getComputedStyle(panel);

            const cssTransformValue: string =
                panelComputedStyle.getPropertyValue('-webkit-transform') ||
                panelComputedStyle.getPropertyValue('-moz-transform') ||
                panelComputedStyle.getPropertyValue('-ms-transform') ||
                panelComputedStyle.getPropertyValue('-o-transform') ||
                panelComputedStyle.getPropertyValue('transform');

            console.log(
                'cssTransformValue: ',
                panelComputedStyle.getPropertyValue('transform')
            );

            if (cssTransformValue !== 'none') {
                const values = cssTransformValue
                    .split('(')[1]
                    .split(')')[0]
                    .split(',');

                rotationAngleDegrees = Math.round(
                    Math.atan2(parseInt(values[1]), parseInt(values[0])) *
                        (180 / Math.PI)
                );

                rotationAngleDegrees =
                    rotationAngleDegrees < 0
                        ? rotationAngleDegrees + 360
                        : rotationAngleDegrees;

                console.log('rotationAngleDegrees: ', rotationAngleDegrees);
            }
        }

        return rotationAngleDegrees;
    }, [panelRef]);

    // event handlers
    const handlePanelDrag = (movementX: number, movementY: number) => {
        const panel = panelRef.current;

        if (!panel) return;

        panel.style.left = `${panel.offsetLeft + movementX}px`;
        panel.style.top = `${panel.offsetTop + movementY}px`;
    };

    const handleResize = (
        direction: Direction,
        movementX: number,
        movementY: number
    ) => {
        const panel = panelRef.current;

        if (!panel) return;

        const { x, y, width, height }: DOMRect = panel.getBoundingClientRect();

        const resizeTop = () => {
            panel.style.height = `${height - movementY}px`;
            panel.style.top = `${y + movementY}px`;
        };

        const resizeRight = () => {
            panel.style.width = `${width + movementX}px`;
        };

        const resizeBottom = () => {
            panel.style.height = `${height + movementY}px`;
        };

        const resizeLeft = () => {
            panel.style.width = `${width - movementX}px`;
            panel.style.left = `${x + movementX}px`;
        };

        switch (direction) {
            case Direction.TOP_LEFT:
                resizeTop();
                resizeLeft();
                break;

            case Direction.TOP:
                resizeTop();
                break;

            case Direction.TOP_RIGHT:
                resizeTop();
                resizeRight();
                break;

            case Direction.RIGHT:
                resizeRight();
                break;

            case Direction.RIGHT_BOTTOM:
                resizeBottom();
                resizeRight();
                break;

            case Direction.BOTTOM:
                resizeBottom();
                break;

            case Direction.BOTTOM_LEFT:
                resizeBottom();
                resizeLeft();
                break;

            case Direction.LEFT:
                resizeLeft();
                break;

            default:
                break;
        }
    };

    return (
        <div className="panel" ref={panelRef}>
            <Rotate panelRef={panelRef} />

            <div className="panel_container">
                <Resizer
                    handleResize={handleResize}
                    getPanelRotationDegreesCB={getPanelRotationDegreesCB}
                />

                <PanelHeader handlePanelDrag={handlePanelDrag} />

                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default Panel;
