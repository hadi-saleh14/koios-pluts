import { Hash32 } from "@harmoniclabs/plu-ts"

export type KoiosChainTip = {
    hash: Hash32,
    epoch: number,
    slot: number,
    epochSlot: number,
    blockNumber: number,
    blockTimestamp: number
}

export function queryChainTip(): Promise<KoiosChainTip>
{
    return fetch("https://api.koios.rest/api/v0/tip")
        .then( res => res.json() )
        .then( (_res) => {

            const res = _res[0];
            return {
                hash: new Hash32(res.hash),
                epoch: res.epoch_no,
                slot: res.abs_slot,
                epochSlot: res.epoch_slot,
                blockNumber: res.block_no,
                blockTimestamp: res.block_time
            } as KoiosChainTip
        })
}