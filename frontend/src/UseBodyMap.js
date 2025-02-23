import { useState } from "react";

const useBodyMap = (onMark) => {
    const [selectedPart, setSelectedPart] = useState(null);
    const [clickPoint, setClickPoint] = useState(null);

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