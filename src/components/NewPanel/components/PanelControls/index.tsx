import { useRef, MutableRefObject } from 'react';

const PanelControls = (): JSX.Element => {
    // component refs
    const leftTopDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const leftBottomDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const topMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const bottomMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const leftMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightMidDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightBottomDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const rightTopDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);

    return (
        <>
            <div className="dot rotate" id="rotate" />

            <div className="dot left-top" id="left-top" ref={leftTopDivRef} />

            <div
                className="dot left-bottom"
                id="left-bottom"
                ref={leftBottomDivRef}
            />

            <div className="dot top-mid" id="top-mid" ref={topMidDivRef} />

            <div
                className="dot bottom-mid"
                id="bottom-mid"
                ref={bottomMidDivRef}
            />

            <div className="dot left-mid" id="left-mid" ref={leftMidDivRef} />

            <div
                className="dot right-mid"
                id="right-mid"
                ref={rightMidDivRef}
            />

            <div
                className="dot right-bottom"
                id="right-bottom"
                ref={rightBottomDivRef}
            />

            <div
                className="dot right-top"
                id="right-top"
                ref={rightTopDivRef}
            />

            <div className="rotate-link" />
        </>
    );
};

export default PanelControls;
