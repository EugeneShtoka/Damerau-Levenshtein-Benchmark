
export function naive(str1: string, str2: string): number {
    return naiveInternal(str1, str2, str1.length, str2.length);
}

function naiveInternal(str1: string, str2: string, prefix1: number, prefix2: number): number {
    if (prefix1 === 0 && prefix2 === 0) {
        return 0;
    }
    const partialResults: number[] = [];
    if (prefix1 > 0) {
        partialResults.push(1 + naiveInternal(str1, str2, prefix1 - 1, prefix2));
    }
    if (prefix2 > 0) {
        partialResults.push(1 + naiveInternal(str1, str2, prefix1, prefix2 - 1));
    }
    if (prefix1 > 1 && prefix2 > 1 && str1[prefix1 - 1] !== str2[prefix2 - 1] && str1[prefix1 - 2] === str2[prefix2 - 1] && str1[prefix1 - 1] === str2[prefix2 - 2]) {
        partialResults.push(1 + naiveInternal(str1, str2, prefix1 - 2, prefix2 - 2));
    }
    if (prefix1 > 0 && prefix2 > 0) {
        partialResults.push((str1[prefix1 - 1] === str2[prefix2 - 1] ? 0 : 1) + naiveInternal(str1, str2, prefix1 - 1, prefix2 - 1));
    }

    return Math.min(...partialResults);
}