require('../models/confirm.model')

class Confirmations {
	constructor(app, mongoose){
        this.app = app;
        this.confirm = mongoose.model('confirmations');
		this.activeEndpoints()
	}

	activeEndpoints(){
		this.app.post('/add-confirmations', (req,res)=>{
			this.createConfirm(req,res)
		});
		this.app.get('/all-confirmations', this.getConfirmations)
		this.app.put('/confirm/:ticker/:value', (req,res) => {
			this.changeConfirmValue(req,res);
		})
		this.app.delete('/confirmations', this.deleteConfirmations)
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
			let confirm = new this.confirm();
			confirm
			.save()
			.then(result =>{
				return resolve(result);
			}).
			catch(e => reject(e))
		});
	}

	getConfirmations(req, res){
		this.confirm
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
		this.confirm
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
		this.confirm
		.find()
		.remove()
		.then(confirmations => {
			res.send(`Removed all confirmations, status: ${JSON.stringify(confirmations)}`)
		});
	}
}

module.exports = Confirmations;