import { Hash32, Tx } from "@harmoniclabs/plu-ts";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";

/**
 * 
 * @param {Tx} tx the transaction tu submit
 * @param {Tx} network the network, used mainly if you want to specify the testnet;
 * @returns {Hash32} the tx hash to be inline with CIP30 but you migth as well get it using `tx.hash`
 */
export async function submitTx( tx: Tx, network: KoiosNetwork = "mainnet" ): Promise<Hash32>
{
    const net: KoiosNetwork = tx.body.network === "testnet" ?
        ( network === "preview" ? "preview" : "preprod" ) :
        "mainnet";

    return fetch(`https://${netToDom(net)}.koios.rest/api/v0/address_info`, {
        method: "post",
        headers: {
          'Content-Type': 'application/cbor'
        },
        body: tx.toCbor().toBuffer().buffer
    })
    .then( _ => tx.hash )
}