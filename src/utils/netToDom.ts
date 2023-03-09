import { KoiosNetwork } from "../types";

export function netToDom( network: KoiosNetwork ): string
{
    if( network === "testnet" || network === "preprod" )
    {
        return "preprod"
    }
    if( network === "preview" )
    {
        return "preview"
    };
    return "api";
}