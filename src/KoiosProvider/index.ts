import { KoiosAddressEndpoionts } from "../address";
import { KoiosEpochEndpoionts } from "../epoch";
import { KoiosNetworkInfosEndpoionts } from "../network";
import { KoiosTxEndpoionts } from "../tx";
import { KoiosNetwork, WithNetwork } from "../types";
import { defineNetwork } from "../utils/defineNetwork";
import { defineRO } from "../utils/defineRO";

export class KoiosProvider
    implements WithNetwork
{
    readonly network!: KoiosNetwork;
    readonly address!: KoiosAddressEndpoionts;
    readonly networkInfo!: KoiosNetworkInfosEndpoionts;
    readonly epoch!: KoiosEpochEndpoionts;
    readonly tx!: KoiosTxEndpoionts;

    constructor( network?: KoiosNetwork )
    {
        defineNetwork( this, network );

        defineRO( this, "address", new KoiosAddressEndpoionts( this.network ) );
        defineRO( this, "networkInfo", new KoiosNetworkInfosEndpoionts( this.network ) );
        defineRO( this, "epoch", new KoiosEpochEndpoionts( this.network ) );
        defineRO( this, "tx", new KoiosTxEndpoionts( this.network ) );
    }
}