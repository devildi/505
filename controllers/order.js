var Order = require('../models/order')
var Telorder = require('../models/telorder')
var User = require('../models/user')
var Department = require('../models/department')
var Supplies = require('../models/supplies')
var moment = require('moment')

exports.postOrder = function(req, res){
	User.findOne({employeeID:req.session.user.employeeID},function(err, user){
		if (err) {
	      console.log(err)
	    }
		_order = new Order({
			user:user,
			request: req.body.request,
			serviceguy: '',
			response: ''
		})
		_order.meta.createAt = Date.now()
		_order.save(function(err, order){
			if (err) {
		      console.log(err)
		    }
		    Department.findOne({name: user.deparment}, function(err, department){
		    		department.order.push([order._id])
		    		department.save(function(err){
		    			res.json({success: 1})
		    		})
		    })  
		})
	})
}

exports.suppliesPost = function(req, res){
	var request = req.body.request
	User.findOne({employeeID:req.session.user.employeeID}, function(err, user){
		if (err) {
	      console.log(err)
	    }
	    _supplies = new Supplies({
	    	user: user,
	    	request: request,
	    })
	    _supplies.meta.createAt = Date.now()

	    _supplies.save(function(err, supplies){
	    	if (err) {
		      console.log(err)
		    }
		    res.redirect('/done')
	    })
	})
}

exports.suppliesShow = function(req, res){
	var page = parseInt(req.query.p || 0, 10)
	var count = 16
	var index = page * count
	Supplies.fetch('user',function(err, supplies) {
	    if (err) {
	      console.log(err)
	    }
	    var results = supplies.slice(index, index + count)
	    res.render('supplylist', {
	      title: '电脑耗材领取记录',
	      currentPage: (page + 1),
	      totalPage: Math.ceil(supplies.length / count),
	      orders: results
	    })
	})
}

exports.supplyFinish = function(req, res){
	var id = req.params.id
	Supplies.findOne({_id: id}, function(err, supply){
        if(err){
          console.log(err)
        }
        supply.status = '已处理'
        supply.save(function(err){
          res.json({success: 1})
        })
    })
}

exports.done = function(req, res){
	res.render('done',{
		title:'提交成功'
	})
}

exports.orderList = function(req, res){
	Order.find({completedorNot: 0}).populate('user')
		.exec(function(err, orders) {
	    if (err) {
	      console.log(err)
	    }
	    res.render('orderlist', {
	      title: '正在进行的维修单',
	      orders: orders
	    })
	})
}

exports.detail = function(req, res){
	var id = req.params.id
	var serviceguy = req.session.user
//console.log(req.session.user)
	Order.findOne({_id: id},function(err, order){
	 	User.findOne({_id: order.user}, function(err, user){
	 		res.render('detail', {
	          title: '详情页',
	          order: order,
	          user: user
	        })	
	 	})
	}) 
}

exports.finish = function(req, res){
	var ip = req.body.ip
	var mac = req.body.mac
	var response = req.body.response
	var serviceguy = req.session.user.name
	var orderId = req.body.orderId
	var userId = req.body.userId
	Order.findOne({_id: orderId}, function(err, order){
		order.response = response
		order.serviceguy = serviceguy
		order.completedorNot = 1
		order.meta.updateAt = Date.now()
		order.save(function(err){
			User.findOne({_id: userId}, function(err, user1){
				user1.ip = ip
				user1.mac = mac
				user1.BeFixed.push(orderId)
				user1.save(function(err){
					User.findOne({_id: req.session.user._id}, function(err, user2){
						user2.HasFixed.push(orderId)
						user2.save(function(err){
							res.redirect('/finishedOrderToday')
						})
					})
				})
			})
		})
	})
}

exports.finishedListToday = function(req, res){
	var page = parseInt(req.query.p || 0, 10)
	var count = 20
	var index = page * count
	var today = moment().format('L')
	var tomorrow = moment().add(1,'day').format('L')
	//console.log(moment().format('d'))
	Order.find({completedorNot: 1,'meta.updateAt':{"$gte": today, $lt: tomorrow}}).populate('user')
		.exec(function(err, orders) {
	    if (err) {
	      console.log(err)
	    }
	    var results = orders.slice(index, index + count)
	    res.render('orderlistfinish', {
	      title: '完成的维修单',
	      currentPage: (page + 1),
	      totalPage: Math.ceil(orders.length / count),
	      orders: results
	    })
	})
}

exports.finishedList = function(req, res){
	var page = parseInt(req.query.p || 0, 10)
	var count = 20
	var index = page * count
	Order.fetch(function(err, orders) {
	    if (err) {
	      console.log(err)
	    }
	    var results = orders.slice(index, index + count)
	    res.render('orderlistfinish', {
	      title: '完成的维修单',
	      currentPage: (page + 1),
	      totalPage: Math.ceil(orders.length / count),
	      orders: results
	    })
	})
}

exports.detailfinish = function(req, res){
	var id = req.params.id

	Order.findOne({_id: id},function(err, order){
	 	User.findOne({_id: order.user}, function(err, user){
	 		res.render('detailfinish', {
	          title: '详情页',
	          order: order,
	          user: user
	        })	
	 	})
	}) 
}

//有待更新
exports.checklist = function(req, res){
    var id = req.params.id
    User.findOne({_id:id}, function(err, user){
    		if(err){
    			console.log(err)
    		}

    		Order.find({user:user._id}, function(err, orders){
    			
    			res.render('singleUserOrderlist',{
    				title:'维修记录',
    				orders: orders
    			})
    		})
    })
}

exports.info = function(req, res){
	var today = moment().format('L')
	var tomorrow = moment().add(1,'day').format('L')
	var LD = moment().subtract(1,'day').format('L')
	var LLD = moment().subtract(2,'day').format('L')
	var LLLD = moment().subtract(3,'day').format('L')
	var LLLLD = moment().subtract(4,'day').format('L')
	var Dd = moment().format('d')//当个周第几天
	var firstOfMonth = moment().startOf('month').format("L")
	var lastOfMonth = moment().endOf('month').format("L")
	var firstOfWeek = moment().startOf('week').format("L")
	var lastOfWeek = moment().endOf('week').format("L")
//callback hell
	Order.find({'meta.updateAt':{"$gte": today, $lt: tomorrow}}, function(err, orders1){
		var totalD = orders1.length//-----------------------------
		Order.find({'meta.updateAt':{"$gte": firstOfWeek, $lt: lastOfWeek}},function(err, orders2){
			var totalW = orders2.length//-----------------------------
			Order.find({'meta.updateAt':{"$gte": firstOfMonth, $lt: lastOfMonth}},function(err, orders3){
				var totalM = orders3.length
				Order.find({'meta.updateAt':{"$gte": LD, $lt: today}},function(err,orders4){
					var totalLD = orders4.length
					Order.find({'meta.updateAt':{"$gte": LLD, $lt: LD}},function(err, orders5){
						var totalLLD = orders5.length
						Order.find({'meta.updateAt':{"$gte": LLLD, $lt: LLD}},function(err, orders6){
							var totalLLLD = orders6.length
							Order.find({'meta.updateAt':{"$gte": LLLLD, $lt: LLLD}},function(err, orders7){
								var totalLLLLD = orders7.length
								res.render('info',{
									title:'统计数据',
									totalD:totalD,
									totalLD:totalLD,
									totalLLD:totalLLD,
									totalLLLD:totalLLLD,
									totalLLLLD:totalLLLLD,
									totalW:totalW,
									totalM:totalM
								})
							})
						})
					})
				})
			})
		})
	})
}

exports.telOrderIndex = function(req, res) {
   res.render('telorder', { 
   	title: '电话处理故障录入'
   	 })
}

exports.telOrderPost = function(req, res) {
   _telorder = new Telorder({
   	telnumber: req.body.telnumber,
	request: req.body.request,
	response: req.body.response,
	serviceguy: req.session.user.name
   })
   _telorder.meta.createAt = Date.now()
   _telorder.save(function(err, order){
   		if (err) {
		      console.log(err)
		    }
		res.redirect('/telorderShow')
   })
}

exports.telorderShow = function(req, res){
	var page = parseInt(req.query.p || 0, 10)
	var count = 20
	var index = page * count
	Telorder.fetch(function(err, telorders) {
	    if (err) {
	      console.log(err)
	    }
	    var results = telorders.slice(index, index + count)
	    res.render('telorderlist', {
	      title: '电话处理故障记录',
	      currentPage: (page + 1),
	      totalPage: Math.ceil(telorders.length / count),
	      telorders: results
	    })
	})
}

exports.search = function(req, res){
	var query = req.query.search
	var results
	var user
	if( query.indexOf("/") > 0){
		
		var page = parseInt(req.query.p || 0, 10)
		var count = 20
		var index = page * count

		if( query.indexOf("-") > 0 ){
			var data2 = query.split("-")
			var from = moment(data2[0]).format('L')
			var to = moment(data2[1]).add(1,'day').format('L')
		} else{
			var from = moment(query).format('L')
			var to = moment(query).add(1,'day').format('L')
		}

		Order.find({'meta.updateAt':{"$gte": from, $lt: to}}).populate('user')
			.exec(function(err, orders) {
		    if (err) {
		      console.log(err)
		    }
		    var results = orders.slice(index, index + count)
		    res.render('orderlistfinish', {
		      title: '搜索结果',
		      currentPage: (page + 1),
		      totalPage: Math.ceil(orders.length / count),
		      orders: results,
		      user:user
		    })
		})
	} else {
		User.findOne({employeeID:query}, function(err, user){
			res.render('search', {
			title: '搜索结果',
			orders: results,
		    user:user
		})
	})
  }
}
