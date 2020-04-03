const HttpService = require('../../core/services/HttpService.js');
const WeiConverter = require('../../core/helpers/WeiConverter');
require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
let app = express();
app.listen(process.env.BALANCE_MONITOR_PORT, () => console.log("Server is up on port " + process.env.BALANCE_MONITOR_PORT))

class BalanceOrderMonitor {
    constructor(){
        this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_INFURA_DEV_NODE));
        this.httpService = new HttpService()
        this.balanceOpenOrderMonitor()
    }

    async balanceOpenOrderMonitor(){
        try {
            const monitoring = setInterval(async () => {
                const url = `${process.env.API_ORDER_SERVER}all-opened-orders`;
                const allOrders = await this.httpService.getRequest(url).then(response=>response.json());
                for (const key in allOrders) {
                    const order = allOrders[key];
                    const amount = order.sellAmount;
                    const address = order.buyersAddressForSending;
                    console.log("Address: ", address, "Amount: ", amount);
                    if(address === undefined) continue;
                    if (order.sellTicker === "BTCTEST"){
                        const url = `${process.env.BTC_API_PROVIDER_DEV}addrs/${address}/balance?token=${process.env.API_TOKEN_DEV}`;
                        const result = await this.httpService.getRequest(url).then(response=>response.json());
                        let balance = result.balance;
                        balance = WeiConverter.formatToDecimals(balance, 8);
                        console.log('BTC. amount >= balance: ', amount >= balance, amount, balance)
                        if(amount >= balance){
                            const url = `${process.env.API_ORDER_SERVER}order/${order._id}/status-internal/CANCEL`;
                            await this.httpService.putRequest(url).then(response=>response.json());
                        } else continue;
                    } else if (order.sellTicker === "ETHTEST"){
                        let balance = await this.web3.eth.getBalance(address);
                        balance = this.web3.utils.fromWei(balance, 'ether')
                        console.log('ETH. amount >= balance: ', amount >= balance, amount, balance)
                        if(amount >= balance){
                            const url = `${process.env.API_ORDER_SERVER}order/${order._id}/status-internal/CANCEL`;
                            await this.httpService.putRequest(url).then(response=>response.json());
                        } else continue;
                    }
                }


            }, 60000);
        } catch (error) {
            console.log(error);
        }
    }

}

let balanceOrderMonitor = new BalanceOrderMonitor();