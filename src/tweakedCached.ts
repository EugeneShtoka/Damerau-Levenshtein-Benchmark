import { ArrCache, ICache } from "./cache";

export function tweakedCached(str1: string, str2: string, cache: ICache<number> = new ArrCache(str1.length, str2.length)): number {
    return tweakedCachedWrapper(str1, str2, str1.length, str2.length, cache);
}

function tweakedCachedWrapper(str1: string, str2: string, prefix1: number, prefix2: number, cache: ICache<number>): number {
    let result = cache.get(prefix1, prefix2);
    if (result === undefined) {
        result = tweaked(str1, str2, prefix1, prefix2, cache);
        cache.set(prefix1, prefix2, result);
    }
    
    return result;
}

function tweaked(str1: string, str2: string, prefix1: number, prefix2: number, cache: ICache<number>): number {
    if (prefix1 === 0 || prefix2 === 0) {
        return prefix1 + prefix2;
    }
    
    if (str1[prefix1 - 1] === str2[prefix2 - 1]) {
        return tweakedCachedWrapper(str1, str2, prefix1 - 1, prefix2 - 1, cache);
    }

    const skipLetters = prefix1 > 1 && prefix2 > 1 && str1[prefix1 - 2] === str2[prefix2 - 1] && str1[prefix1 - 1] === str2[prefix2 - 2] ? 2 : 1;

    return 1 + Math.min(
        tweakedCachedWrapper(str1, str2, prefix1 - skipLetters, prefix2 - skipLetters, cache),
        tweakedCachedWrapper(str1, str2, prefix1 - 1, prefix2, cache),
        tweakedCachedWrapper(str1, str2, prefix1, prefix2 - 1, cache),
    );
}

