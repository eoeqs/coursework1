import { useState } from "react";

const useBodyMap = (onMark) => {
    const [selectedPart, setSelectedPart] = useState(null);
    const [clickPoint, setClickPoint] = useState(null);

    const handleClick = (event, part) => {
        setSelectedPart(part);
        setClickPoint({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });

        console.log(`Chosen body part: ${part}, Coordinates: (${event.nativeEvent.offsetX}, ${event.nativeEvent.offsetY})`);

        if (onMark) {
            onMark(part);
        }
    };

    return { selectedPart, clickPoint, handleClick };
};

export default useBodyMap;
