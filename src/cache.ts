export interface ICache<T> {
    get(ind1: number, ind2: number): T | undefined;
    set(ind1: number, ind2: number, value: T): void;
}

export class ArrCache<T> implements ICache<T> {
    private readonly cache: (T | undefined)[][];

    constructor(len1: number, len2: number) {
        this.cache = [];
        for (let i = 0; i <= len1; i++) {
            this.cache[i] = new Array(len2 + 1);
        }
    }

    public get(ind1: number, ind2: number): T | undefined {
        return this.cache[ind1][ind2];
    }

    public set(ind1: number, ind2: number, value: T): void {
        this.cache[ind1][ind2] = value;
    }
}

export class MapCache<T> implements ICache<T> {
    private readonly cache: Map<string, T>;

    private static getKey(ind1: number, ind2: number): string { 
        return `${ind1}-${ind2}`;
    }

    constructor() {
        this.cache = new Map();
    }

    public get(ind1: number, ind2: number): T | undefined {
        return this.cache.get(MapCache.getKey(ind1, ind2));
    }

    public set(ind1: number, ind2: number, value: T): void {
        this.cache.set(MapCache.getKey(ind1, ind2), value);
    }
}
export class DualMapCache<T> implements ICache<T> {
    private readonly cache: Map<number, Map<number, T>>;

    constructor() {
        this.cache = new Map();
    }

    public get(ind1: number, ind2: number): T | undefined {
        return this.cache.get(ind1)?.get(ind2);
    }

    public set(ind1: number, ind2: number, value: T): void {
        let level1 = this.cache.get(ind1);
        if (!level1) {
            level1 = new Map<number, T>();
            this.cache.set(ind1, level1);
        }

        level1.set(ind2, value);
    }
}