import { KoiosNetwork } from "../types";

export function getCurrentEpoch( network: KoiosNetwork = "mainnet" ): number
{
    if( network === "preprod" || network === "testnet" )
    {
        return Math.floor(
            (
                (
                    Date.now() -
                    1654041600_000 // preprod start
                ) / 86_400_000 // milliseconds in a day
            ) / 5
        )
    }

    if( network === "preview" )
    {
        return Math.floor(
            (
                (
                    Date.now() -
                    1666656000_000 // preview start
                ) / 86_400_000 // milliseconds in a day
            ) // / 5 // nope; 1 day per epoch preview
        )
    }

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