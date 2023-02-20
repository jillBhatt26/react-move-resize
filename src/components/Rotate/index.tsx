import { FC, useState, useCallback, useEffect } from 'react';
import RotationIcon from '../../assets/rotate.svg';
import { IRotateProps } from './interfaces';
import './styles.css';

const Rotate: FC<IRotateProps> = ({ panelRef }): JSX.Element => {
    // component states
    const [shouldRotate, setShouldRotate] = useState<boolean>(false);

    // component callbacks
    const handleMouseMoveCB = useCallback(
        (event: globalThis.MouseEvent) => {
            if (panelRef.current) {
                event.preventDefault();

                const { width, height, top, left } =
                    panelRef.current.getBoundingClientRect();

                const centerX: number = left + width / 2;
                const centerY: number = top + height / 2;

                const { pageX: mouseX, pageY: mouseY } = event;

                const radians: number = Math.atan2(
                    mouseY - centerY,
                    mouseX - centerX
                );

                const degrees: number = radians * (180 / Math.PI) + 90;

                console.log('degrees: ', degrees);

                panelRef.current.style.transform = `rotate(${degrees}deg)`;
            }
        },
        [panelRef]
    );

    const handleMouseUpCB = useCallback(() => {
        setShouldRotate(false);
    }, []);

    const handleMouseCB = useCallback(() => {
        if (shouldRotate) {
            window.addEventListener('mousemove', handleMouseMoveCB);
        } else {
            window.removeEventListener('mousemove', handleMouseMoveCB);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveCB);
        };
    }, [shouldRotate, handleMouseMoveCB]);

    // component effects
    useEffect(() => {
        handleMouseCB();
    }, [handleMouseCB]);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUpCB);

        return () => window.removeEventListener('mouseup', handleMouseUpCB);
    }, [handleMouseUpCB]);

    return (
        <>
            <img
                src={RotationIcon}
                alt="Rotate icon"
                className="rotate"
                onMouseDown={() => setShouldRotate(true)}
            />
        </>
    );
};

export default Rotate;
