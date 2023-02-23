import { MutableRefObject } from 'react';

export interface IPanelControlsProps {
    boxWrapperDivRef: MutableRefObject<HTMLDivElement | null>;
    boxDivRef: MutableRefObject<HTMLDivElement | null>;
    handleRepositionPanelCB: (x: number, y: number) => void;
    handleResizePanelCB: (width: number, height: number) => void;
}
