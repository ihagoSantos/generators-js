/**
 * enriquecimento de dados
 * 
 * 1. ler de um banco
 * 2. bater em uma API para pegar o resto das informacoes
 * 3. submeter os dados para outra API
 */

import axios from 'axios'

const myDB = async () => Array.from({ length: 1000 }, (v, k) => `${k}-cellphone`)

const PRODUCTS_URL = 'http://localhost:3000/products'
const CART_URL = 'http://localhost:4000/cart'

// aguarda o processamento dos dados
async function processDbData() { 
    const products = await myDB()
    
    const responses = []
    for(const product of products) {
        const { data: productInfo } = await axios.get(`${PRODUCTS_URL}?productName=${product}`)
        const { data: cartData } = await axios.post(`${CART_URL}`, productInfo)
        responses.push(cartData)
    }

    return responses
}

// console.table(await processDbData())

// Gera dados sob demanda
async function* processDbDataGenerator() {
    const products = await myDB()
    
    for(const product of products) {
        const { data: productInfo } = await axios.get(`${PRODUCTS_URL}?productName=${product}`)
        const { data: cartData } = await axios.post(`${CART_URL}`, productInfo)
        yield cartData // retorno do generator
    }
}

for await (const data of processDbDataGenerator()){
    console.table(data)
}
