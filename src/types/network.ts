
export type KoiosNetwork
    = "mainnet"
    | "testnet" // preprod
    | "preprod"
    | "preview"

export interface WithNetwork {
    readonly network: KoiosNetwork
}