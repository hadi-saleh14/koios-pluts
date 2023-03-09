
const MAX_SAFE_INT = 9007199254740991;
const MIN_SAFE_INT = -9007199254740991

export function isSafeInteger( n: number ): boolean
{
    return (
        typeof n === "number" &&
        n <= MAX_SAFE_INT && n >= MIN_SAFE_INT && // NaN returns false for any comparison
        n === Math.round( n ) // is actually an integer
    );
}