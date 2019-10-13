export const getId = (i => () => i++)(0)

export function getX(e) {
    return e.targetTouches && e.targetTouches.length >= 1
        ? e.targetTouches[0].clientX
        : e.clientX;
}

export function getY(e) {
    return e.targetTouches && e.targetTouches.length >= 1
        ? e.targetTouches[0].clientY
        : e.clientY;
}
