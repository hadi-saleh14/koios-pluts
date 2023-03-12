import { Hash32, Tx } from "@harmoniclabs/plu-ts";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";
import { KoiosError } from "../errors/KoiosError";

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

    return fetch(`https://${netToDom(net)}.koios.rest/api/v0/submittx`, {
        method: "post",
        headers: {
          'Content-Type': 'application/cbor'
        },
        body: tx.toCbor().toBuffer().buffer
    })
    .then(  res =>  {

        if( !res.ok )
        throw new KoiosError(
            "error submitting '" + tx.hash.toString() + "' transaction; " +
            "endpoint used: " + `https://${netToDom(net)}.koios.rest/api/v0/submittx ` +
            "JSON form of the tranascton: " +
            JSON.stringify(
                tx.toJson(),
                undefined,
                2
            )
        );

        return tx.hash;
    })
}