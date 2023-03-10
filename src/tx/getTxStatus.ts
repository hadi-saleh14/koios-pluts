import { Hash32, Tx } from "@harmoniclabs/plu-ts";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";
import { isSafeInteger } from "../utils/isSafeInteger";

export type CanBeTxHash = Tx | Hash32 | string

export type TxSatatus = {
    txHash: Hash32,
    nConfirmations: number
}

function forceHashStr( canBe: CanBeTxHash ): string
{
    return canBe instanceof Tx ? canBe.hash.toString() :
        canBe instanceof Hash32 ? canBe.toString() :
        canBe;
}

export async function getTxStatus( txns: CanBeTxHash | CanBeTxHash[], network: KoiosNetwork = "mainnet" ): Promise<TxSatatus[]>
{
    const hashes = Array.isArray( txns ) ?
        txns.map( forceHashStr ) :
        [ forceHashStr( txns ) ];

    return fetch(`https://${netToDom(network)}.koios.rest/api/v0/tx_status`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _tx_hashes: hashes
        })
    })
    .then( res => res.json() )
    .then( (resArray: any[]) => resArray.map( res => {

        return {
            txHash: new Hash32( res.tx_hash ),
            nConfirmations: Number( res.num_confirmations ?? 0 )
        };
    }));
}

const deafultMinConfirm = 20;
const interval = 5_000;

export async function waitTxConfirmed( txHash: CanBeTxHash, nConfirmations?: number, network: KoiosNetwork = "mainnet" ): Promise<void>
{
    const hash = forceHashStr( txHash );
    const minConfirm =
        (
            typeof nConfirmations === "number" && 
            isSafeInteger( nConfirmations ) && 
            nConfirmations > 0 
        ) ? 
        nConfirmations : 
        deafultMinConfirm;

    while( true )
    {
        if(
            (await getTxStatus( hash, network ))
            [0].nConfirmations >= minConfirm 
        )
            return
        
        await new Promise( res => setTimeout( res, interval ) );
    }
}