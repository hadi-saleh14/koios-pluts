import { Address, Data, Hash28, Hash32, Script, ScriptType, UTxO, Value, dataFromCbor } from "@harmoniclabs/plu-ts";
import { fromHex } from "@harmoniclabs/uint8array-utils";

export function parseUTxO( u: any ): UTxO
{
    const lovelaces = Value.lovelaces( BigInt( u.value ?? 0 ) );
    const value = (u?.asset_list as any[])?.reduce<Value>(
        (accum, entry) => Value.add(
            accum,
            new Value([
                {
                    policy: new Hash28( entry.policy_id ),
                    assets: [
                        {
                            name: fromHex( entry.asset_name ?? ""),
                            quantity: BigInt( entry.quantity )
                        }
                    ]
                }
            ])
        ), 
        lovelaces
    ) ?? lovelaces;

    let datum: undefined | Hash32 | Data = undefined

    if( u.datum_hash )
    {
        datum = new Hash32( u.datum_hash )
    }
    if( u.inline_datum )
    {
        datum = dataFromCbor( u.inline_datum.bytes )
    }
    
    let refScript: Script | undefined = undefined;

    if( u.reference_script )
    {
        refScript = new Script(
            (u.reference_script.type as string)?.includes("1") ?
            ScriptType.PlutusV1 : ScriptType.PlutusV2,
            fromHex( u.reference_script.bytes )
        );
    }
    
    return new UTxO({
        utxoRef: {
            id: u.tx_hash as string,
            index: Number( u.tx_index )
        },
        resolved: {
            address: Address.fromString( u.payment_addr.bech32 ),
            value,
            datum,
            refScript
        }
    })
}