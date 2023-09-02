import { loadNavItems } from './navbar.js'
loadNavItems

const orderContainer = document.querySelector('#order_info_table')
const orderHead = `<table class="table table-hover">
				<thead>
				<tr>
				    <th>訂單編號</th>
					<th>訂單日期</th>
					<th>訂單總額</th>
					<th>送貨地址</th>
					<th>聯絡電話</th>
					<th>備註</th>
					<th>訂單狀態</th>
					<th>訂單內容</th>
				</tr>
				</thead>
				<tbody id='orderTable'>
				</tbody>
				</table>`
const productHead = `<table class="table table-dark table-striped table-hover productTable">
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

window.addEventListener('load', async () => {
	const OrderRes = await fetch('/viewOrders')
	console.log('OrderRes.status:', OrderRes.status)
	const orders = await OrderRes.json()
	if (OrderRes.status === 203) {
		console.log('order:', orders)
		orderContainer.innerHTML = `<div>未有帳單存在, 請前往<a href="\index.html">主頁</a>選購, 謝謝.</div>`
	} else if (OrderRes.status === 200) {
		console.log('order:', orders)
		loadOrder(orders)
	} else {
		orderContainer.innerHTML = `<div>未登入帳號, 請先<a href="\login.html">登入帳號</a>或按此<a href="./registration.html">登記新用戶</a>, 謝謝.</div>`
	}
})

function loadOrder(orders) {
	if (orders && orderContainer) {
		orderContainer.innerHTML = orderHead
		const orderTableContainer = document.querySelector('#orderTable')
		for (let order of orders) {
			const invoiceDate = new Date(order.created_at)
			const invoiceYearStr = invoiceDate.getFullYear()
			const invoiceMonthStr = ('0' + (invoiceDate.getMonth() + 1)).slice(
				-2
			)
			const invoiceDateStr = ('0' + invoiceDate.getDate()).slice(-2)
			const invoiceHrStr = ('0' + invoiceDate.getHours()).slice(-2)
			const invoiceMinStr =
				(invoiceDate.getMinutes() < 10 ? '0' : '') +
				invoiceDate.getMinutes()
			const invoiceTimeStr = `${invoiceYearStr}-${invoiceMonthStr}-${invoiceDateStr}, ${invoiceHrStr}:${invoiceMinStr}`
			let orderMsg = `<tr> 
				       <td>${order.invoice_no}</td>
					   <td>${invoiceTimeStr}</td>
					   <td>${Number(order.total_amount).toLocaleString('zh-hk', {
							style: 'currency',
							currency: 'HKD'
						})}</td>
					   <td>${order.address}</td>
					   <td>${order.telephone}</td>
					   <td>${order.remark ? order.remark : 'Nil'}</td>
					   <td>${order.status}</td>
					   <td><button class="view_invoice_btn btn btn-info" name="view_invoice_btn" id="${
							order.invoice_no
						}">按此查看</button></td>
					   </tr>
					   <tr id="view_invoice_tableTr_${order.invoice_no}">
					   <td colspan="8" class="view_invoice_tableTd" name="view_invoice_table" id="invoice_${
							order.invoice_no
						}"></td>
					   </tr>`
			orderTableContainer.innerHTML += orderMsg
		}
		checkInvoice()
	}
}

async function checkInvoice() {
	const viewInvoiceButtons = document.querySelectorAll('.view_invoice_btn')
	viewInvoiceButtons.forEach((viewInvoiceButton) => {
		viewInvoiceButton.addEventListener('click', async function () {
			const viewInvoiceBoxes = document.querySelectorAll(
				'.view_invoice_tableTd'
			)
			viewInvoiceBoxes.forEach((viewInvoiceBox) => {
				viewInvoiceBox.innerHTML = ''
			})
			const invoice_no = Number(viewInvoiceButton.id)
			console.log('clicked for invoice_no:', invoice_no)
			const viewInvoiceBox = document.querySelector(
				`#invoice_${invoice_no}`
			)
			viewInvoiceBox.innerHTML = productHead
			await loadOrderItems(invoice_no)
		})
	})
}

export async function loadOrderItems(invoice_no) {
	if (invoice_no) {
		const orderItemsRes = await fetch(`/viewOrders/${invoice_no}`)
		console.log('OrderRes.status:', orderItemsRes.status)
		const orderItems = await orderItemsRes.json()
		if (orderItemsRes.status === 203) {
			console.log('orderItems:', orderItems)
			orderContainer.innerHTML = `<div>未有物件存在, 帳單有問題, 請聯絡店主或系統管理員, 謝謝.</div>`
		} else if (orderItemsRes.status === 200) {
			console.log('orderItems:', orderItems)
			const productContainer = document.querySelector(`#productTable`)
			for (let orderItem of orderItems) {
				let productContainerMsg = `
			<tr><td>${orderItems.indexOf(orderItem) + 1}</td>
			<td><image src="./photo/${orderItem.image}" width="50px"; height="50px";></td>
			<td>${orderItem.name}</td>
			<td>${Number(orderItem.price).toLocaleString('zh-hk', {
				style: 'currency',
				currency: 'HKD'
			})}</td>
			<td>${orderItem.quantities}</td>
			<td>${(orderItem.price * orderItem.quantities).toLocaleString('zh-hk', {
				style: 'currency',
				currency: 'HKD'
			})}</td></tr>
			`
				productContainer.innerHTML += productContainerMsg
			}
		} else {
			orderContainer.innerHTML = `<div>未登入帳號, 請先<a href="\login.html">登入帳號</a>或按此<a href="./registration.html">登記新用戶</a>, 謝謝.</div>`
		}
	}
}
