export function getHeading () {
    let arr = [];
    let i = 0;
    while (i < 7) {
        if (i === 6) {
            arr.push({ label: `正文`, value: `${i + 1}`, disabled: false })
        } else {
            const num = i + 1
            arr.push({ label: `H${num} 标题 ${num}`, value: `${num}`, disabled: false })
        }
        i++;
    }
    return arr
}

export const headerData = getHeading()