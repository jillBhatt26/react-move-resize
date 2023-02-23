import {
    useRef,
    MutableRefObject,
    MouseEventHandler,
    MouseEvent,
    useState,
    useCallback,
    useEffect,
    FC
} from 'react';
import { IPanelControlsProps } from './interfaces';

const PanelControls: FC<IPanelControlsProps> = ({
    boxWrapperDivRef,
    boxDivRef
}): JSX.Element => {
    // component refs
    const rotateDivRef: MutableRefObject<HTMLDivElement | null> =
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
    const [shouldPanelRotate, setShouldPanelRotate] = useState<boolean>(false);

    // component callbacks
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

            setShouldPanelRotate(false);
        },
        []
    );

    const handleMouseMoveCB = useCallback(
        (mouseMoveEvent: globalThis.MouseEvent) => {
            if (!shouldPanelRotate) return;

            if (!boxDivRef || !boxDivRef.current) return;

            if (!rotateDivRef || !rotateDivRef.current) return;

            const boxDiv: HTMLDivElement = boxDivRef.current;

            // const { left, top, width, height } = boxDiv.getBoundingClientRect();

            // const boxCenterX: number = left + width / 2;
            // const boxCenterY: number = top + height / 2;

            // const { clientX, clientY } = mouseMoveEvent;

            // const angle: number =
            //     Math.atan2(clientY - boxCenterX, clientX - boxCenterY) +
            //     Math.PI / 2;

            const { width, height, top, left } = boxDiv.getBoundingClientRect();

            const centerX: number = left + width / 2;
            const centerY: number = top + height / 2;

            const { pageX: mouseX, pageY: mouseY } = mouseMoveEvent;

            const radians: number = Math.atan2(
                mouseY - centerY,
                mouseX - centerX
            );

            const degrees: number = radians * (180 / Math.PI) + 90;

            handleRotatePanelCB(degrees);
        },
        [shouldPanelRotate, boxDivRef, handleRotatePanelCB]
    );

    // component effects

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
    const handleRotateMouseDown: MouseEventHandler<HTMLDivElement> = (
        rotateMouseEvent: MouseEvent<HTMLDivElement>
    ) => {
        rotateMouseEvent.preventDefault();

        setShouldPanelRotate(true);
    };

    return (
        <>
            <div
                className="dot rotate"
                id="rotate"
                ref={rotateDivRef}
                onMouseDown={handleRotateMouseDown}
            />

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
