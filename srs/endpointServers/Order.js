require('../models/order.model')

class Order {
	constructor(app, mongoose){
		this.app = app;
		this.order = mongoose.model('orders'); 
		this.activeEndpoints()
	}

	activeEndpoints(){
		this.app.post('/create/order', (req,res)=>{
			this.createOrder(req,res)
		});
		this.app.get('/all-orders', (req, res) => {
			this.getAllOrders(req, res)
		})
		this.app.get('/all-active-orders', (req, res) => {
			this.getAllActiveOrders(req, res)
		})
		this.app.get('/all-opened-orders', (req, res) => {
			this.getAllOpenedOrders(req, res)
		});
		this.app.get('/all-canceled-orders', (req, res) => {
			this.getAllCanceledOrders(req, res)
		});
		this.app.get('/all-orders/:buyTicker', (req,res) => {
			this.getAllOrdersByTicker(req,res)
		})
		this.app.get('/order/:hashedSecret', (req,res) => {
			this.getOrderByHashedSecret(req,res)
		})
		this.app.get('/order/id/:id', (req,res) => {
			this.getOrderById(req,res)
		})
		this.app.put('/order/:id/status/:status', (req,res) => {
			this.changeOrderStatus(req,res);
		})
		this.app.put('/order/:id/status-internal/:status', (req,res) => {
			this.changeOrderStatusInternal(req,res);
		})
		this.app.put('/order/:id/addressSellerToReceive/:addressSellerToReceive', (req,res) => {
			this.addAddressSellerToReceives(req,res);
		})
		this.app.put('/order/:id/sellersAddressForSending/:sellersAddressForSending', (req,res) => {
			this.addSellersAddressForSending(req,res);
		})
		this.app.put('/order/:id/txHashBtc/:txHash', (req,res) => {
			this.addTxHashBtc(req,res);
		})
		this.app.put('/order/:id/txHashEth/:txHash', (req,res) => {
			this.addTxHashEth(req,res);
		})
		this.app.put('/order/:id/hashedSecret/:hashedSecret', (req,res) => {
			this.addHashedSecret(req,res);
		})
		this.app.put('/order/:id/scriptAddress/:scriptAddress', (req,res) => {
			this.addScriptAddress(req,res);
		})
		this.app.put('/order/:id/refundTime/:refundTime', (req,res) => {
			this.addRefundTime(req,res);
		})
		this.app.put('/order/:id/publicKeyBuyer/:publicKeyBuyer', (req,res) => {
			this.addPublicKeyBuyer(req,res);
		})
		this.app.put('/order/:id/publicKeySeller/:publicKeySeller', (req,res) => {
			this.addPublicKeySeller(req,res);
		})
		this.app.put('/order/:id/secret/:secret', (req,res) => {
			this.addInternalSecret(req,res);
		})
		this.app.delete('/order/:id', (req,res) => {
			this.deleteById(req,res)
		})
		this.app.delete('/orders', (req,res) => {
			this.deleteAllOrders(req,res)
		})
	}

	async createOrder(req, res){
		try{
			let order = req.body;
			let result = await this.saveToDB(order)
			let data;
			if(result){
				data = {
					status: result.statusInternal,
					result: `Order saved`,
					_id: result._id,
				}
			}
			res.send(data)
		}catch(e){
			console.log(e);
		}
	}

	getAllOrders(req, res){
		this.order
		.find()
		.then(orders => {
			res.send(orders)
		});
	}

	getAllActiveOrders(req, res){
		this.order
		.find({statusInternal: ["OPEN", "IN_PROGRESS"] })
		.then(orders => {
			res.send(orders)
		});
	}

	getAllCanceledOrders(req, res){
		this.order
		.find({statusInternal: "CANCEL"})
		.then(orders => {
			res.send(orders)
		});
	}

	getAllOpenedOrders(req, res){
		this.order
		.find({statusInternal: "OPEN"})
		.then(orders => {
			res.send(orders)
		});
	}

	getAllOrdersByTicker(req, res){
		let ticker = req.params.buyTicker
		this.order
		.find({buyTicker: ticker})
		.then(orders => {
			res.send(orders)
		});
	}

	getOrderByHashedSecret(req, res){
		let hashedSecret = req.params.hashedSecret
		this.order
		.find({hashedSecret: hashedSecret})
		.then(orders => {
			res.send(orders)
		});
	}

	getOrderById(req, res){
		let id = req.params.id
		this.order
		.find({_id: id})
		.then(order => {
			res.send(order[0])
		});
	}

	changeOrderStatus(req,res){
		let id = req.params.id;
		let newStatus = req.params.status;
		this.order
		.findOneAndUpdate({_id: id}, {status: newStatus})
		.then(order => {
			let data = {
				changedId: order.id,
				newStatus,
			}
			res.send(data)
		})
	}

	changeOrderStatusInternal(req,res){
		let id = req.params.id;
		let newStatus = req.params.status;
		this.order
		.findOneAndUpdate({_id: id}, {statusInternal: newStatus})
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
		this.order
		.findOneAndUpdate({_id: id}, {addressSellerToReceive: addressSellerToReceive})
		.then(order => {
			let data = {
				changedId: order.id,
				addressSellerToReceive,
			}
			res.send(data)
		})
	}

	addSellersAddressForSending(req,res){
		let id = req.params.id;
		let sellersAddressForSending = req.params.sellersAddressForSending;
		this.order
		.findOneAndUpdate({_id: id}, {sellersAddressForSending: sellersAddressForSending})
		.then(order => {
			let data = {
				changedId: order.id,
				sellersAddressForSending,
			}
			res.send(data)
		})
	}

	addTxHashBtc(req,res){
		let id = req.params.id;
		let txHash = req.params.txHash;
		this.order
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
		this.order
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
		this.order
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
		this.order
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
		this.order
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
		this.order
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
		this.order
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
		this.order
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
			let order = new this.order(data);
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
		this.order
		.find({_id: id})
		.remove()
		.then(orders => {
			res.send(`Removed id ${id}, status: ${JSON.stringify(orders)}`)
		});
	}

	deleteAllOrders(req, res){
		this.order
		.find()
		.remove()
		.then(orders => {
			res.send(`Removed all order, status: ${JSON.stringify(orders)}`)
		});
	}
}

module.exports = Order;