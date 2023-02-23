import { FC, useEffect, useState, useCallback, MouseEvent } from 'react';
import { Direction } from '../../enums';
import { IResizerProps } from './interfaces';
import { getPanelRotation } from '../../utils';
import './styles.css';

const minWidth = 40;
const minHeight = 40;

const Resizer: FC<IResizerProps> = ({
    handleResize,
    panelRef
}): JSX.Element => {
    // component states
    const [direction, setDirection] = useState<Direction | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [initPanelClickXPos, setInitPanelClickXPos] = useState<number | null>(
        null
    );
    const [initPanelClickYPos, setInitPanelClickYPos] = useState<number | null>(
        null
    );

    // component callbacks
    const panelResizeCB = useCallback(
        (width: number, height: number) => {
            if (!panelRef || !panelRef.current) return;

            const panelDiv: HTMLDivElement = panelRef.current;

            panelDiv.style.width = `${width}px`;
            panelDiv.style.height = `${height}px`;
        },
        [panelRef]
    );

    const panelRepositionCB = useCallback(
        (x: number, y: number) => {
            if (!panelRef || !panelRef.current) return;

            const panelDiv: HTMLDivElement = panelRef.current;

            panelDiv.style.left = `${x}px`;
            panelDiv.style.top = `${y}px`;
        },
        [panelRef]
    );

    const handleMouseMoveCB = useCallback(
        (e: globalThis.MouseEvent) => {
            if (isMouseDown) {
                if (!direction) return;

                if (!panelRef || !panelRef.current) return;

                if (!initPanelClickXPos || !initPanelClickYPos) return;

                e.preventDefault();

                // const ratio = window.devicePixelRatio;

                const panelDiv: HTMLDivElement = panelRef.current;

                const {
                    offsetLeft: initX,
                    offsetTop: initY,
                    offsetWidth: initW,
                    offsetHeight: initH
                } = panelDiv;

                const mousePressX: number = initPanelClickXPos;
                const mousePressY: number = initPanelClickYPos;

                const panelRotationDegrees: number = getPanelRotation(panelRef);

                const panelRotationRadians: number =
                    (panelRotationDegrees * Math.PI) / 180;

                const cosFraction: number = Math.cos(panelRotationRadians);
                const sinFraction: number = Math.sin(panelRotationRadians);

                const wDiff = e.clientX - mousePressX;
                const hDiff = e.clientY - mousePressY;

                let rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
                let rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

                let newW = initW;
                let newH = initH;
                let newX = initX;
                let newY = initY;

                if (direction === Direction.LEFT) {
                    newW = initW - rotatedWDiff;

                    if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = initW - minWidth;
                    }

                    newX += 0.5 * rotatedWDiff * cosFraction;
                    newY += 0.5 * rotatedWDiff * sinFraction;

                    panelResizeCB(newW, newH);
                    panelRepositionCB(newX, newY);
                }

                if (direction === Direction.RIGHT) {
                    newW = initW + rotatedWDiff;

                    if (newW < minWidth) {
                        newW = minWidth;
                        rotatedWDiff = minWidth - initW;
                    }

                    newX += 0.5 * rotatedWDiff * cosFraction;
                    newY += 0.5 * rotatedWDiff * sinFraction;

                    panelResizeCB(newW, newH);
                    panelRepositionCB(newX, newY);
                }

                if (direction === Direction.TOP) {
                    newH = initH - rotatedHDiff;

                    if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = initH - minHeight;
                    }

                    newX -= 0.5 * rotatedHDiff * sinFraction;
                    newY += 0.5 * rotatedHDiff * cosFraction;

                    panelResizeCB(newW, newH);
                    panelRepositionCB(newX, newY);
                }

                if (direction === Direction.BOTTOM) {
                    newH = initH + rotatedHDiff;

                    if (newH < minHeight) {
                        newH = minHeight;
                        rotatedHDiff = minHeight - initH;
                    }

                    newX -= 0.5 * rotatedHDiff * sinFraction;
                    newY += 0.5 * rotatedHDiff * cosFraction;

                    panelResizeCB(newW, newH);
                    panelRepositionCB(newX, newY);
                }
            }
        },
        [
            isMouseDown,
            direction,
            panelRef,
            initPanelClickXPos,
            initPanelClickYPos,
            panelResizeCB,
            panelRepositionCB
        ]
    );

    const handleMouseUpCB = useCallback(() => {
        setIsMouseDown(false);
    }, []);

    // component effects
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB, false);

        return () =>
            window.removeEventListener('mousemove', handleMouseMoveCB, false);
    }, [handleMouseMoveCB]);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUpCB);

        return () => {
            window.removeEventListener('mouseup', handleMouseUpCB);
        };
    }, [handleMouseUpCB]);

    // event handlers
    const handleMouseDown = (e: MouseEvent, requestedDirection: Direction) => {
        setDirection(requestedDirection);
        setIsMouseDown(true);
        setInitPanelClickXPos(e.clientX);
        setInitPanelClickYPos(e.clientY);
    };

    return (
        <>
            <div
                className="top-left"
                onMouseDown={e => handleMouseDown(e, Direction.TOP_LEFT)}
            ></div>

            <div
                className="top"
                onMouseDown={e => handleMouseDown(e, Direction.TOP)}
            ></div>

            <div
                className="top-right"
                onMouseDown={e => handleMouseDown(e, Direction.TOP_RIGHT)}
            ></div>

            <div
                className="right"
                onMouseDown={e => handleMouseDown(e, Direction.RIGHT)}
            ></div>

            <div
                className="right-bottom"
                onMouseDown={e => handleMouseDown(e, Direction.RIGHT_BOTTOM)}
            ></div>

            <div
                className="bottom"
                onMouseDown={e => handleMouseDown(e, Direction.BOTTOM)}
            ></div>

            <div
                className="bottom-left"
                onMouseDown={e => handleMouseDown(e, Direction.BOTTOM_LEFT)}
            ></div>

            <div
                className="left"
                onMouseDown={e => handleMouseDown(e, Direction.LEFT)}
            ></div>
        </>
    );
};

export default Resizer;
