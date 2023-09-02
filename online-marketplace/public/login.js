import { loadNavItems } from './navbar.js'
loadNavItems

window.addEventListener('load', async () => {
	const res = await fetch('/checkLogin')
	// console.log('get:',res.status)
	if (res.status === 200) {
		isLoggedInUserMsg()
	} else {
		document.querySelector('#login-form-area').innerHTML = `
			<div class="fs-4">登入帳號</div>
			<div>
			  <form id="login-form" action="/login" method="POST" enctype="multipart/form-data" class="loginArea">
				<div class="mb-3">
				  <label for="exampleInputPassword1" class="form-label">Username</label>
				  <input type="text" name="username" class="form-control" id="exampleInputPassword1">
				</div>
				<div class="mb-3">
				  <label for="exampleInputPassword1" class="form-label">Password</label>
				  <input name="password" type="password" class="form-control" id="exampleInputPassword1">
				</div>
				<button class="btn btn-primary">登入</button>
			  </form>
			  <div class="fs-6"><a href="./registration.html">登記用戶</a></div>
			</div> `
		loginFormListener
	}
})

const loginFormListener = document
	.querySelector('#login-form-area')
	.addEventListener('submit', async (event) => {
		event.preventDefault()
		let formObject = {
			username: event.target.username.value,
			password: event.target.password.value
		}
		const res = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formObject)
		})
		if (res.status === 200) {
			isLoggedInUserMsg()
		} else {
			event.target.reset()
			//need notification of login failure
		}
	})
// 'select users.id, users.username, users.password, users.admin_auth, users.email, users.telephone, users.address from users where users.username = $1',
async function isLoggedInUserMsg() {
	loadNavItems()
	const res = await fetch('/checkLogin')
	const resJson = await res.json()
	let userClass = ''
	if (resJson.admin_auth) {
		userClass = 'ADMIN'
	} else {
		userClass = 'VIP Customer'
	}
	document.querySelector(
		'#login-form-area'
	).innerHTML = `<div class="welcomeMsg"><p>Welcome back, ${resJson.username}</p></div>
	<div class="TableMsg"><table class='userInfoTable'>
	<thead class="userInfoTableHead">
	<tr><th colspan="2">User Information</th></tr>
	</thead>
	<tbody class="userInfoTableDetails">
	<tr><td>Username</td><td>${resJson.username}</td></tr>
	<tr><td>Email</td><td>${resJson.email}</td></tr>
	<tr><td>Telephone</td><td>${resJson.telephone}</td></tr>
	<tr><td>Address</td><td>${resJson.address}</td></tr>
	<tr><td>User Class</td><td>${userClass}</td></tr>
	</tbody>
	</table><br>
	<div class="loginedButtons" id="loginedButtons"></div>
	</div>
	`
	isLoggedButtons(userClass, resJson.id)
}
async function isLoggedButtons(userClass, userID) {
	if (userClass == 'ADMIN') {
		document.querySelector('#loginedButtons').innerHTML = `
	<span class="viewCart"><a href="/cart.html?user_id=${userID}" class="btn btn-secondary">View Cart</a></span>
	<span class="viewOrders"><a href="/order.html" class="btn btn-secondary">View Order</a></span>
	<span class="adminPage"><a href="/admin.html" class="btn btn-secondary">Enter Admin Page</a></span>
	<span class="logout"><a href="/logout" class="btn btn-secondary">Logout</a></span>
	`
	} else {
		document.querySelector('#loginedButtons').innerHTML = `
	<span class="viewCart"><a href="/cart.html?user_id=${userID}" class="btn btn-info">View Cart</a></span>
	<span class="viewOrders"><a href="/order.html" class="btn btn-info">View Order</a></span>
	<span class="logout"><a href="/logout" class="btn btn-danger">Logout</a></span>
	`
	}
}
