var User = require('../models/user')
var Department = require('../models/department')
// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/')
  }

  next()
}

//signin
exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
}
exports.signin = function(req, res) {
  var employeeID = req.body.employeeID
  var password = req.body.password

  User.findOne({employeeID: employeeID}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      req.flash('error', '用户不存在'); 
      return res.redirect('/signup')
    }
    if(password != user.password){
      req.flash('error', '用户密码错误'); 
      return res.redirect('/signin')
    }
    req.flash('success', '注册成功!');
    req.session.user = user
    res.redirect('/')
    
  })
}

//logout
exports.logout =  function(req, res) {

  delete req.session.user
  res.redirect('/signin')
}

//signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
}
exports.signup = function(req, res) {
  var _user = req.body
  
  if(!_user.name || !_user.password || !_user.employeeID || !_user.floor || !_user.housenumber || !_user.deparment || !_user.phonenumber){
    return res.redirect('/signup')
  }

  Department.findOne({name: _user.deparment}, function(err, department){
    if(department){
        User.findOne({employeeID: _user.employeeID},  function(err, user) {
            if (err) {
              console.log(err)
            }
            if (user) {
              return res.redirect('/signin')
            }
            else {
              user = new User({
                name: _user.name ,
                password: _user.password,
                employeeID: _user.employeeID,
                floor: _user.floor,
                housenumber: _user.housenumber,
                deparment: _user.deparment,
                ip: '',
                mac: '',
                phonenumber: _user.phonenumber
              })

              user.save(function(err, user) {
                if (err) {
                  console.log(err)
                }
                req.session.user = user   
                department.men.push([user._id])
                department.save(function(err){
                  res.redirect('/')
                })
              })
            }
          })
    }else{
      user = new User({
        name: _user.name ,
        password: _user.password,
        employeeID: _user.employeeID,
        floor: _user.floor,
        housenumber: _user.housenumber,
        deparment: _user.deparment,
        ip: '',
        mac: '',
        phonenumber: _user.phonenumber
      })
      user.save(function(err, user){
        if(err){
          console.log(err)
        }
        req.session.user = user

        deparment = new Department({
          men:[user._id],
          name:user.deparment,
          order:[]
        })

        deparment.save(function(err){
          res.redirect('/')
        })
      })

    }
  })
}

// userlist page
exports.list = function(req, res) {
  User.find({role:0},function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: '辽台运维系统普通注册用户',
      users: users
    })
  })
}

exports.superlist = function(req, res) {
  User.find({role:50},function(err, users) {
    if (err) {
      console.log(err)
    }

    res.render('superuserlist', {
      title: '辽台运维系统高级注册用户',
      users: users
    })
  })
}

exports.authorize = function(req, res){
    var id = req.params.id
    User.findOne({_id: id}, function(err, user){
        if(err){
          console.log(err)
        }
        user.role = 50
        user.save(function(err, user){
          res.json({success: 1})
        })
    })
}

exports.check = function(req, res){
    var id = req.params.id
    User.findOne({_id:id}, function(err, user){
       if(err){
          console.log(err)
        }

        res.render('userdetail',{
          title:'该用户详细资料',
          user:user
        })
    })
}
