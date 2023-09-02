// console.log("this is cart_add.js")

export function addCartDIV() {
	// console.log("this is add cart DIV function")
	const cartDIV = document.querySelector('.addCart')
	const productID = Number(cartDIV.id)
	const cartMsg = `<span>
                <button class="btn btn-outline-secondary" type="button" id="cartMinus">-</button>
                <input type="number" style="width:50px" value="1" class="addCart_qty" name="addCart_qty" id="product_${productID}_qty" />
                <button class="btn btn-outline-secondary" type="button" id="cartPlus">+</button>
                </span>
                <button class="add_product_qty btn btn-primary" name="add_product_qty" id="add_product_${productID}_qty">加入購物車</button>`
	cartDIV.innerHTML = cartMsg
	cartMinusPlusListener()
	document
		.querySelector('.add_product_qty')
		.addEventListener('click', function () {
			const qty = Number(document.querySelector('.addCart_qty').value)
			if (qty > 0 && qty % 1 == 0) {
				addNewCart(productID, qty)
			} else {
				console.log(
					'Quantity cannot be with decimal & smaller/equal to 0.'
				)
				document.querySelector('.add_product_qty').innerHTML =
					'數量有問題'
			}
		})
}

function cartMinusPlusListener() {
	document.querySelector('#cartMinus').addEventListener('click', function () {
		const qty = Number(document.querySelector('.addCart_qty').value)
		if (qty > 0 && qty % 1 == 0) {
			document.querySelector('.addCart_qty').value = qty - 1
		} else {
			console.log('Quantity cannot be with decimal & smaller/equal to 0.')
		}
	})
	document.querySelector('#cartPlus').addEventListener('click', function () {
		const qty = Number(document.querySelector('.addCart_qty').value)
		if (qty >= 0 && qty % 1 == 0) {
			document.querySelector('.addCart_qty').value = qty + 1
		} else {
			console.log('Quantity cannot be with decimal & smaller/equal to 0.')
		}
	})
}

export async function addNewCart(productID, qty) {
	console.log(`clicked for add product ID ${productID} with quantity ${qty}`)
	const res = await fetch('/add_cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ product_id: productID, qty: qty })
	})
	if (res.status === 201) {
		console.log('Successful added!')
		// document.querySelector(".add_product_qty").innerHTML = "成功添加!"
		const cartDIV = document.querySelector('.addCart')
		const cartMsg = `<span>
                <button class="btn btn-outline-secondary" type="button" id="cartMinus">-</button>
                <input type="number" style="width:50px" value="${qty}" class="addCart_qty" name="addCart_qty" id="product_${productID}_qty" />
                <button class="btn btn-outline-secondary" type="button" id="cartPlus">+</button>
                </span>
               成功添加!
               <button class="rvd_product_qty btn btn-warning" name="rvd_product_qty" id="rvd_product_${productID}_qty">修改數量</button>
               <button class="del_product_qty btn btn-danger" name="del_product_qty" id="del_product_${productID}_qty">刪除產品</button>`
		cartDIV.innerHTML = cartMsg
		cartMinusPlusListener()
		delNewCart(productID, qty)
		rvdNewCart(productID, qty)
	} else if (res.status === 200) {
		console.log('Successful added again!')
		// document.querySelector(".add_product_qty").innerHTML = "再次添加!"
		const cartDIV = document.querySelector('.addCart')
		const cartMsg = `<span>
                <button class="btn btn-outline-secondary" type="button" id="cartMinus">-</button>
                <input type="number" style="width:50px" value="${qty}" class="addCart_qty" name="addCart_qty" id="product_${productID}_qty" />
                <button class="btn btn-outline-secondary" type="button" id="cartPlus">+</button>
                </span>
               購物車已有此產品!
               <button class="rvd_product_qty btn btn-warning" name="rvd_product_qty" id="rvd_product_${productID}_qty">修改數量</button>
               <button class="del_product_qty btn btn-danger" name="del_product_qty" id="del_product_${productID}_qty">刪除產品</button>`
		cartDIV.innerHTML = cartMsg
		cartMinusPlusListener()
		delNewCart(productID, qty)
		rvdNewCart(productID, qty)
	} else {
		document.querySelector('.add_product_qty').innerHTML =
			'未能加入，請先登入帳戶'
		console.log('Something error when fetch post')
	}
}

// 刪除 cart function
function delNewCart(productID) {
	const delButton = document.querySelector('.del_product_qty')
	delButton.addEventListener('click', async function () {
		console.log(`deleting for cart product id ${productID}`)
		const qty = Number(document.querySelector('.addCart_qty').value)
		const res = await fetch(`/add_cart/${productID}`, {
			method: 'DELETE'
		})
		if (res.status === 200) {
			console.log('Successful deleted!')
			const cartDIV = document.querySelector('.addCart')
			const cartMsg = `
                 <span>
                <button class="btn btn-outline-secondary" type="button" id="cartMinus">-</button>
                <input type="number" style="width:50px" value="${qty}" class="addCart_qty" name="addCart_qty" id="product_${productID}_qty" />
                <button class="btn btn-outline-secondary" type="button" id="cartPlus">+</button>
                </span>
                       <button class="add_product_qty btn btn-primary" name="add_product_qty" id="add_product_${productID}_qty">經已刪除, 按此重新加入購物車</button>`
			cartDIV.innerHTML = cartMsg
			cartMinusPlusListener()

			// 刪除之後等候再加..
			document
				.querySelector('.add_product_qty')
				.addEventListener('click', function () {
					const qty = document.querySelector('.addCart_qty').value
					if (qty > 0 && qty % 1 == 0) {
						addNewCart(productID, qty)
					} else {
						console.log(
							'Quantity cannot be with decimal & smaller/equal to 0.'
						)
						document.querySelector('.add_product_qty').innerHTML =
							'數量有問題'
					}
				})
		} else {
			delButton.innerHTML = '未能刪除@'
			console.log('Something error when fetch delete')
		}
	})
}

// 修改數量 cart function
function rvdNewCart(productID) {
	const rvdButton = document.querySelector('.rvd_product_qty')
	rvdButton.addEventListener('click', async function () {
		const qty = Number(document.querySelector('.addCart_qty').value)
		if (qty > 0 && qty % 1 == 0) {
			console.log(
				`user want to update cart product id ${productID} amount as ${qty}`
			)
			const res = await fetch(`/add_cart`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					product_id: productID,
					product_quantities: qty
				})
			})
			if (res.status === 200) {
				rvdButton.innerHTML = '成功修改!'
				console.log('Successful updated!')
			} else {
				rvdButton.innerHTML = '未能修改@'
				console.log('Something error when fetch put')
			}
		} else {
			console.log('Quantity cannot be with decimal & smaller/equal to 0.')
			rvdButton.innerHTML = '數量有問題'
		}
	})
}
