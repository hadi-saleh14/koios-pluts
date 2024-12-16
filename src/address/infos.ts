import { Address, AddressStr, Data, Hash28, Hash32, Script, ScriptType, StakeAddress, UTxO, Value, dataFromCbor } from "@harmoniclabs/plu-ts";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";
import { fromHex } from "@harmoniclabs/uint8array-utils";

export type AddrLike = Address | AddressStr;

export interface AddressInfos {
    address: Address,
    stakeAddress?: StakeAddress,
    totLovelaces: bigint,
    utxos: UTxO[]
}

export function getAddressInfos( addrs: AddrLike | AddrLike[], network: KoiosNetwork = "mainnet" ): Promise<AddressInfos[]>
{
    const queryArg = Array.isArray( addrs ) ? 
        addrs.map( addr => addr.toString() ) : 
        [ addrs.toString() ];

    return fetch(`https://${netToDom(network)}.koios.rest/api/v1/address_info`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _addresses: queryArg
        })
    })
    .then( res => res.json() )
    .then( resArray => {

        return resArray.map( (res: any) => {

            const addr = Address.fromString( res.address );

            const utxos = (res.utxo_set as any[])?.map<UTxO>( (u: any) => {

                const lovelaces = Value.lovelaces( BigInt( u.value ?? 0 ) );
                const value = (u?.asset_list as any[])?.reduce<Value>(
                    (accum, entry) => Value.add(
                        accum,
                        new Value([
                            {
                                policy: new Hash28( entry.policy_id ),
                                assets: [
                                    {
                                        name: fromHex( entry.name ?? ""),
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
                        index: u.tx_index ?? 0,
                        id: u.tx_hash ?? "ff".repeat(32)
                    },
                    resolved: {
                        address: addr.clone(),
                        value,
                        datum,
                        refScript
                    }
                })
            }) ?? [];
    
            return {
                address: addr,
                stakeAddress: Boolean( res.stake_address ) ? StakeAddress.fromString( res.stake_address ) : undefined,
                totLovelaces: BigInt( res.balance ?? 0 ),
                utxos
            }
        })
    })
}

export async function getAddressUtxos( addrs: AddrLike | AddrLike[], network: KoiosNetwork = "mainnet" ): Promise<UTxO[]>
{
    return (await getAddressInfos( addrs, network ))
        .reduce(
            (accum, info) => accum.concat( info.utxos ),
            [] as UTxO[]
        );
}
