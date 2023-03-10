

export function defineNetwork(
    o: any,
    network?: any
)
{
    if( typeof o !== "object" || o === null ) return o;
    return Object.defineProperty(
        o, "network",
        {
            value: network === "testnet" || network === "preprod" ? "preprod" :
                network === "preview" ? "preview" :
                "mainnet",
            writable: false,
            enumerable: true,
            configurable: false
        }
    );
}