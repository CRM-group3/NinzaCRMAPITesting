import {test, expect} from '@playwright/test'

test('API GET Request', async({request}) => {

    const response = await request.get('http://49.249.28.218:8098/quote/all');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('QTS00163');
    console.log(await response.json());

})