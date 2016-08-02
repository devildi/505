$(document).ready(function() {

  var canvas = document.getElementById('canvas')
  var context = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  var image = new Image()
  image.src = "images/bg.jpg"

  image.onload = function(e){
    draw( image )
  }

  function draw(image){
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.drawImage( image, 0, 0,canvas.width, canvas.height)
    context.restore()
  }

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