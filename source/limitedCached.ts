import { ArrCache, ICache } from "./cache";

export function limitedCached(str1: string, str2: string, limit = Number.POSITIVE_INFINITY, cache: ICache<number> = new ArrCache(str1.length, str2.length)): number {
    return limitedCachedWrapper(str1, str2, str1.length, str2.length, limit, cache);
}

function limitedCachedWrapper(str1: string, str2: string, prefix1: number, prefix2: number, limit: number, cache: ICache<number>): number {
    let result = cache.get(prefix1, prefix2);
    if (result === undefined) {
        result = limitedInternal(str1, str2, prefix1, prefix2, limit, cache);
        if (result !== Number.POSITIVE_INFINITY) {
            cache.set(prefix1, prefix2, result);
        }
    }

    return result > limit ? Number.POSITIVE_INFINITY : result;
}

function limitedInternal(str1: string, str2: string, prefix1: number, prefix2: number, limit: number, cache: ICache<number>): number {
    if (limit < 0 || Math.abs(prefix1 - prefix2) > limit) {
        return Number.POSITIVE_INFINITY;
    }

    if (prefix1 === 0 || prefix2 === 0) {
        return prefix1 + prefix2;
    }

    if (str1[prefix1 - 1] === str2[prefix2 - 1]) {
        return limitedCachedWrapper(str1, str2, --prefix1, --prefix2, limit, cache);
    }

    if (limit <= 0) {
        return Number.POSITIVE_INFINITY;
    }

    const skipLetters = prefix1 > 1 && prefix2 > 1 && str1[prefix1 - 2] === str2[prefix2 - 1] && str1[prefix1 - 1] === str2[prefix2 - 2] ? 2 : 1;
    const indices = [[prefix1, prefix2 - 1], [prefix1 - 1, prefix2]];

    return 1 + indices.reduce(
        (result, ind) => Math.min(result, limitedInternal(str1, str2, ind[0], ind[1], Math.min(result, limit) - 1, cache)),
        limitedInternal(str1, str2, prefix1 - skipLetters, prefix2 - skipLetters, limit - 1, cache)
    );
}