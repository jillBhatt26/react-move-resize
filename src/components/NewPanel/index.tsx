import {
    MutableRefObject,
    useRef,
    useCallback,
    useState,
    useEffect,
    MouseEventHandler,
    MouseEvent
} from 'react';
import PanelControls from './components/PanelControls';
import './styles.css';

const NewPanel = (): JSX.Element => {
    // component refs
    const boxWrapperDivRef: MutableRefObject<HTMLDivElement | null> =
        useRef<HTMLDivElement | null>(null);
    const boxDivRef: MutableRefObject<HTMLDivElement | null> =
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

    // const handleRotatePanelCB = useCallback(
    //     (deg: number) => {
    //         if (!boxWrapperDivRef || !boxWrapperDivRef.current) return;

    //         const boxWrapperDiv: HTMLDivElement = boxWrapperDivRef.current;

    //         boxWrapperDiv.style.transform = `rotate(${deg}deg)`;
    //     },
    //     [boxWrapperDivRef]
    // );

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
        <div className="box-wrapper" ref={boxWrapperDivRef}>
            <div
                className="box"
                ref={boxDivRef}
                onMouseDown={handleBoxWrapperMouseDown}
            />

            <PanelControls />
        </div>
    );
};

export default NewPanel;
