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
const Order = mongoose.model('orders')

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
		app.put('/order/:id/status/:status', (req,res) => {
			this.changeOrderStatus(req,res);
		})
		app.put('/order/:id/addressSellerToReceive/:addressSellerToReceive', (req,res) => {
			this.addAddressSellerToReceives(req,res);
		})
		app.delete('/order/:id', (req,res) => {
			this.deleteById(req,res)
		})
		app.delete('/orders', this.deleteAllOrders)
	}

	async createOrder(req, res){
		try{
			let order = req.body;
			console.log("createOrder in Proxy", order)
			let result = await this.saveToDB(order)
			let data;
			if(result){
				data = {
					result: `Order ${result._id} saved`,
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
			console.log("check status in getOrderByHashedSecret")
			res.send(orders)
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