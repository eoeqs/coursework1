import { useState, useEffect } from "react";

const useBodyMap = (onMark, initialMarker) => {
    const [selectedPart, setSelectedPart] = useState(initialMarker?.bodyPart || null);
    const [clickPoint, setClickPoint] = useState(
        initialMarker ? { x: initialMarker.positionX, y: initialMarker.positionY } : null
    );

    useEffect(() => {
        if (initialMarker) {
            setSelectedPart(initialMarker.bodyPart);
            setClickPoint({ x: initialMarker.positionX, y: initialMarker.positionY });
        }
    }, [initialMarker]);

    const handleClick = (event, part) => {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        setSelectedPart(part);
        setClickPoint({ x, y });

        if (onMark) {
            onMark({ part, x, y });
        }
    };

    return { selectedPart, clickPoint, handleClick };
};

export default useBodyMap;