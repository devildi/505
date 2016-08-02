$(function(){
	var check
	$('.sub').click(function(){
		swal({
			  title: "备份了么?",
			  text: "若重装系统会导致C盘被清空，请备份(C盘/桌面/我的文档等)!",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  cancelButtonText: "去备份!",
			  confirmButtonText: "C盘无资料,提交!",
			},
			function(isConfirm){
			  if (isConfirm) {
			    var request = $('.text').val()
			    if(request){
		    	 $.post("/user/order",{request:request},function(data){
		    	 	if(data.success === 1){
		    	 		window.location.href="/done"
		    	 	}
		    	 })
			    } else {
			    	alert("请填写问题说明！！！")
			    }
			  } else {
				window.location.href="/logout"
			  }
		})
	})
})