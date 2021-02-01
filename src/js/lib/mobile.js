//移动端终极适配
(function () {
  // 移动端a标签的跳转方案 （另一种方案为使用touchend进行跳转，添加flag判定点下后手指滑动。）
	!(function () {
		var aNodes = document.querySelectorAll('a')
		for (var i = 0; i < aNodes.length; i++) {
			aNodes[i].addEventListener('touchstart', function () {
				window.location = this.href
			})
		}
	})()
  // 根据页面宽度设置根文字大小
	!(function () {
		var width = document.documentElement.clientWidth
		var styleNode = document.createElement('style')
    // 根据页面宽度16分布局，页面内尺寸多采用rem进行适配，以实现全设备，全分辨率适配。
		styleNode.innerHTML = 'html{font-size: ' + width / 16 + 'px !important;}'
		document.head.appendChild(styleNode)
	})()
  // 引用fastclick处理移动端300ms延迟
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function () {
			var script = document.createElement('script')
			script.src = 'https://cdn.bootcdn.net/ajax/libs/fastclick/1.0.6/fastclick.min.js'
			script.onload = function () {
				console.log('fastclick加载完成')
			};
			document.head.appendChild(script)
			if(!FastClick){
				// document.writeln('<script src=""></script>')
				FastClick.attach(document.body)
			}
		}, false)
	}
	if (!window.Promise) {
		document.writeln('<script src="https://cdn.bootcdn.net/ajax/libs/es6-promise/4.2.8/es6-promise.min.js"></script>')
	}
})()
