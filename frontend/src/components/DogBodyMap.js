import React, { useState } from "react";
import useBodyMap from "../UseBodyMap";

const DogBodyMap = ({ onMark }) => {
    const { selectedPart, clickPoint, handleClick } = useBodyMap(onMark);


    return (
        <svg
            width="500"
            height="500"
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m 108.5,86 10,6 7,6.5 7.5,10 5.5,8 15,14.5 -25.5,25 -1,1.5 -14.5,5.5 -12.5,3.5 -13.5,3 -8.5,-1.5 -8.5,-5 -5,-3.5 -0.5,-4.5 17,-10 10,-9 4,-8.5 6,-7 9.5,-4.5 2,-3 -1.5,-7.5 z"
                fill={selectedPart === "HEAD" ? "red" : "black"}
                onClick={(e) => handleClick(e, "HEAD")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 155,130.5 7,8.5 8,11.5 8.5,14.5 6,9.5 -41.5,33 -2.5,-16.5 -5.5,-20 -6,-15 z"
                fill={selectedPart === "NECK" ? "red" : "black"}
                onClick={(e) => handleClick(e, "NECK")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 184.5,176 5,3.5 12.5,4.5 13.5,6 19,8 -2.5,78 -22.5,4 -11,1 -8,-0.5 -7.5,-4 -31,-16 -5.5,-6.5 -6.5,-12.5 -2,-9 0.5,-9.5 3.5,-11 1.5,-4 z"
                fill={selectedPart === "CHEST" ? "red" : "black"}
                onClick={(e) => handleClick(e, "CHEST")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 236.5,199 34.5,10.5 29,5.5 13.5,2 -17.5,52 -5.5,-1.5 -3,0.5 -11,1.5 -13.5,2.5 -17,3 -14,1.5 z"
                fill={selectedPart === "STOMACH" ? "red" : "black"}
                onClick={(e) => handleClick(e, "STOMACH")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 314,216 17.5,4 9.5,-1.5 14,14.5 1,3.5 3,6 -41,39 -5.5,-5.5 -3.5,-3.5 -8.5,-4 -3,-0.5 z"
                fill={selectedPart === "REAR" ? "red" : "black"}
                onClick={(e) => handleClick(e, "REAR")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 356,231.5 1,-8 4,-8 5.5,-4 1,-1 -2.5,-2.5 h -5.5 l -6.5,2 -9.5,7.5 -1.5,1 z"
                fill={selectedPart === "TAIL" ? "red" : "black"}
                onClick={(e) => handleClick(e, "TAIL")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 360,243 7,8 4.5,10.5 V 273 l 3,10 7.5,9 5.5,6 6,9.5 6.5,8 7.5,5 17,12 6.5,4 -1.5,11.5 -0.5,18.5 2.5,20.5 -2.5,10 -2,3.5 -15.5,-1.5 -2,-4 0.5,-4.5 9,-9.5 3,-7 -0.5,-6 -0.5,-4.5 -2,-9.5 -2,-6 -4,-4 -3,-3 -3.5,-2 -6.5,-2.5 -7.5,-4 -6.5,-3 -8,-4.5 -4,-2.5 -4,-2 -4.5,-2 -6,-3 -5.5,-2.5 -6,-4 -10.5,-8 -9,-7.5 -10,-11.5 z"
                fill={selectedPart === "HIND_LEGS" ? "red" : "black"}
                onClick={(e) => handleClick(e, "HIND_LEGS")}
                style={{ cursor: "pointer" }}
            />
            <path
                d="m 185,279 6,35 2.5,20 -3,7.5 -1,6 v 5.5 10 l 0.5,6.5 1.5,6.5 -1.5,11.5 -3,6.5 -4,2 -2,5.5 -14.5,1.5 -6,-2.5 -1,-6 5.5,-7 8.5,-2 1,-2.5 1.5,-10 -0.5,-17.5 -1,-18.5 -2.5,-14 -6,-25 -7,-23 -6.5,-13.5 z"
                fill={selectedPart === "FRONT_LEGS" ? "red" : "black"}
                onClick={(e) => handleClick(e, "FRONT_LEGS")}
                style={{ cursor: "pointer" }}
            />

            {clickPoint && (
                <circle cx={clickPoint.x} cy={clickPoint.y} r="5" fill="blue" />
            )}
        </svg>
    );
};

export default DogBodyMap;
