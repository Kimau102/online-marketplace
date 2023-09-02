import { newCart } from './cart.js'

const searchParams = new URLSearchParams(location.search)
const userID = searchParams.get('user_id')

export function createOrderFormArea(userID, address, phone, total) {
	document.querySelector('.checkOut').innerHTML += `
     <div id="order-form-area">
     <form
        id="order-info-form"
        action="/checkout/${userID}"
        method="post"
        enctype="multipart/form-data"
        >
        <p><h4>Order Information</h4></p>
        <p>Shipping Address:</p>
            <input
                name="address"
                class="address form-control"
                id="address"
                value="${address}"
            />
        <br>
        <p>Contact Telephone:</p>
        <textarea
            name="phone"
            class="form-control"
        >${phone}</textarea>
        <br>
        <p>Remarks:</p>
        <textarea
            name="remark"
            class="form-control"
        ></textarea>
        <br>
        <div><b>產品總價: <span id="grandTotal" amount=${total}>${total.toLocaleString(
			'zh-hk',
			{ style: 'currency', currency: 'HKD' }
		)}</span></b></div>
		<div><button id='checkoutHere' class='btn btn-primary' type ='submit' />結算</div>
        </form></div>
        `
}

export function listenOrderFormArea() {
	document
		.querySelector('#order-info-form')
		.addEventListener('submit', async (event) => {
			event.preventDefault()

			//form checking
			const addressInput = event.target.address
			const phoneInput = event.target.phone

			if (
				addressInput.value.trim() === '' ||
				phoneInput.value.trim() === ''
			) {
				alert('Please fill in both address and telephone fields.')
				return
			}
			const phoneValue = phoneInput.value.trim()
			if (isNaN(phoneValue)) {
				alert('Telephone should be a number.')
				return
			}
			/////////
			// console.log("attribute:", document.querySelector('#grandTotal').getAttribute("amount"))
			// let total_amount = Number(document.querySelector('#grandTotal').getAttribute("amount"))

			console.log(
				'regex amount:',
				document
					.querySelector('#grandTotal')
					.innerText.replace(/[^0-9-.]/g, '')
			)
			let total_amount = document
				.querySelector('#grandTotal')
				.innerText.replace(/[^0-9-.]/g, '')
			let formObject = {
				user_id: userID,
				address: event.target.address.value,
				remark: event.target.remark.value,
				telephone: event.target.phone.value,
				total_amount: total_amount
			}
			console.log(formObject)
			//... create your form object with the form inputs
			const res = await fetch(`/checkout/${userID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formObject)
			})
			// Clear the form here
			// console.log(JSON.stringify('Form object:',formObject))
			if (res.status === 200) {
				document.querySelector('.checkOut').innerHTML = ''
				const resJson = await res.json()
				console.log('console log:', resJson)
				newCart(
					resJson.invoiceNo,
					total_amount,
					event.target.address.value,
					event.target.phone.value,
					event.target.remark.value,
					Date.now()
				)
				event.target.reset()
			}
		})
}
