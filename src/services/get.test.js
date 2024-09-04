import { expect, test } from 'vitest'
import axios from 'axios';

async function handleGetLogs(id){
    try {
        const response = await axios.get(`http://localhost:3000/api/log/${id}`);
        return response;
    } catch (error) {
        console.log(error)
    }
}

test('Retorna um log existente', async () => {
    const response = await handleGetLogs(1);
    expect(response.status).toBe(200);
});