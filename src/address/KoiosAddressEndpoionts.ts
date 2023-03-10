import { UTxO } from "@harmoniclabs/plu-ts";
import { KoiosNetwork, WithNetwork } from "../types";
import { defineNetwork } from "../utils/defineNetwork";
import { AddrLike, AddressInfos, getAddressInfos, getAddressUtxos } from "./infos";

export class KoiosAddressEndpoionts
    implements WithNetwork
{
    readonly network!: KoiosNetwork;

    constructor( network?: KoiosNetwork )
    {
        defineNetwork( this, network );
    }

    infos( addrs: AddrLike | AddrLike[] ): Promise<AddressInfos[]>
    {
        return getAddressInfos( addrs, this.network )
    }

    utxos( addrs: AddrLike | AddrLike[] ): Promise<UTxO[]>
    {
        return getAddressUtxos( addrs )
    }
}