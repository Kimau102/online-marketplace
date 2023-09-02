console.log('welcome to cart page')
import { loadNavItems } from './navbar.js'
import { createOrderFormArea, listenOrderFormArea } from './checkout.js'
import { loadOrderItems } from './order.js'
// import './checkout.js';
loadNavItems

// 因將來 UI 可能改動, 所以將 UI 寫出來
// 為免 form submit 混亂, 登入帳號改為限定前往 login page
let loginMsg = `<div>未登入帳號, 請先<a href="\login.html">登入帳號</a>或按此<a href="./registration.html">登記新用戶</a>, 謝謝.</div>`

// load cart function
function loadCart(cart) {
	const cartContainer = document.querySelector('#cart')
	cartContainer.innerHTML = `<table class="table table-hover">
				<thead>
				<tr>
					<th>項目</th>
					<th>圖片</th>
					<th>產品名稱</th>
					<th>單價</th>
					<th>數量</th>
					<th>小計</th>
					<th></th>
				</tr>
				</thead>
				<tbody id='productTable'>
				</tbody>
				</table>`
	const productContainer = document.querySelector('#productTable')
	for (let product of cart) {
		let cartMsg = `<tr> 
					   <td>${cart.indexOf(product) + 1}</td>
					   <td><image src="./photo/${product.image}" width="50px"; height="50px";></td>
					   <td>${product.name}</td>
					   <td>${Number(product.price).toLocaleString('zh-hk', {
							style: 'currency',
							currency: 'HKD'
						})}</td>
					   <td>
					   <!--<form id="cart-form" action="/cart" method="PUT" enctype="multipart/form-data">-->
					   <span>
                	   <button class="btn btn-outline-secondary product_minus" type="button" id="product_${product.id}_minus">-</button>
					   <input type="number" style="width:50px" value="${product.quantities}" class="product_qty" name="product_qty" id="product_${product.id}_qty" />
					   <button class="btn btn-outline-secondary product_plus" type="button" id="product_${product.id}_plus">+</button>
                	   </span>
					   <button class="edit_product_qty btn btn-warning" name="edit_product_qty" id="edit_product_${
							product.id
						}_qty">修改數量</button></td>
					   <!--</form>-->
					   <td class="subtotal" name="subtotal" id="product_${product.id}_subtotal">${(
							product.price * product.quantities
						).toLocaleString('zh-hk', {
							style: 'currency',
							currency: 'HKD'
						})}</td>
					   <td><button class="del_product btn btn-danger" name="del_product" id="del_product_${
							product.id
						}">刪除產品</button></td>
					   </tr>`
		productContainer.innerHTML += cartMsg
	}
	cartMinusPlusListener(cart)
	editCart(cart)
	delCart(cart)
}

// +- cartMinusPlusListener
function cartMinusPlusListener(cart) {
	const minusButtons = document.querySelectorAll('.product_minus')
	const plusButtons = document.querySelectorAll('.product_plus')

	minusButtons.forEach((minusButton, index) => {
		minusButton.addEventListener('click', function(){
			const product = cart[index]
			const qty = Number(document.querySelector(`#product_${product.id}_qty`).value)
			if (qty > 0 && qty % 1 == 0) {
				document.querySelector(`#product_${product.id}_qty`).value = qty - 1
			} else {
				console.log('Quantity cannot be with decimal & smaller/equal to 0.')
			}
		})
	})

	plusButtons.forEach((plusButton, index) => {
		plusButton.addEventListener('click', function(){
			const product = cart[index]
			const qty = Number(document.querySelector(`#product_${product.id}_qty`).value)
			if (qty >= 0 && qty % 1 == 0) {
				document.querySelector(`#product_${product.id}_qty`).value = qty + 1
			} else {
				console.log('Quantity cannot be with decimal & smaller/equal to 0.')
			}
		})
	})
}

// 修改數量 cart function
function editCart(cart) {
	const editButtons = document.querySelectorAll('.edit_product_qty')
	editButtons.forEach((editButton, index) => {
		editButton.addEventListener('click', async function () {
			const product = cart[index]
			const updatedQty = Number(
				document.querySelector(`#product_${product.id}_qty`).value
			)
			const buttonText = document.querySelector(
				`#edit_product_${product.id}_qty`
			).innerText
			if (buttonText == '重新加入') {
				console.log('Clicked:', buttonText)
				await addCart(product.user_id, product.id, updatedQty)
				document.querySelector(
					`#edit_product_${product.id}_qty`
				).innerHTML = '成功加入!'
				document.querySelector(
					`#product_${product.id}_subtotal`
				).innerHTML = (product.price * updatedQty).toLocaleString(
					'zh-hk',
					{ style: 'currency', currency: 'HKD' }
				)
				const grandTotal = await calCartAgain()
				document.querySelector(`#grandTotal`).innerHTML =
					grandTotal.toLocaleString('zh-hk', {
						style: 'currency',
						currency: 'HKD'
					})
			} else {
				if (updatedQty > 0 && updatedQty % 1 == 0) {
					console.log(
						`updating for cart quantity of product id ${product.id} for user with id ${product.user_id} as: ${updatedQty}`
					)
					const res = await fetch(`/cart`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							product_id: product.id,
							product_quantities: updatedQty
						})
					})
					if (res.status === 200) {
						editButton.innerHTML = '成功修改!'
						document.querySelector(
							`#product_${product.id}_subtotal`
						).innerHTML = (
							product.price * updatedQty
						).toLocaleString('zh-hk', {
							style: 'currency',
							currency: 'HKD'
						})
						const grandTotal = await calCartAgain()
						document.querySelector(`#grandTotal`).innerHTML =
							grandTotal.toLocaleString('zh-hk', {
								style: 'currency',
								currency: 'HKD'
							})
						console.log('Successful updated!')
					} else {
						editButton.innerHTML = '未能修改@'
						console.log('Something error when fetch put')
					}
				} else {
					console.log(
						'Quantity cannot be with decimal & smaller/equal to 0.'
					)
					editButton.innerHTML = '數量有問題'
				}
			}
		})
	})
}

// 刪除 cart function
function delCart(cart) {
	const delButtons = document.querySelectorAll('.del_product')
	delButtons.forEach((delButton, index) => {
		delButton.addEventListener('click', async function () {
			const product = cart[index]
			console.log(
				`deleting for cart product id ${product.id} for user with id ${product.user_id}`
			)
			const res = await fetch(`/cart/${product.id}`, {
				method: 'DELETE'
			})
			if (res.status === 200) {
				delButton.innerHTML = '成功刪除!'
				document.querySelector(
					`#edit_product_${product.id}_qty`
				).innerHTML = `重新加入`
				const grandTotal = await calCartAgain()
				document.querySelector(`#grandTotal`).innerHTML =
					grandTotal.toLocaleString('zh-hk', {
						style: 'currency',
						currency: 'HKD'
					})
				console.log('Successful deleted!')
			} else {
				delButton.innerHTML = '未能刪除@'
				console.log('Something error when fetch delete')
			}
		})
	})
}

// 重加 cart function
export async function addCart(user_id, product_id, qty) {
	console.log(
		`User with id ${user_id} want to add product id ${product_id} with quantity ${qty}`
	)
	const res = await fetch('/cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user_id: user_id,
			product_id: product_id,
			qty: qty
		})
	})
	if (res.status === 200) {
		console.log('Successful added!')
	} else {
		editButton.innerHTML = '未能重加@'
		console.log('Something error when fetch post')
	}
}

// 計算購物車總價
function calcCart(cart) {
	let total = 0
	for (let product of cart) {
		total += product.price * product.quantities
	}

	console.log('購物車總價:', total)
	let userDetail = cart[0]
	createOrderFormArea(
		userDetail.user_id,
		userDetail.address,
		userDetail.telephone,
		total
	)
	listenOrderFormArea()
}

// 如果購物車無貨
function nilCart() {
	const cartContainer = document.querySelector('#cart')
	cartContainer.innerHTML =
		'<div>購物車未有貨品, 請前往<a href="index.html">主頁</a>選購, 謝謝.</div>'
}

// 如果成功 checkout
export function newCart(
	invoiceNo,
	total_amount,
	address,
	telephone,
	remark,
	invTime
) {
	if (invoiceNo) {
		const invoiceDate = new Date(invTime)
		const invoiceYearStr = invoiceDate.getFullYear()
		const invoiceMonthStr = ('0' + (invoiceDate.getMonth() + 1)).slice(-2)
		const invoiceDateStr = ('0' + invoiceDate.getDate()).slice(-2)
		const invoiceHrStr = ('0' + invoiceDate.getHours()).slice(-2)
		const invoiceMinStr =
			(invoiceDate.getMinutes() < 10 ? '0' : '') +
			invoiceDate.getMinutes()
		const invoiceTimeStr = `${invoiceYearStr}-${invoiceMonthStr}-${invoiceDateStr}, ${invoiceHrStr}:${invoiceMinStr}`
		const cartContainer = document.querySelector('#cart')
		document.querySelector('.cartItem').innerHTML = '<br><h4>成功結算!</h4>'
		cartContainer.innerHTML = `<div class='successCheckout'><h5>訂單資料</h5></div>
							   <div id="newCartDetail">
							   <table class="table table-hover infoTable">
							   <tr><td>帳單編號</td><td><b>${invoiceNo}</b></td></tr>
							   <tr><td>帳單日期</td><td><b>${invoiceTimeStr}</b></td></tr>
							   <tr><td>總金額</td><td><b>${Number(total_amount).toLocaleString('zh-hk', {
									style: 'currency',
									currency: 'HKD'
								})}</b></td></tr>
							   <tr><td>送貨地址</td><td><b>${address}</b></td></tr>
							   <tr><td>聯絡電話</td><td><b>${telephone}</b></td></tr>
							   <tr><td>備註</td><td><b>${remark ? remark : 'Nil'}</td></tr>
							   </table>
							   </div>
							   <br><div class='successCheckout'><h5>訂單內容</h5></div>
							   <div id="order_info_table"></div><br><br><br><br>
							   <div>請<a href="\order.html">按此</a>查看所有訂單最新狀態, 謝謝.</div>
							   `
		const orderContainer = document.querySelector('#order_info_table')
		const productHead = `<table class="table table-hover table-dark cartTable"">
				<thead>
				<tr>
					<th>項目</th>
					<th>圖片</th>
					<th>產品名稱</th>
					<th>單價</th>
					<th>數量</th>
					<th>小計</th>
				</tr>
				</thead>
				<tbody id="productTable">
				</tbody>
				</table>`
		orderContainer.innerHTML = productHead
		loadOrderItems(invoiceNo)
	}
}

// 正式開始 onload functions
window.onload = async () => {
	// console.log('window onload')
	try {
		const searchParams = new URLSearchParams(location.search)
		const searchArray = Array.from(searchParams);
		// const length = searchArray.length
		// console.log('length:', length)

		// check params exist or not
		// if (new URLSearchParams(location.search).size) {		//can't get location.search).size on safari
		if (searchArray.length > 0) {		//both work on safari and google chrome
			const searchParams = new URLSearchParams(location.search)
			// console.log("Params:", searchParams)
			// console.log("Params Size:", searchParams.size)

			// Use the id to fetch data from
			const userID = searchParams.get('user_id')
			const res = await fetch(`/cart?user_id=${userID}`)
			const cart = await res.json()
			if (cart == 404) {
				console.log('Nil item in cart!')
				nilCart()
			} else {
				console.log('start to load and calculate cart:', cart)
				loadCart(cart)
				calcCart(cart)
			}
		} else {
			console.log('params not found, user ID is needed')
			// 如沒有 params, 則重新 login
			document.querySelector('#cart').innerHTML = loginMsg
		}
	} catch (e) {
		console.log('error in loading cart:', e)
	}
}

// 修改 & 重加 cart 之後, 要 reload DB 以確認資料一致
async function reloadDB() {
	try {
		const searchParams = new URLSearchParams(location.search)
		const searchArray = Array.from(searchParams);
		// const length = searchArray.length
		// console.log('length:', length)

		// if (new URLSearchParams(location.search).size) {		//can't get location.search).size on safari
		if (searchArray.length > 0) {		//both work on safari and google chrome
			const searchParams = new URLSearchParams(location.search)
			const userID = searchParams.get('user_id')

			const res = await fetch(`/cart?user_id=${userID}`)
			const cart = await res.json()
			if (cart == 404) {
				console.log('reload DB and got nothing')
				return 0
			} else {
				console.log('reload DB and got cart:', cart)
				return cart
			}
		} else {
			console.log('params not found, user ID is needed')
			// 如沒有 params, 則重新 login
			document.querySelector('#cart').innerHTML = loginMsg
			console.log('reload DB and got nothing')
			return 0
		}
	} catch (e) {
		console.log('error in reloading cart:', e)
	}
}

// 修改 & 重加 cart 之後, 要重新計算總價
async function calCartAgain() {
	const cart = await reloadDB()
	console.log('calculate again for cart:', cart)
	let total = 0
	if (cart === 0) {
		total = '$0 (購物車已清空)'
	} else {
		for (let product of cart) {
			total += Number(product.price) * product.quantities
		}
	}
	return total
}
