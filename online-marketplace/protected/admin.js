
const input = document.querySelector('#input')
	.addEventListener('change', function(event) {
		let file = event.target.files[0];
		let reader = new FileReader();
		const image = document.querySelector('#image');
		const imageBlock = document.querySelector('#imageBlock');

		reader.onload = function(event) {
			image.setAttribute('src', event.target.result);
			imageBlock.style.display = 'block'
		}

		if (file){
			reader.readAsDataURL(file);
			console.log("1")
		} else {
			// imageBlock.style.display = 'none';
		}
		
	})


async function readProduct() {
	const res = await fetch('./product')
	const products = await res.json()
	const productId = products.length + 1

	document
		.querySelector('#add')
		.addEventListener('submit', async function (event) {
			event.preventDefault()

			const form = event.target
			const formData = new FormData()

			if (
				!form.name.value ||
				!form.price.value ||
				!form.stock.value ||
				!form.category.value ||
				!form.description.value ||
				!form.image.files[0]
			) {
				alert('請填寫所有欄位')
				return
			}

			formData.append('id', productId.toString())
			formData.append('name', form.name.value)
			formData.append('price', form.price.value)
			formData.append('stock', form.stock.value)
			formData.append('category', form.category.value)
			formData.append('description', form.description.value)
			formData.append('image', form.image.files[0])

			const res = await fetch('/add', {
				method: 'POST',
				body: formData
			})

			if (res.status === 200) {
				window.alert('產品已增加')
			}

			form.reset()
		})
}

window.addEventListener('load', () => {
	readProduct()
})
