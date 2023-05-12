import { CostModels, ExBudget, ProtocolParamters } from "@harmoniclabs/plu-ts";
import { isSafeInteger } from "../utils/isSafeInteger";
import { getCurrentEpoch } from "../utils/getCurrentEpoch";
import { KoiosNetwork } from "../types";
import { netToDom } from "../utils/netToDom";

function withAllValuesAsBigInt( obj: any ): any
{
    const ks = Object.keys( obj );
    const res: any = {};
    for(const k of ks)
    {
        res[k] = BigInt( obj[k] );
    }

    return res;
}

function adaptKoiosCostModel( str: string ): CostModels
{
    const { PlutusV1, PlutusV2  } = JSON.parse( str );

    const res: CostModels = {};

    if( typeof PlutusV1 === "object" && PlutusV1 !== undefined )
    {
        Object.defineProperty(
            res, "PlutusScriptV1", {
                value: withAllValuesAsBigInt( PlutusV1 ),
                writable: false,
                enumerable: true,
                configurable: false
            }
        );
    }

    if( typeof PlutusV2 === "object" && PlutusV2 !== undefined )
    {
        Object.defineProperty(
            res, "PlutusScriptV2", {
                value: withAllValuesAsBigInt( PlutusV2 ),
                writable: false,
                enumerable: true,
                configurable: false
            }
        );
    }

    return res;
}

export function getProtocolParameters( epoch: number = -1, network: KoiosNetwork = "mainnet" ): Promise<ProtocolParamters>
{
    const currEpoch = getCurrentEpoch( network );
    const e = 
        (
            typeof epoch === "number" && 
            isSafeInteger( epoch ) && 
            epoch < currEpoch && 
            epoch >= 0 
        ) ? 
        epoch : 
        currEpoch;

    return fetch(`https://${netToDom(network)}.koios.rest/api/v0/epoch_params?_epoch_no=${e.toString()}`)
    .then( res => res.json())
    .then( (_res: any) => {
        const res = _res[0];
        return {
            txFeePerByte: res.min_fee_a ?? 0,
            txFeeFixed: res.min_fee_b ?? 0,
            maxBlockBodySize: res.max_block_size ?? 0,
            maxTxSize: res.max_tx_size ?? 0,
            maxBlockHeaderSize: res.max_bh_size ?? 0,
            stakeAddressDeposit: BigInt( res.key_deposit ) ,
            stakePoolDeposit: BigInt( res.pool_deposit ) ,
            poolRetireMaxEpoch: res.max_epoch  ?? 0,
            stakePoolTargetNum: res.optimal_pool_count  ?? 0,
            poolPledgeInfluence: res.influence  ?? 0,
            monetaryExpansion: res.monetary_expand_rate ?? 0 ,
            treasuryCut: res.treasury_growth_rate ?? 0 ,
            protocolVersion: {
                major: res.protocol_major ?? 0,
                minor: res.protocol_minor ?? 0
            },
            minPoolCost: BigInt( res.min_pool_cost ?? 0 ) ,
            utxoCostPerByte: BigInt( res.coins_per_utxo_size ?? 0) ,
            costModels: adaptKoiosCostModel( res.cost_models ?? "{}" ),
            executionUnitPrices: {
                priceMemory: res.price_mem ?? 0,
                priceSteps: res.price_step ?? 0
            },
            maxTxExecutionUnits: new ExBudget({
                mem: res.max_tx_ex_mem ?? 0,
                cpu: res.max_tx_ex_steps ?? 0
            }),
            maxBlockExecutionUnits: new ExBudget({
                mem: BigInt( res.max_block_ex_mem ?? 0 ),
                cpu: BigInt( res.max_block_ex_steps ?? 0)
            }),
            maxValueSize: res.max_val_size ?? 0 ,
            collateralPercentage: res.collateral_percent ?? 0 ,
            maxCollateralInputs: BigInt( res.max_collateral_inputs ?? 0 )
        } as ProtocolParamters
    })
}