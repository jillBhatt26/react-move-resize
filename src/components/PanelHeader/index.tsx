import { useState, useEffect, FC } from 'react';
import { IPanelHeaderProps } from './interfaces';

const PanelHeader: FC<IPanelHeaderProps> = ({ handlePanelDrag }) => {
    // component states
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    // component effects
    useEffect(() => {
        if (isMouseDown) {
            const handleMouseMove = (e: globalThis.MouseEvent) => {
                const ratio = window.devicePixelRatio;

                e.preventDefault();

                const deltaX: number = e.movementX / ratio;
                const deltaY: number = e.movementY / ratio;

                handlePanelDrag(deltaX, deltaY);
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [isMouseDown, handlePanelDrag]);

    useEffect(() => {
        const handleMouseUp = () => setIsMouseDown(false);

        window.addEventListener('mouseup', handleMouseUp);

        return () => window.removeEventListener('mousemove', handleMouseUp);
    }, []);

    return (
        <div className="panel_header" onMouseDown={() => setIsMouseDown(true)}>
            PanelHeader
        </div>
    );
};

export default PanelHeader;
