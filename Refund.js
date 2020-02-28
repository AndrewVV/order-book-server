class RefundTime {
	constructor(app, mongoose){ 
        this.app = app;
        this.refund = mongoose.model('refundTime')
		this.activeEndpoints()
	}

	activeEndpoints(){
		this.app.post('/add-refund', (req,res)=>{
			this.createRefundTime(req,res)
		});
		this.app.get('/refund-time/:ticker', (req, res) => {
			this.getRefundTime(req, res)
		})
		this.app.put('/refund-time/:ticker/:value', (req,res) => {
			this.changeRefundValue(req,res);
		})
		this.app.delete('/refund', (req, res) => {
            this.deleteRefundTime(req,res)
        })
	}

	async createRefundTime(req, res){
		try{
			let result = await this.saveToDB()
			let data;
			if(result){
				data = {
					status: `Refund time saved`,
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
			let refund = new this.refund();
			refund
			.save()
			.then(result =>{
				return resolve(result);
			}).
			catch(e => reject(e))
		});
	}

	getRefundTime(req, res){
		let ticker = req.params.ticker.toUpperCase()
		this.refund
		.find()
		.then(refund => {
            if(refund.length <= 0) {
                res.send("Please add refund")
			}else {
                let data = {
				ticker,
				refundTime: refund[0][ticker],
			    }
                res.send(data)
            }
		});
	}

	changeRefundValue(req,res){
		let ticker = req.params.ticker.toUpperCase();
		let newValue = req.params.value;
		this.refund
		.findOneAndUpdate({__v: 0}, {[ticker]: newValue})
		.then(order => {
			let data = {
				changedTicker: ticker,
				newValue
			}
			res.send(data)
		})
	}

	deleteRefundTime(req, res){
		this.refund
		.find()
		.remove()
		.then(refund => {
			res.send(`Removed all refund, status: ${JSON.stringify(refund)}`)
		});
	}
}

module.exports = RefundTime;