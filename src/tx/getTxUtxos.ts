import { Address, Data, Hash28, Hash32, Script, ScriptType, UTxO, Value, dataFromCbor } from "@harmoniclabs/plu-ts";
import { KoiosError } from "../errors";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";
import { CanBeTxHash, forceHashStr } from "./CanBeTxHash";
import { fromHex } from "@harmoniclabs/uint8array-utils";
import { parseUTxO } from "./utils/parseUTxO";

export interface TxUtxosResult {
    txHash: Hash32,
    inputs: UTxO[],
    outputs: UTxO[]
}

export async function getTxUtxos( txns: CanBeTxHash | CanBeTxHash[], network: KoiosNetwork = "mainnet" ): Promise<TxUtxosResult[]>
{
    const hashes = Array.isArray( txns ) ?
        txns.map( forceHashStr ) :
        [ forceHashStr( txns ) ];

    // tx_utxos endpoint is missing datums and ref scripts
    return fetch(`https://${netToDom(network)}.koios.rest/api/v0/tx_info`, {
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
        throw new KoiosError("some error requiring tx infos: " + res.status + " => " + res.statusText )

        return res.json();
    })
    .then( (resArray: any[]) => resArray.map( res => {

        return {
            txHash: new Hash32( res.tx_hash ),
            inputs: (res.inputs as any[]).map( parseUTxO ),
            outputs: (res.outputs as any[]).map( parseUTxO )
        };
    }));
}