function autoScroll (id) {
	var mScrollBox = document.getElementById(id);
	var flag = true;
	mScrollBox.addEventListener('mouseenter',function () {
		flag = false
	});
	mScrollBox.addEventListener('mouseleave',function () {
		flag = true
	});
	var time = 0;
	if(mScrollBox){
		function scroll(dom) {
			dom.innerHTML += dom.innerHTML;
			var childNode = dom.children[0];
			// 配置滚动极限高度
			var limitH = childNode.style.height.split('px')[0];
			mScrollBox.parentNode.style.height = childNode.style.height;
			// 添加隐藏遮罩
			mScrollBox.parentNode.style.overflow = 'hidden';
			function mScroll(dom) {
				var timeTip = flag?parseInt(time++/2):parseInt(time/2);
				if( timeTip <= limitH && flag){
					dom.style.transform = 'translateY(-' + timeTip + 'px)'
				} else if(flag) {
					time = 0
				}
			}
			function animloop() {
				mScroll(dom);
				window.requestAnimationFrame(animloop);
			}
			animloop()
		}
		scroll(mScrollBox);
	}
}
