import { Tx, Hash32 } from "@harmoniclabs/plu-ts";

export type CanBeTxHash = Tx | Hash32 | string

export function forceHashStr( canBe: CanBeTxHash ): string
{
    return canBe instanceof Tx ? canBe.hash.toString() :
        canBe instanceof Hash32 ? canBe.toString() :
        canBe;
}