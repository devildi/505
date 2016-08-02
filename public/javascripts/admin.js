$(function(){
	$('.change').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		//alert(target.attr("class"))
		 $.ajax({
		      type: 'GET',
		      url: '/admin/authorize/' + id
		    })
		    .done(function(results) {
		      if(results.success == 1){
		      	if (tr.length > 0) {
			          tr.remove()
			     }
			     swal({
					  title: "此用户升级为管理员权限",
					  text: "请到/高级注册列表/查看!",
					  type: "success",
					  showCancelButton: true,
					  confirmButtonColor: "#DD6B55",
					  confirmButtonText: "查看高级用户",
					  cancelButtonText: "退出",
					},
					function(isConfirm){
					  if (isConfirm) {
					    	window.location.href="/admin/user/superlist"
					  }
				})
		     }
		})
	})

	$('.fin').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		$.ajax({
			type: 'GET',
		    url: '/supplyfinish/' + id
		})
		.done(function(results){
			if(results.success === 1){
				tr.children('.status').html('已处理')
				tr.find('a').attr('class','btn btn-primary btn-xs fin').attr('disabled','disabled').html('已处理')
			}
		})
	})
})
