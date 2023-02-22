import { FC, useEffect, useState, useCallback } from 'react';
import { Direction } from '../../enums';
import { getPanelRotation } from '../../utils';
import { IResizerProps } from './interfaces';
import './styles.css';

const Resizer: FC<IResizerProps> = ({
    handleResize,
    panelRef
}): JSX.Element => {
    // component states
    const [direction, setDirection] = useState<Direction | null>(null);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    // component callbacks
    const handleMouseMoveCB = useCallback(
        (e: globalThis.MouseEvent) => {
            if (isMouseDown) {
                if (!direction) return;

                const ratio = window.devicePixelRatio;

                e.preventDefault();

                const degrees: number = getPanelRotation(panelRef);

                console.log('degrees: ', degrees);

                let deltaX: number = e.movementX / ratio;
                let deltaY: number = e.movementY / ratio;

                if (e.shiftKey) {
                    switch (direction) {
                        default:
                            deltaX = e.movementX / ratio;
                            deltaY = e.movementY / ratio;
                            break;

                        case Direction.TOP_LEFT:
                            deltaY = deltaX;
                            break;

                        case Direction.TOP_RIGHT:
                            deltaY = -deltaX;
                            break;

                        case Direction.BOTTOM_LEFT:
                            deltaY = -deltaX;
                            break;

                        case Direction.RIGHT_BOTTOM:
                            deltaY = deltaX;
                            break;
                    }
                }

                handleResize(direction, deltaX, deltaY);
            }
        },
        [isMouseDown, direction, handleResize, panelRef]
    );

    const handleMouseUpCB = useCallback(() => {
        setIsMouseDown(false);
    }, []);

    // component effects
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveCB);
        };
    }, [handleMouseMoveCB]);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUpCB);

        return () => {
            window.removeEventListener('mouseup', handleMouseUpCB);
        };
    }, [handleMouseUpCB]);

    // event handlers
    const handleMouseDown = (requestedDirection: Direction) => {
        setDirection(requestedDirection);
        setIsMouseDown(true);
    };

    return (
        <>
            <div
                className="top-left"
                onMouseDown={() => handleMouseDown(Direction.TOP_LEFT)}
            ></div>

            <div
                className="top"
                onMouseDown={() => handleMouseDown(Direction.TOP)}
            ></div>

            <div
                className="top-right"
                onMouseDown={() => handleMouseDown(Direction.TOP_RIGHT)}
            ></div>

            <div
                className="right"
                onMouseDown={() => handleMouseDown(Direction.RIGHT)}
            ></div>

            <div
                className="right-bottom"
                onMouseDown={() => handleMouseDown(Direction.RIGHT_BOTTOM)}
            ></div>

            <div
                className="bottom"
                onMouseDown={() => handleMouseDown(Direction.BOTTOM)}
            ></div>

            <div
                className="bottom-left"
                onMouseDown={() => handleMouseDown(Direction.BOTTOM_LEFT)}
            ></div>

            <div
                className="left"
                onMouseDown={() => handleMouseDown(Direction.LEFT)}
            ></div>
        </>
    );
};

export default Resizer;
