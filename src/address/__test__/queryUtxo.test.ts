import { getAddressUtxos } from "..";
import { KoiosProvider } from "../..";

const koios = new KoiosProvider("testnet");

describe("address endpoints", () => {

    test("query utxos",async () => {

        const utxos = await getAddressUtxos("addr_test1vpv03vsr8mtgu7sftu82x0y3nmv4fs6xnkw5jvrkw3luw3ck4hmfa", "testnet");
        const utxos2 = await koios.address.utxos("addr_test1vpv03vsr8mtgu7sftu82x0y3nmv4fs6xnkw5jvrkw3luw3ck4hmfa");

        expect(
            utxos
        ).toEqual(
            utxos2
        );

    })
})