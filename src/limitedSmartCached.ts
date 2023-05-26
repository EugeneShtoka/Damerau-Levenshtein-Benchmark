import { ArrCache, ICache } from "./cache";

class SmartCell {
    constructor(public value: number | undefined, public bottomLimit: number | undefined) { }

    public get(limit: number): number | undefined {
        if (this.value && this.value <= limit) {
            return this.value;
        }

        if (this.bottomLimit && limit <= this.bottomLimit) {
            return Number.POSITIVE_INFINITY;
        }

        return undefined;
    }

    public set(limit: number, value: number): void {
        if (value !== Number.POSITIVE_INFINITY) {
            this.value = value;
        } else if (this.bottomLimit && this.bottomLimit < limit) {
            this.bottomLimit = limit;
        }
    }
}

export function limitedSmartCached(str1: string, str2: string, limit = Number.POSITIVE_INFINITY, cache: ICache<SmartCell> = new ArrCache(str1.length, str2.length)): number {
    return limitedSmartCachedWrapper(str1, str2, str1.length, str2.length, limit, cache);
}

export function limitedSmartCachedWrapper(str1: string, str2: string, prefix1: number, prefix2: number, limit: number, cache: ICache<SmartCell>): number {
    let smartCell = cache.get(prefix1, prefix2);
    if (!smartCell) {
        smartCell = new SmartCell(undefined, undefined);
        cache.set(prefix1, prefix2, smartCell);
    }
    let result = smartCell.get(limit);
    if (result === undefined) {
        result = limitedInternal(str1, str2, prefix1, prefix2, limit, cache);
        smartCell.set(limit, result);
    }
    return result ?? Number.POSITIVE_INFINITY;
}

function limitedInternal(str1: string, str2: string, prefix1: number, prefix2: number, limit: number, cache: ICache<SmartCell>): number {
    if (limit < 0 || Math.abs(prefix1 - prefix2) > limit) {
        return Number.POSITIVE_INFINITY;
    }

    if (prefix1 === 0 || prefix2 === 0) {
        return prefix1 + prefix2;
    }

    if (str1[prefix1 - 1] === str2[prefix2 - 1]) {
        return limitedSmartCachedWrapper(str1, str2, --prefix1, --prefix2, limit, cache);
    }

    if (limit === 0) {
        return Number.POSITIVE_INFINITY;
    }

    const skipLetters = prefix1 > 1 && prefix2 > 1 && str1[prefix1 - 2] === str2[prefix2 - 1] && str1[prefix1 - 1] === str2[prefix2 - 2] ? 2 : 1;
    const indices = [[prefix1, prefix2 - 1], [prefix1 - 1, prefix2]];

    return 1 + indices.reduce(
        (result, ind) => Math.min(result, 1 + limitedSmartCachedWrapper(str1, str2, ind[0], ind[1], Math.min(result, limit) - 1, cache)),
        1 + limitedSmartCachedWrapper(str1, str2, prefix1 - skipLetters, prefix2 - skipLetters, limit - 1, cache)
    );
}