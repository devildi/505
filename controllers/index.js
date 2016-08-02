exports.index = function(req, res) {

//Index
   res.render('index', { 
   	title: 'LRTV运维系统',
   	success: req.flash('success')
   	 });
}