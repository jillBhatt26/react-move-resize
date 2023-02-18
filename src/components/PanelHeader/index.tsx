import { useState, useEffect, useCallback, FC } from 'react';
import { IPanelHeaderProps } from './interfaces';

const PanelHeader: FC<IPanelHeaderProps> = ({ handlePanelDrag }) => {
    // component states
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    // component callbacks
    const handleMouseMoveCB = useCallback(
        (e: globalThis.MouseEvent) => {
            if (isMouseDown) {
                const ratio = window.devicePixelRatio;

                e.preventDefault();

                handlePanelDrag(e.movementX / ratio, e.movementY / ratio);
            }
        },
        [isMouseDown, handlePanelDrag]
    );

    // component effects
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveCB);
        };
    }, [handleMouseMoveCB]);

    return (
        <div
            className="panel_header"
            onMouseUp={() => setIsMouseDown(false)}
            onMouseDown={() => setIsMouseDown(true)}
        >
            PanelHeader
        </div>
    );
};

export default PanelHeader;
