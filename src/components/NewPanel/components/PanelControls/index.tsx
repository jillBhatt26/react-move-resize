import {
    useRef,
    MutableRefObject,
    MouseEventHandler,
    MouseEvent,
    useState,
    useCallback,
    useEffect,
    FC
} from 'react';
import { MIN_HEIGHT, MIN_WIDTH } from '../../../../constants';
import { Direction } from '../../../../enums';
import { getPanelRotation } from '../../../../utils';
import { IPanelControlsProps } from './interfaces';

const PanelControls: FC<IPanelControlsProps> = ({
    boxWrapperDivRef,
    boxDivRef,
    handleRepositionPanelCB,
    handleResizePanelCB
}): JSX.Element => {
    // component refs
    const rotateDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const leftTopDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const leftBottomDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const topMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const bottomMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const leftMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightBottomDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightTopDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);

    // component states
    const [shouldPanelRotate, setShouldPanelRotate] = useState<boolean>(false);
    const [shouldPanelResize, setShouldPanelResize] = useState<boolean>(false);
    const [resizeDirection, setResizeDirection] = useState<Direction | null>(
        null
    );
    const [mousePressX, setMousePressX] = useState<number | null>(null);
    const [mousePressY, setMousePressY] = useState<number | null>(null);

    // component callbacks
    const handleRotatePanelCB = useCallback(
        (deg: number) => {
            if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

            const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

            boxWrapperDiv.style.transform = `rotate(${deg}deg)`;
        },
        [boxWrapperDivRef]
    );

    const handleMouseUpCB = useCallback(
        (mouseUpEvent: globalThis.MouseEvent) => {
            mouseUpEvent.preventDefault();

            setShouldPanelRotate(false);
            setShouldPanelResize(false);
        },
        []
    );

    const handleMouseMoveCB = useCallback(
        (mouseMoveEvent: globalThis.MouseEvent) => {
            if (shouldPanelRotate) {
                if (!boxDivRef || !boxDivRef.current) return;

                if (!rotateDivRef || !rotateDivRef.current) return;

                const boxDiv: HTMLDivElement = boxDivRef.current;

                // const { left, top, width, height } = boxDiv.getBoundingClientRect();

                // const boxCenterX: number = left + width / 2;
                // const boxCenterY: number = top + height / 2;

                // const { clientX, clientY } = mouseMoveEvent;

                // const angle: number =
                //     Math.atan2(clientY - boxCenterX, clientX - boxCenterY) +
                //     Math.PI / 2;

                const { width, height, top, left } =
                    boxDiv.getBoundingClientRect();

                const centerX: number = left + width / 2;
                const centerY: number = top + height / 2;

                const { pageX: mouseX, pageY: mouseY } = mouseMoveEvent;

                const radians: number = Math.atan2(
                    mouseY - centerY,
                    mouseX - centerX
                );

                const degrees: number = radians * (180 / Math.PI) + 90;

                handleRotatePanelCB(degrees);
            }

            if (shouldPanelResize) {
                if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

                if (mousePressX === null || mousePressY === null) return;

                const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

                const {
                    offsetTop: initY,
                    offsetLeft: initX,
                    offsetWidth: initW,
                    offsetHeight: initH
                } = boxWrapperDiv;

                const boxWrapperDivRotation: number =
                    getPanelRotation(boxWrapperDivRef);

                const initRadians: number =
                    boxWrapperDivRotation * (Math.PI / 180);

                const cosFraction = Math.cos(initRadians);
                const sinFraction = Math.sin(initRadians);

                const { clientX, clientY } = mouseMoveEvent;

                var wDiff = clientX - mousePressX;
                var hDiff = clientY - mousePressY;

                let rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
                let rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

                let newW = initW;
                let newH = initH;
                let newX = initX;
                let newY = initY;

                switch (resizeDirection) {
                    case Direction.TOP:
                        newH = initH - rotatedHDiff;

                        if (newH < MIN_HEIGHT) {
                            newH = MIN_HEIGHT;

                            rotatedHDiff = initH - MIN_HEIGHT;
                        }

                        break;

                    case Direction.BOTTOM:
                        break;

                    case Direction.LEFT:
                        newW = initW - rotatedWDiff;

                        if (newW < MIN_WIDTH) {
                            newW = MIN_WIDTH;
                            rotatedWDiff = initW - MIN_WIDTH;
                        }
                        break;

                    case Direction.RIGHT:
                        break;

                    default:
                        return;
                }

                newX -= 0.5 * rotatedHDiff * sinFraction;
                newY += 0.5 * rotatedHDiff * cosFraction;

                handleRepositionPanelCB(newX, newY);
                handleResizePanelCB(newW, newH);
            }
        },
        [
            shouldPanelRotate,
            shouldPanelResize,
            mousePressX,
            mousePressY,
            resizeDirection,
            boxDivRef,
            boxWrapperDivRef,
            handleRotatePanelCB,
            handleRepositionPanelCB,
            handleResizePanelCB
        ]
    );

    // component effects

    // mouse up handler effect
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUpCB, false);

        return () =>
            window.removeEventListener('mouseup', handleMouseUpCB, false);
    }, [handleMouseUpCB]);

    // mouse move handler effect
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB, false);

        return () =>
            window.removeEventListener('mousemove', handleMouseMoveCB, false);
    }, [handleMouseMoveCB]);

    // event handlers
    const handleRotateMouseDown: MouseEventHandler<HTMLDivElement> = (
        rotateMouseEvent: MouseEvent<HTMLDivElement>
    ) => {
        rotateMouseEvent.preventDefault();

        if (rotateMouseEvent.button !== 0) return;

        setShouldPanelResize(false);
        setShouldPanelRotate(true);
    };

    const handleResizeMouseDown = (
        resizeMouseEvent: MouseEvent<HTMLDivElement>,
        direction: Direction
    ) => {
        resizeMouseEvent.preventDefault();

        if (resizeMouseEvent.button !== 0) return;

        setShouldPanelRotate(false);
        setShouldPanelResize(true);
        setResizeDirection(direction);

        setMousePressX(resizeMouseEvent.clientX);
        setMousePressY(resizeMouseEvent.clientY);
    };

    return (
        <>
            <div
                className="dot rotate"
                id="rotate"
                ref={rotateDivRef}
                onMouseDown={handleRotateMouseDown}
            />

            <div
                className="dot left-top"
                id="left-top"
                ref={leftTopDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.TOP_LEFT)}
            />

            <div
                className="dot left-bottom"
                id="left-bottom"
                ref={leftBottomDivRef}
                onMouseDown={e =>
                    handleResizeMouseDown(e, Direction.BOTTOM_LEFT)
                }
            />

            <div
                className="dot top-mid"
                id="top-mid"
                ref={topMidDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.TOP)}
            />

            <div
                className="dot bottom-mid"
                id="bottom-mid"
                ref={bottomMidDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.BOTTOM)}
            />

            <div
                className="dot left-mid"
                id="left-mid"
                ref={leftMidDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.LEFT)}
            />

            <div
                className="dot right-mid"
                id="right-mid"
                ref={rightMidDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.RIGHT)}
            />

            <div
                className="dot right-bottom"
                id="right-bottom"
                ref={rightBottomDivRef}
                onMouseDown={e =>
                    handleResizeMouseDown(e, Direction.RIGHT_BOTTOM)
                }
            />

            <div
                className="dot right-top"
                id="right-top"
                ref={rightTopDivRef}
                onMouseDown={e => handleResizeMouseDown(e, Direction.TOP_RIGHT)}
            />

            <div className="rotate-link" />
        </>
    );
};

export default PanelControls;
