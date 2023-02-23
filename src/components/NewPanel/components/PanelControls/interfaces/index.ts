import { MutableRefObject } from 'react';

export interface IPanelControlsProps {
    boxWrapperDivRef: MutableRefObject<HTMLDivElement | null>;
    boxDivRef: MutableRefObject<HTMLDivElement | null>;
}
