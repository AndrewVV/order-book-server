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

class Proxy {
	constructor(){ 
		this.activeEndpoints()
	}

	activeEndpoints(){
		app.get('/test', (req, res) => {
			this.testEndpoint(req, res)
		});
		app.post('/create/order', (req,res)=>{
			this.createOrder(req,res)
		});
		app.get('/all-orders', this.getAllOrders)
		app.get('/all-orders/:buyTicker', (req,res) => {
			this.getAllOrdersByTicker(req,res)
		})
		app.delete('/delete/:id', (req,res) => {
			this.deleteById(req,res)
		})
		app.delete('/delete', this.deleteAllOrders)
	}

	testEndpoint(req, res){
		try{
			let data= {
				test: "test",
			}
			res.send(data)
		}catch(e){
			console.log(e);
		}
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

let proxy = new Proxy();