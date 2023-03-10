import { KoiosNetwork, WithNetwork } from "../types";
import { defineNetwork } from "../utils/defineNetwork";
import { KoiosChainTip, queryChainTip } from "./queryChainTip";

export class KoiosNetworkInfosEndpoionts
    implements WithNetwork
{
    readonly network!: KoiosNetwork;

    constructor( network?: KoiosNetwork )
    {
        defineNetwork( this, network );
    }

    chainTip(): Promise<KoiosChainTip>
    {
        return queryChainTip( this.network )
    }
}