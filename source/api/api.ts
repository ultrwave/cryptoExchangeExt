import axios from 'axios';

const APIKey = 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd'

const instance = axios.create({
  // withCredentials: true,
  baseURL: 'https://api.changenow.io/v1/',
});

export const exchangeAPI = {
  getCurrencies(active = true, fixedRate = true) {
    return instance
      .get(`currencies?active=${active}&fixedRate=${fixedRate}`)
      .then((response) => response.data)
  },
  getMinimalExchangeAmount(from_to: string, api_key: string = APIKey) {
    return instance
      .get(`min-amount/${from_to}?api_key=${api_key}`)
      .then((response) => response.data)
  },
  getEstimatedExchangeAmount(send_amount: number, from_to: string, api_key: string = APIKey) {
    return instance
      .get(`exchange-amount/${send_amount}/${from_to}/?api_key=${api_key}`)
      .then((response) => response.data)
  },
};
