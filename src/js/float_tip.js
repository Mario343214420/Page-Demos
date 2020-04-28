let app = document.getElementById('app')
let divTip = document.createElement('div');
divTip.id = "abc"
divTip.innerHTML = "123"
divTip.style = 'background: rgba(100,100,100,.2); position: fixed;transition: easy-in-out .1s; z-index: 999; height: 200px; width: 200px'
app.appendChild(divTip);
abc.addEventListener('onclick',() => {
	console.log(1);
})
let timeCount = 0
let h = window.innerHeight
let w = window.innerWidth
let flag = true
setInterval(function () {
	if ( flag ) {
		timeCount ++;
		abc.style.top = timeCount + 'px'
		abc.style.left = ((w+200)/h * timeCount) + 'px'
		if ( timeCount === h - 200){
			flag = false
		}
	} else {
		timeCount --
		abc.style.top = timeCount + 'px'
		abc.style.left = (w+200)/h * timeCount + 'px'
		if ( timeCount === 0 ){
			flag = true
		}
	}
},16)
