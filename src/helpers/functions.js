import {colors} from "./constants.js";

export function getRandomColor() {
    const randomDecimal = Math.random();
    const randomInteger = Math.floor(randomDecimal * 7) + 1;
    return colors[randomInteger];
}
