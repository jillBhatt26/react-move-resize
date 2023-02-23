import { MutableRefObject } from 'react';
import { Direction } from '../../../enums';

export interface IResizerProps {
    handleResize: (
        direction: Direction,
        movementX: number,
        movementY: number,
        clientX: number,
        clientY: number
    ) => void;
    panelRef: MutableRefObject<HTMLDivElement | null>;
}
