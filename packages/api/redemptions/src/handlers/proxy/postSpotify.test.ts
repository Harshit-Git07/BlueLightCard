import { describe, expect, test } from '@jest/globals';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { handler, IAPIGatewayEvent } from './postSpotify';
describe('Spotify Proxy Handler', () => {

    test('should return 200', async () => {
        const event: Partial<IAPIGatewayEvent> = {
            body: JSON.stringify({ test: 'test' })
        }
        const res = await handler(
            event as IAPIGatewayEvent
        );

        expect(res).toEqual(Response.OK({ message: 'Success', data: {} }));
    });
});
