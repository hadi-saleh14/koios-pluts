import { Hash32, Tx } from "@harmoniclabs/plu-ts";
import { KoiosNetwork, WithNetwork } from "../types";
import { defineNetwork } from "../utils/defineNetwork";
import { TxSatatus, getTxStatus, waitTxConfirmed } from "./getTxStatus";
import { submitTx } from "./submit";
import { CanBeTxHash } from "./CanBeTxHash";
import { TxUtxosResult, getTxUtxos } from "./getTxUtxos";

export class KoiosTxEndpoionts
    implements WithNetwork
{
    readonly network!: KoiosNetwork;

    constructor( network?: KoiosNetwork )
    {
        defineNetwork( this, network );
    }

    submit( tx: Tx ): Promise<Hash32>
    {
        return submitTx( tx, this.network );
    }

    waitConfirmed( txHash: CanBeTxHash, timeout?: number, nConfirmations?: number, logs?: boolean ): Promise<void>
    {
        return waitTxConfirmed( txHash, timeout, nConfirmations, logs, this.network );
    }

    status( txns: CanBeTxHash | CanBeTxHash[] ): Promise<TxSatatus[]>
    {
        return getTxStatus( txns, this.network );
    }

    utxos( txns: CanBeTxHash | CanBeTxHash[] ): Promise<TxUtxosResult[]>
    {
        return getTxUtxos( txns, this.network );
    }
}