import { Direction } from '../../../enums';

export interface IResizerProps {
    handleResize: (
        direction: Direction,
        movementX: number,
        movementY: number
    ) => void;
    getPanelRotationDegreesCB: () => number | null;
}
