var Index = require('../controllers/index')
var User = require('../controllers/user')
var Order = require('../controllers/order')

module.exports = function(app) {

// pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user
    app.locals.userHeader = _user
    next()
  })

// Index
app.get('/', User.signinRequired, Index.index)

//User
app.get('/signin', User.showSignin)
app.get('/logout', User.logout)
app.get('/signup', User.showSignup)
app.post('/user/signup', User.signup)
app.post('/user/signin', User.signin)
app.get('/user/:id',User.signinRequired, User.adminRequired, User.check)
app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)
app.get('/admin/user/superlist', User.signinRequired, User.adminRequired, User.superlist)
app.get('/admin/authorize/:id', User.signinRequired, User.adminRequired, User.authorize)

//Order
app.post('/user/order', User.signinRequired, Order.postOrder)
app.get('/done', User.signinRequired, Order.done)
app.get('/orderlist',User.signinRequired, User.adminRequired, Order.orderList)
app.get('/order/:id', User.signinRequired, User.adminRequired, Order.detail)
app.get('/orderFinish/:id', User.signinRequired, User.adminRequired, Order.detailfinish)
app.post('/order/finish', User.signinRequired, User.adminRequired, Order.finish)
app.get('/finishedOrder',User.signinRequired, User.adminRequired, Order.finishedList)
app.get('/finishedOrderToday',User.signinRequired, User.adminRequired, Order.finishedListToday)
app.get('/user/orderlist/:id',User.signinRequired, User.adminRequired, Order.checklist)
app.get('/telOrder', User.signinRequired, User.adminRequired, Order.telOrderIndex)
app.post('/telorder/finish',User.signinRequired, User.adminRequired, Order.telOrderPost)
app.get('/telorderShow',User.signinRequired, User.adminRequired, Order.telorderShow)
app.post('/suppliesPost', User.signinRequired, Order.suppliesPost)
app.get('/suppliesShow',User.signinRequired, User.adminRequired, Order.suppliesShow)
app.get('/supplyfinish/:id', User.signinRequired, User.adminRequired, Order.supplyFinish)

//graph
app.get('/info', User.signinRequired, User.adminRequired, Order.info )

//search
app.get('/search', User.signinRequired, User.adminRequired, Order.search)
}