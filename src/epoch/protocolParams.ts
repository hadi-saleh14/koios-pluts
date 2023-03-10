import { CostModels, ProtocolParamters } from "@harmoniclabs/plu-ts";
import { isSafeInteger } from "../utils/isSafeInteger";
import { getCurrentEpoch } from "../utils/getCurrentEpoch";
import { ExBudget } from "@harmoniclabs/plu-ts/dist/onchain/CEK/Machine/ExBudget";
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
    .then( res => (res.json() as any)[0])
    .then( (res: any) => {

        return {
            txFeePerByte: res.min_fee_a,
            txFeeFixed: res.min_fee_b,
            maxBlockBodySize: res.max_block_size,
            maxTxSize: res.max_tx_size ,
            maxBlockHeaderSize: res.max_bh_size ,
            stakeAddressDeposit: BigInt( res.key_deposit ) ,
            stakePoolDeposit: BigInt( res.pool_deposit ) ,
            poolRetireMaxEpoch: res.max_epoch ,
            stakePoolTargetNum: res.optimal_pool_count ,
            poolPledgeInfluence: res.influence ,
            monetaryExpansion: res.monetary_expand_rate ,
            treasuryCut: res.treasury_growth_rate ,
            protocolVersion: {
                major: res.protocol_major,
                minor: res.protocol_minor
            },
            minPoolCost: BigInt( res.min_pool_cost ) ,
            utxoCostPerByte: BigInt( res.coins_per_utxo_size ?? 0) ,
            costModels: adaptKoiosCostModel( res.cost_models ?? "{}" ),
            executionUnitPrices: {
                priceMemory: res.price_mem,
                priceSteps: res.price_step
            },
            maxTxExecutionUnits: new ExBudget({
                mem: res.max_tx_ex_mem ?? 0,
                cpu: res.max_tx_ex_steps ?? 0
            }),
            maxBlockExecutionUnits: new ExBudget({
                mem: BigInt( res.max_block_ex_mem ?? 0 ),
                cpu: BigInt( res.max_block_ex_steps ?? 0)
            }),
            maxValueSize: res.max_val_size ,
            collateralPercentage: res.collateral_percent ,
            maxCollateralInputs: BigInt( res.max_collateral_inputs )
        } as ProtocolParamters
    })
}