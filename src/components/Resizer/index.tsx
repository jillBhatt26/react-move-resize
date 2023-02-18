import { FC, useEffect, useState, useCallback } from 'react';
import { Direction } from '../../enums';
import { IResizerProps } from './interfaces';
import './styles.css';

const Resizer: FC<IResizerProps> = ({ handleResize }): JSX.Element => {
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

                handleResize(
                    direction,
                    e.movementX / ratio,
                    e.movementY / ratio
                );
            }
        },
        [isMouseDown, direction, handleResize]
    );

    // component effects
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveCB);
        };
    }, [handleMouseMoveCB]);

    // event handlers
    const handleMouseDown = (requestedDirection: Direction) => {
        setDirection(requestedDirection);
        setIsMouseDown(true);
    };

    const handleMouseUp = () => {
        setDirection(null);
        setIsMouseDown(false);
    };

    return (
        <>
            <div
                className="top-left"
                onMouseDown={() => handleMouseDown(Direction.TOP_LEFT)}
                onMouseUp={() => handleMouseUp()}
            ></div>

            <div
                className="top"
                onMouseDown={() => handleMouseDown(Direction.TOP)}
                onMouseUp={() => handleMouseUp()}
            ></div>

            <div
                className="top-right"
                onMouseDown={() => handleMouseDown(Direction.TOP_RIGHT)}
                onMouseUp={() => handleMouseUp()}
            ></div>
            <div
                className="right"
                onMouseDown={() => handleMouseDown(Direction.RIGHT)}
                onMouseUp={() => handleMouseUp()}
            ></div>
            <div
                className="right-bottom"
                onMouseDown={() => handleMouseDown(Direction.RIGHT_BOTTOM)}
                onMouseUp={() => handleMouseUp()}
            ></div>
            <div
                className="bottom"
                onMouseDown={() => handleMouseDown(Direction.BOTTOM)}
                onMouseUp={() => handleMouseUp()}
            ></div>
            <div
                className="bottom-left"
                onMouseDown={() => handleMouseDown(Direction.BOTTOM_LEFT)}
                onMouseUp={() => handleMouseUp()}
            ></div>
            <div
                className="left"
                onMouseDown={() => handleMouseDown(Direction.LEFT)}
                onMouseUp={() => handleMouseUp()}
            ></div>
        </>
    );
};

export default Resizer;
