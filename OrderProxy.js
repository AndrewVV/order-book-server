const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
let app = express();
app.use(bodyParser());
app.use(cors())
const port = 8600
app.listen(port, () => console.log("Server is up on port " + port))

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/order-book')
	.then(()=> console.log("Connected successfully to MongoDB"))
	.catch(e => console.log(e))

require('./order.model')
require('./confirm.model')
require('./refund.model')
const Order = mongoose.model('orders');
const Confirm = mongoose.model('confirmations');
const RefundTime = require('./Refund')
let refundTime = new RefundTime(app, mongoose)

class OrderProxy {
	constructor(){ 
		this.activeEndpoints()
	}

	activeEndpoints(){
		app.post('/create/order', (req,res)=>{
			this.createOrder(req,res)
		});
		app.get('/all-orders', this.getAllOrders)
		app.get('/all-orders/:buyTicker', (req,res) => {
			this.getAllOrdersByTicker(req,res)
		})
		app.get('/order/:hashedSecret', (req,res) => {
			this.getOrderByHashedSecret(req,res)
		})
		app.get('/order/id/:id', (req,res) => {
			this.getOrderById(req,res)
		})
		app.put('/order/:id/status/:status', (req,res) => {
			this.changeOrderStatus(req,res);
		})
		app.put('/order/:id/addressSellerToReceive/:addressSellerToReceive', (req,res) => {
			this.addAddressSellerToReceives(req,res);
		})
		app.put('/order/:id/txHashBtc/:txHash', (req,res) => {
			this.addTxHashBtc(req,res);
		})
		app.put('/order/:id/txHashEth/:txHash', (req,res) => {
			this.addTxHashEth(req,res);
		})
		app.put('/order/:id/hashedSecret/:hashedSecret', (req,res) => {
			this.addHashedSecret(req,res);
		})
		app.put('/order/:id/scriptAddress/:scriptAddress', (req,res) => {
			this.addScriptAddress(req,res);
		})
		app.put('/order/:id/refundTime/:refundTime', (req,res) => {
			this.addRefundTime(req,res);
		})
		app.put('/order/:id/publicKeyBuyer/:publicKeyBuyer', (req,res) => {
			this.addPublicKeyBuyer(req,res);
		})
		app.put('/order/:id/publicKeySeller/:publicKeySeller', (req,res) => {
			this.addPublicKeySeller(req,res);
		})
		app.put('/order/:id/secret/:secret', (req,res) => {
			this.addInternalSecret(req,res);
		})
		app.delete('/order/:id', (req,res) => {
			this.deleteById(req,res)
		})
		app.delete('/orders', this.deleteAllOrders)
	}

	async createOrder(req, res){
		try{
			let order = req.body;
			let result = await this.saveToDB(order)
			let data;
			if(result){
				data = {
					result: `Order saved`,
					id: result._id,
				}
			}
			res.send(data)
		}catch(e){
			console.log(e);
		}
	}

	getAllOrders(req, res){
		Order
		.find()
		.then(orders => {
			res.send(orders)
		});
	}

	getAllOrdersByTicker(req, res){
		let ticker = req.params.buyTicker
		Order
		.find({buyTicker: ticker})
		.then(orders => {
			res.send(orders)
		});
	}

	getOrderByHashedSecret(req, res){
		let hashedSecret = req.params.hashedSecret
		Order
		.find({hashedSecret: hashedSecret})
		.then(orders => {
			res.send(orders)
		});
	}

	getOrderById(req, res){
		let id = req.params.id
		Order
		.find({_id: id})
		.then(order => {
			res.send(order[0])
		});
	}

	changeOrderStatus(req,res){
		let id = req.params.id;
		let newStatus = req.params.status;
		Order
		.findOneAndUpdate({_id: id}, {status: newStatus})
		.then(order => {
			let data = {
				changedId: order.id,
				newStatus,
			}
			res.send(data)
		})
	}

	addAddressSellerToReceives(req,res){
		let id = req.params.id;
		let addressSellerToReceive = req.params.addressSellerToReceive;
		Order
		.findOneAndUpdate({_id: id}, {addressSellerToReceive: addressSellerToReceive})
		.then(order => {
			let data = {
				changedId: order.id,
				addressSellerToReceive,
			}
			res.send(data)
		})
	}

	addTxHashBtc(req,res){
		let id = req.params.id;
		let txHash = req.params.txHash;
		Order
		.findOneAndUpdate({_id: id}, {txHashBtc: txHash})
		.then(order => {
			let data = {
				changedId: order.id,
				txHashBtc: txHash,
			}
			res.send(data)
		})
	}

	addTxHashEth(req,res){
		let id = req.params.id;
		let txHash = req.params.txHash;
		Order
		.findOneAndUpdate({_id: id}, {txHashEth: txHash})
		.then(order => {
			let data = {
				changedId: order.id,
				txHashEth: txHash,
			}
			res.send(data)
		})
	}
	
	addHashedSecret(req,res){
		let id = req.params.id;
		let hashedSecret = req.params.hashedSecret;
		Order
		.findOneAndUpdate({_id: id}, {hashedSecret})
		.then(order => {
			let data = {
				changedId: order.id,
				hashedSecret: hashedSecret,
			}
			res.send(data)
		})
	}

	addScriptAddress(req,res){
		let id = req.params.id;
		let scriptAddress = req.params.scriptAddress;
		Order
		.findOneAndUpdate({_id: id}, {scriptAddress})
		.then(order => {
			let data = {
				changedId: order.id,
				scriptAddress: scriptAddress,
			}
			res.send(data)
		})
	}

	addRefundTime(req,res){
		let id = req.params.id;
		let refundTime = req.params.refundTime;
		Order
		.findOneAndUpdate({_id: id}, {refundTime})
		.then(order => {
			let data = {
				changedId: order.id,
				refundTime,
			}
			res.send(data)
		})
	}
	addPublicKeyBuyer(req,res){
		let id = req.params.id;
		let publicKeyBuyer = req.params.publicKeyBuyer;
		Order
		.findOneAndUpdate({_id: id}, {publicKeyBuyer})
		.then(order => {
			let data = {
				changedId: order.id,
				publicKeyBuyer,
			}
			res.send(data)
		})
	}

	addPublicKeySeller(req,res){
		let id = req.params.id;
		let publicKeySeller = req.params.publicKeySeller;
		Order
		.findOneAndUpdate({_id: id}, {publicKeySeller})
		.then(order => {
			let data = {
				changedId: order.id,
				publicKeySeller,
			}
			res.send(data)
		})
	}

	addInternalSecret(req,res){
		let id = req.params.id;
		let internalSecret = req.params.secret;
		Order
		.findOneAndUpdate({_id: id}, {internalSecret})
		.then(order => {
			let data = {
				changedId: order.id,
				internalSecret,
			}
			res.send(data)
		})
	}

	saveToDB(data){
		return new Promise(async(resolve, reject)=>{
			let order = new Order(data);
			order
			.save()
			.then(result =>{
				return resolve(result);
			}).
			catch(e => reject(e))
		});
	}

	deleteById(req, res){
		let id = req.params.id
		Order
		.find({_id: id})
		.remove()
		.then(orders => {
			res.send(`Removed id ${id}, status: ${JSON.stringify(orders)}`)
		});
	}

	deleteAllOrders(req, res){
		Order
		.find()
		.remove()
		.then(orders => {
			res.send(`Removed all order, status: ${JSON.stringify(orders)}`)
		});
	}
	
}

let orderProxy = new OrderProxy();

class Confirmations {
	constructor(){ 
		this.activeEndpoints()
	}

	activeEndpoints(){
		app.post('/add-confirmations', (req,res)=>{
			this.createConfirm(req,res)
		});
		app.get('/all-confirmations', this.getConfirmations)
		app.put('/confirm/:ticker/:value', (req,res) => {
			this.changeConfirmValue(req,res);
		})
		app.delete('/confirmations', this.deleteConfirmations)
	}

	async createConfirm(req, res){
		try{
			let result = await this.saveToDB()
			let data;
			if(result){
				data = {
					status: `Confirmations saved`,
					result
				}
			}
			res.send(data)
		}catch(e){
			console.log(e);
		}
	}

	saveToDB(){
		return new Promise(async(resolve, reject)=>{
			let confirm = new Confirm();
			confirm
			.save()
			.then(result =>{
				return resolve(result);
			}).
			catch(e => reject(e))
		});
	}

	getConfirmations(req, res){
		Confirm
		.find()
		.then(confirmations => {
			let data = {
				"BTC": confirmations[0].BTC,
				"ETH": confirmations[0].ETH
			}
			res.send(data)
		});
	}

	changeConfirmValue(req,res){
		let ticker = req.params.ticker.toUpperCase();
		let newValue = req.params.value;
		Confirm
		.findOneAndUpdate({__v: 0}, {[ticker]: newValue})
		.then(order => {
			let data = {
				changedTicker: ticker,
				newValue
			}
			res.send(data)
		})
	}

	deleteConfirmations(req, res){
		Confirm
		.find()
		.remove()
		.then(confirmations => {
			res.send(`Removed all confirmations, status: ${JSON.stringify(confirmations)}`)
		});
	}
	

}

let confirmations = new Confirmations()