import { ProtocolParamters } from "@harmoniclabs/plu-ts";
import { KoiosNetwork, WithNetwork } from "../types";
import { defineNetwork } from "../utils/defineNetwork";
import { getProtocolParameters } from "./protocolParams";

export class KoiosEpochEndpoionts
    implements WithNetwork
{
    readonly network!: KoiosNetwork;

    constructor( network?: KoiosNetwork )
    {
        defineNetwork( this, network );
    }

    protocolParams( epoch: number = -1 ): Promise<ProtocolParamters>
    {
        return getProtocolParameters( epoch, this.network );
    }
}