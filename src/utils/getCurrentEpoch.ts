export function getCurrentEpoch(): number
{
    return Math.floor(
        (
            (
                Date.now() -
                Date.UTC( 2017, 8, 23, 21, 44, 51, 0 ) // Cardano mainnet start
            ) / 86_400_000 // milliseconds in a day
        ) // days since mainnet start
        / 5
    );
}