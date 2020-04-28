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
