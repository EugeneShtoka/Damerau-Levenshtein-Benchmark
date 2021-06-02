import { DualMapCache, MapCache } from './cache';
import { limitedSmartCached } from './limitedSmartCached';
import { tweakedCached } from './tweakedCached';
import { limitedCached } from './limitedCached';
import { naiveCached } from './naiveCached';
import { limited } from './limited';
import { naive } from './naive';

const testSet = require('./assets/testSet.json');

const typos = testSet.typos;
const dictionary = testSet.dictionary;

enum AlgoNames {
    Naive = 'naive',
    TweakedArrCached = 'tweaked-arr-cached',
    NaiveArrCached = 'naive-arr-cached',
    NaiveMapCached = 'naive-map-cached',
    NaiveDualMapCached = 'naive-dualMap-cached',
    Limited = 'limited',
    LimitedCapped = 'limited-capped',
    LimitedArrSmartCached = 'limited-arr-smart-cached',
    LimitedArrCached = 'limited-arr-cached',
    LimitedArrCachedCapped = 'limited-arr-cached-capped',
    LimitedMapCached = 'limited-map-cached',
    LimitedMapCachedCapped = 'limited-map-cached-capped',
    LimitedDualMapCached = 'limited-dualMap-cached',
    LimitedDualMapCachedCapped = 'limited-dualMap-cached-capped',
}

const pretendents = new Map<string, (str1: string, str2: string) => number>([
    // [AlgoNames.Naive, naive], // Commented out, as it takes more than 10 hours to complete on the example data.
    [AlgoNames.NaiveArrCached, naiveCached],
    [AlgoNames.NaiveMapCached, (str1: string, str2: string) => naiveCached(str1, str2, new MapCache())],
    [AlgoNames.NaiveDualMapCached, (str1: string, str2: string) => naiveCached(str1, str2, new DualMapCache())],
    [AlgoNames.TweakedArrCached, (str1: string, str2: string) => tweakedCached(str1, str2)],
    [AlgoNames.Limited, limited],
    [AlgoNames.LimitedCapped, (str1: string, str2: string) => limited(str1, str2, Math.max(str1.length, str2.length))],
    [AlgoNames.LimitedArrCached, limitedCached],
    [AlgoNames.LimitedArrSmartCached, limitedSmartCached],
]);

for (let i = 1; i <= 3; i++) {
    pretendents.set(`${AlgoNames.LimitedCapped}-${i}`, (str1: string, str2: string) => limited(str1, str2, i));
}

const results = new Map<string, number[]>();

for (let [key, value] of pretendents.entries()) {
    const res: number[] = new Array();
    console.time(key);
    for (let i = 0; i < typos.length; i++) {
        for (let j = 0; j < dictionary.length; j++) {
            res.push(value(typos[i], dictionary[j]));
        }
    }
    console.timeEnd(key);
    results.set(key, res);
}