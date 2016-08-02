$(document).ready(function() {


  $(".js-example-basic-single").select2({
  	minimumResultsForSearch: Infinity,
  	placeholder: "楼层",
  	allowClear: true,
  }).on("select2:select", function (e) {
  	    var args = JSON.stringify(e.params, function (key, value) {
						      return value.data.text;
						    })
  		$('#floor').val(args)
  })


  $(".js-example-basic-single1").select2({
  	minimumResultsForSearch: Infinity,
  	placeholder: "部门",
  	allowClear: true,
  }).on("select2:select", function (e) {
  	    var args = JSON.stringify(e.params, function (key, value) {
						      return value.data.text;
						    })
  		$('#deparment').val(args)
  })
  
}); 