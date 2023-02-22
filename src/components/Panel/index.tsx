import { FC, useRef, MutableRefObject } from 'react';
import { Direction } from '../../enums';
import PanelHeader from '../PanelHeader';
import Resizer from '../Resizer';
import Rotate from '../Rotate';
import { IPanelProps } from './interfaces';

const Panel: FC<IPanelProps> = ({ children }): JSX.Element => {
    // component refs
    const panelRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);

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
                    panelRef={panelRef}
                />

                <PanelHeader handlePanelDrag={handlePanelDrag} />

                <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default Panel;
