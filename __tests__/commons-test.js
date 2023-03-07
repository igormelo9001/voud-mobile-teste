// import React from 'react';
// import toJson from 'enzyme-to-json';

import { adyenEncrypt } from '../src/utils/crypto-util';

describe('Test Result from adyenEncrypt ', () => {
	it('should /src/components/adyenEncrypt result not undefined', async () => {
        const result = await adyenEncrypt(
			{ holder: 'Teste', cardNumber: 5555444433331111, securityCode: 737, expirationDate: '10/2020' },
            8415505105630389
        );
		expect(result).toMatchSnapshot();
    });
});
