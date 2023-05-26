import { ArrCache, ICache } from "./cache";

export function naiveCached(str1: string, str2: string, cache: ICache<number> = new ArrCache(str1.length, str2.length)): number {
    return naiveCachedWrapper(str1, str2, str1.length, str2.length, cache);
}

function naiveCachedWrapper(str1: string, str2: string, prefix1: number, prefix2: number, cache: ICache<number>): number {
    let result = cache.get(prefix1, prefix2);
    if (result === undefined) {
        result = naive(str1, str2, prefix1, prefix2, cache);
        cache.set(prefix1, prefix2, result);
    }
    
    return result;
}

function naive(str1: string, str2: string, prefix1: number, prefix2: number, cache: ICache<number>): number {
    if (prefix1 === 0 && prefix2 === 0) {
        return 0;
    }
    const partialResults: number[] = [];
    if (prefix1 > 0) {
        partialResults.push(1 + naiveCachedWrapper(str1, str2, prefix1 - 1, prefix2, cache));
    }
    if (prefix2 > 0) {
        partialResults.push(1 + naiveCachedWrapper(str1, str2, prefix1, prefix2 - 1, cache));
    }
    if (prefix1 > 1 && prefix2 > 1 && str1[prefix1 - 1] !== str2[prefix2 - 1] && str1[prefix1 - 2] === str2[prefix2 - 1] && str1[prefix1 - 1] === str2[prefix2 - 2]) {
        partialResults.push(1 + naiveCachedWrapper(str1, str2, prefix1 - 2, prefix2 - 2, cache));
    }
    if (prefix1 > 0 && prefix2 > 0) {
        partialResults.push((str1[prefix1 - 1] === str2[prefix2 - 1] ? 0 : 1) + naiveCachedWrapper(str1, str2, prefix1 - 1, prefix2 - 1, cache));
    }

    return Math.min(...partialResults);
}

