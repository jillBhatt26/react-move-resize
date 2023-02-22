import { Direction } from '../../../enums';
import { MutableRefObject } from 'react';

export interface IResizerProps {
    handleResize: (
        direction: Direction,
        movementX: number,
        movementY: number
    ) => void;
    panelRef: MutableRefObject<HTMLDivElement | null>;
}
