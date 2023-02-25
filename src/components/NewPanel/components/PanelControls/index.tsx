import {
    MouseEventHandler,
    MouseEvent,
    useState,
    useCallback,
    useEffect,
    FC
} from 'react';
import { MIN_HEIGHT, MIN_WIDTH } from '../../../../constants';
import { getPanelRotation } from '../../../../utils';
import { IPanelControlsProps } from './interfaces';
import RotateIcon from '../../../../assets/rotate.svg';
import { Direction } from '../../../../enums';

const PanelControls: FC<IPanelControlsProps> = ({
    boxWrapperDivRef,
    boxDivRef,
    handleRepositionPanelCB,
    handleResizePanelCB
}): JSX.Element => {
    // component states
    const [shouldPanelRotate, setShouldPanelRotate] = useState<boolean>(false);
    const [shouldHideResizeDots, setShouldHideResizeDots] =
        useState<boolean>(false);
    const [resizeDirection, setResizeDirection] = useState<Direction | null>(
        null
    );

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
        },
        []
    );

    const handleMouseMoveCB = useCallback(
        (mouseMoveEvent: globalThis.MouseEvent) => {
            if (shouldPanelRotate) {
                if (!boxDivRef || !boxDivRef.current) return;

                const boxDiv: HTMLDivElement = boxDivRef.current;

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
        },
        [shouldPanelRotate, boxDivRef, handleRotatePanelCB]
    );

    // component effects
    useEffect(() => {
        setShouldHideResizeDots(shouldPanelRotate);
    }, [shouldPanelRotate]);

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

        setShouldPanelRotate(true);

        rotateMouseEvent.stopPropagation();
    };

    const handleResizeMouseDown = (
        resizeMouseEvent: MouseEvent<HTMLDivElement>,
        left: boolean = false,
        top: boolean = false,
        xResize: boolean = false,
        yResize: boolean = false,
        direction: Direction
    ) => {
        if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;
        if (!boxDivRef || !boxDivRef.current) return;

        const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;
        const boxDiv: HTMLDivElement = boxDivRef.current;

        setResizeDirection(direction);

        const initX = boxWrapperDiv.offsetLeft;
        const initY = boxWrapperDiv.offsetTop;
        const mousePressX = resizeMouseEvent.clientX;
        const mousePressY = resizeMouseEvent.clientY;

        const initW = boxDiv.offsetWidth;
        const initH = boxDiv.offsetHeight;

        const initRotate = getPanelRotation(boxWrapperDivRef);
        const initRadians = (initRotate * Math.PI) / 180;
        const cosFraction = Math.cos(initRadians);
        const sinFraction = Math.sin(initRadians);

        function eventMoveHandler(event: globalThis.MouseEvent) {
            const wDiff = event.clientX - mousePressX;
            const hDiff = event.clientY - mousePressY;
            let rotatedWDiff = cosFraction * wDiff + sinFraction * hDiff;
            let rotatedHDiff = cosFraction * hDiff - sinFraction * wDiff;

            let newW = initW;
            let newH = initH;
            let newX = initX;
            let newY = initY;

            if (xResize) {
                if (left) {
                    newW = initW - rotatedWDiff;

                    if (newW < MIN_WIDTH) {
                        newW = MIN_WIDTH;
                        rotatedWDiff = initW - MIN_WIDTH;
                    }
                } else {
                    newW = initW + rotatedWDiff;

                    if (newW < MIN_WIDTH) {
                        newW = MIN_WIDTH;
                        rotatedWDiff = MIN_WIDTH - initW;
                    }
                }

                newX += 0.5 * rotatedWDiff * cosFraction;
                newY += 0.5 * rotatedWDiff * sinFraction;
            }

            if (yResize) {
                if (top) {
                    newH = initH - rotatedHDiff;

                    if (newH < MIN_HEIGHT) {
                        newH = MIN_HEIGHT;
                        rotatedHDiff = initH - MIN_HEIGHT;
                    }
                } else {
                    newH = initH + rotatedHDiff;

                    if (newH < MIN_HEIGHT) {
                        newH = MIN_HEIGHT;
                        rotatedHDiff = MIN_HEIGHT - initH;
                    }
                }

                newX -= 0.5 * rotatedHDiff * sinFraction;
                newY += 0.5 * rotatedHDiff * cosFraction;
            }

            handleResizePanelCB(newW, newH);
            handleRepositionPanelCB(newX, newY);
        }

        window.addEventListener('mousemove', eventMoveHandler);
        window.addEventListener('mouseup', function eventEndHandler() {
            setResizeDirection(null);

            window.removeEventListener('mousemove', eventMoveHandler);
            window.removeEventListener('mouseup', eventEndHandler);
        });

        resizeMouseEvent.stopPropagation();
    };

    return (
        <>
            {!resizeDirection && (
                <div className="" onMouseDown={handleRotateMouseDown}>
                    <img
                        src={RotateIcon}
                        alt="Rotate icon svg"
                        style={{
                            maxWidth: '100%',
                            width: '20px',
                            margin: '-40px auto 0',
                            position: 'absolute',
                            left: 0,
                            right: 0
                        }}
                    />
                </div>
            )}

            {!shouldHideResizeDots && (
                <>
                    <div
                        className="dot left-top"
                        id="left-top"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                true,
                                true,
                                true,
                                true,
                                Direction.TOP_LEFT
                            )
                        }
                    />

                    <div
                        className="dot left-bottom"
                        id="left-bottom"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                true,
                                false,
                                true,
                                true,
                                Direction.BOTTOM_LEFT
                            )
                        }
                    />

                    <div
                        className="dot top-mid"
                        id="top-mid"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                false,
                                true,
                                false,
                                true,
                                Direction.TOP
                            )
                        }
                    />

                    <div
                        className="dot bottom-mid"
                        id="bottom-mid"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                false,
                                false,
                                false,
                                true,
                                Direction.BOTTOM
                            )
                        }
                    />

                    <div
                        className="dot left-mid"
                        id="left-mid"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                true,
                                false,
                                true,
                                false,
                                Direction.LEFT
                            )
                        }
                    />

                    <div
                        className="dot right-mid"
                        id="right-mid"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                false,
                                false,
                                true,
                                false,
                                Direction.RIGHT
                            )
                        }
                    />

                    <div
                        className="dot right-bottom"
                        id="right-bottom"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                false,
                                false,
                                true,
                                true,
                                Direction.RIGHT_BOTTOM
                            )
                        }
                    />

                    <div
                        className="dot right-top"
                        id="right-top"
                        onMouseDown={e =>
                            handleResizeMouseDown(
                                e,
                                false,
                                true,
                                true,
                                true,
                                Direction.TOP_RIGHT
                            )
                        }
                    />
                </>
            )}

            {/* <div className="rotate-link" /> */}
        </>
    );
};

export default PanelControls;
