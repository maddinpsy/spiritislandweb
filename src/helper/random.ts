
const OFFSET = 1013904223;
const MULTIPLIER = 1664525;
const MAX_INT32 = 2 ** 32 - 1;

class PRNG {
    seed: number;
    constructor(seed: number | string) {
        if (typeof (seed) === "number") {
            this.seed = seed;
        } else {
            this.seed = Array.from(seed).map(x => x.charCodeAt(0)).reduce((hash, value) => hash * 31 + value, 0);
        }
    }
    nextInt() {
        this.seed = ~~(((MULTIPLIER * this.seed) + OFFSET) % MAX_INT32);
        return this.seed;
    };

    nextFloat() {
        return this.nextInt() / MAX_INT32;
    };
}

function shuffleArray<T>(array: T[], seed: string = "") {
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        [array[randomIndex], array[currentIndex]] = [array[currentIndex], array[randomIndex]];
    }
}

export { PRNG, shuffleArray }