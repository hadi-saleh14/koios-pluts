
export function defineRO(
    o: any,
    name: string | number | symbol,
    value: any
)
{
    if( typeof o !== "object" || o === null ) return o;
    return Object.defineProperty(
        o, name,
        {
            value,
            writable: false,
            enumerable: true,
            configurable: false
        }
    );
}