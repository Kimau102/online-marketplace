async function readProduct() {
	const res = await fetch('./product')
	const products = await res.json()
	const productsContainer = document.querySelector('.deletePage')

	// document.querySelector('.test').addEventListener('click', async () => {
	// 	await console.log(`${products.name}`)
	// })

	for (let product of products) {
		if (product.status){
			productsContainer.innerHTML += `
			<div class="col-md-4">
			<div class="name">
			<div>產品名稱:</div>
			<div>${product.name}</div>
			</div>
			<div class="imageDiv"><image class="image" src="./photo/${product.image}";></div>
			<div>價錢:${product.price}</div>
			<div>倉儲:${product.stock}</div>
			<div id="delete${product.id}"
			class="btn btn-primary delete"
			>
			X</div>
			</div>
			`
		}
	}

	const deleteButton = document.querySelectorAll("[id^='delete']")

	deleteButton.forEach((element) => {
		element.addEventListener('click', async (event) => {
			const productId = element.id.replace('delete', '')

			const res = await fetch(`/put/${productId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (res.ok) {
				window.alert('產品已下架')
				location.reload()
			}
		})
	})
}

window.addEventListener('load', () => {
	readProduct()
})
