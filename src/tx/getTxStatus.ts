import { Hash32, Tx } from "@harmoniclabs/plu-ts";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";
import { isSafeInteger } from "../utils/isSafeInteger";
import { KoiosError } from "../errors";

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
    .then( res =>  {

        if( !res.ok )
        throw new KoiosError("some error requiring tx status")

        return res.json()
    })
    .then( (resArray: any[]) => resArray.map( res => {

        return {
            txHash: new Hash32( res.tx_hash ),
            nConfirmations: Number( res.num_confirmations ?? 0 )
        };
    }));
}

const deafultMinConfirm = 20;
const interval = 5_000;
const defaultTimeout = 20_000

export async function waitTxConfirmed(
    txHash: CanBeTxHash, 
    timeout: number = defaultTimeout, 
    nConfirmations?: number,
    logs: boolean = false,
    network: KoiosNetwork = "mainnet"
): Promise<void>
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

    const tout =  (
        typeof timeout === "number" && 
        isSafeInteger( timeout ) && 
        timeout > interval
    ) ? 
    timeout : 
    defaultTimeout;

    const shouldLog = Boolean( logs );

    const start = Date.now();
    let lastConfirms = 0;
    while( true )
    {
        lastConfirms = (await getTxStatus( hash, network ))
            [0].nConfirmations;
        
        if(
            lastConfirms >= minConfirm 
        ){
            shouldLog && console.log(
                hash.toString() + " registered on chain"
            );
            return;
        }

        const now = Date.now() - start; 
        if( now > tout )
        throw new KoiosError(
            "'waitTxConfirmed' timed out; transaction took more than " +
            (now/1000).toString() + " seconds to receive at least " +
            minConfirm + " confiramtions; last number of confirmation was: " + lastConfirms
        );
        
        shouldLog && console.log(
            "last confirmations registred: " + lastConfirms +
            "\ntime elapsed: "+ now
        );
        await new Promise( res => setTimeout( res, interval ) );
    }
}