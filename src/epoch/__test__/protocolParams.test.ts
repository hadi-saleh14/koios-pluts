import { getProtocolParameters } from "..";
import { isProtocolParameters } from "@harmoniclabs/plu-ts";

describe("protocolParams", () => {

    test("default epoch preprod", async () => {

        expect(
            isProtocolParameters(
                await getProtocolParameters( 10,"preprod")
            )
        ).toBe( true );

    })
})