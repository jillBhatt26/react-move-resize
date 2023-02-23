import {
    MutableRefObject,
    useRef,
    useCallback,
    useState,
    useEffect,
    MouseEventHandler,
    MouseEvent
} from 'react';
import './styles.css';

const NewPanel = (): JSX.Element => {
    // component refs
    const boxWrapperDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const boxDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);

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

    // component states
    const [shouldPanelMove, setShouldPanelMove] = useState<boolean>(false);

    // component callbacks
    const handleRepositionPanelCB = useCallback(
        (x: number, y: number) => {
            if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

            const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

            boxWrapperDiv.style.left = `${x}px`;
            boxWrapperDiv.style.top = `${y}px`;
        },
        [boxWrapperDivRef]
    );

    const handleResizePanelCB = useCallback(
        (width: number, height: number) => {
            if (!boxDivRef || !boxDivRef.current) return;

            const boxDiv: HTMLDivElement = boxDivRef.current;

            boxDiv.style.width = `${width}px`;
            boxDiv.style.height = `${height}px`;
        },
        [boxDivRef]
    );

    const handleRotatePanelCB = useCallback(
        (deg: number) => {
            if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

            const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

            boxWrapperDiv.style.transform = `rotate(${deg}deg)`;
        },
        [boxWrapperDivRef]
    );

    const handleMouseUpCB = useCallback(
        (mouseUpEvent: globalThis.MouseEvent) => {
            mouseUpEvent.preventDefault();

            setShouldPanelMove(false);
        },
        []
    );

    const handleMouseMoveCB = useCallback(
        (mouseMoveEvent: globalThis.MouseEvent) => {
            if (shouldPanelMove) {
                mouseMoveEvent.preventDefault();

                if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

                const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

                const { offsetLeft, offsetTop } = boxWrapperDiv;

                const { movementX, movementY } = mouseMoveEvent;

                handleRepositionPanelCB(
                    offsetLeft + movementX,
                    offsetTop + movementY
                );
            }
        },
        [shouldPanelMove, boxWrapperDivRef, handleRepositionPanelCB]
    );

    // component effects
    useEffect(() => {
        handleResizePanelCB(300, 200);
    }, [handleResizePanelCB]);

    useEffect(() => {
        handleRepositionPanelCB(200, 200);
    }, [handleRepositionPanelCB]);

    // mouse up handler effect
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUpCB, false);

        return () =>
            window.removeEventListener('mouseup', handleMouseUpCB, false);
    }, [handleMouseUpCB]);

    // mouse move handler effect
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMoveCB, false);

        return () =>
            window.removeEventListener('mousemove', handleMouseMoveCB, false);
    }, [handleMouseMoveCB]);

    // event handlers
    const handleBoxWrapperMouseDown: MouseEventHandler<HTMLDivElement> = (
        event: MouseEvent
    ) => {
        event.preventDefault();

        setShouldPanelMove(true);
    };

    return (
        <div
            className="box-wrapper"
            id="box-wrapper"
            ref={boxWrapperDivRef}
            onMouseDown={handleBoxWrapperMouseDown}
        >
            <div className="box" id="box" ref={boxDivRef}>
                <div className="dot rotate" id="rotate" />

                <div
                    className="dot left-top"
                    id="left-top"
                    ref={leftTopDivRef}
                />

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

                <div
                    className="dot left-mid"
                    id="left-mid"
                    ref={leftMidDivRef}
                />

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
            </div>
        </div>
    );
};

export default NewPanel;
