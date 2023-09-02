import { addCartDIV } from './cart_add.js'
let cart = './cart.html'
let loginStatus = false

async function loadProduct() {
	loadUserID()
	const res = await fetch('/product')
	const products = await res.json()
	const productsContainer = document.querySelector('#productList')

	for (let product of products) {
		if(product.status){
			productsContainer.innerHTML += `
			<div class="col-4">
			<div>產品名稱:${product.name}</div>
			<div class="imageDiv"><image class="image" src="./photo/${product.image}"></div>
			<div>價錢:${product.price}</div>
			<div>倉儲:${product.stock}</div>
			<div 
			id="products${product.id}" 
			class="btn btn-primary productDetail"
			>
			產品內容
			</div>
			</div>
			`
		}
		
	}

	const item = document.querySelector('.item')
	const clickEvent = document.querySelectorAll("[id^='products']")

	clickEvent.forEach((element) => {
		element.addEventListener('click', (event) => {
			let id = Number(element.id.replace('products', ''))
			// console.log("element id:", id);
			// console.log("products", products)

			// 	item.innerHTML = `
			//     <div><a href="./index.html">返回上一頁</a></div>
			// `
			for (let i = 0; i < products.length; i++) {
				if (products[i].id === id) {
					console.log('DB products index === id', i, id)
					id = i
					console.log('Reading for DB product index:', id)
					break
				} else {
					console.log('DB product index == id', i, id)
				}
			}

			let description = ''
			if (products[id].description == null) {
				description = '全新上架, 未有內容介紹.'
			} else {
				description = products[id].description
			}

			productsContainer.innerHTML = `
			<div>產品介紹</div>
			<div>書本:${products[id].name}</div>
			<div>價錢:${products[id].price}</div>
			<div class="detailImageDiv"><image class="detailImage" src="./photo/${products[id].image}"></div>
			<div>書本內容: ${description}</div>
			<div class="addCart" id="${products[id].id}"></div>
			<div><a href="./index.html">返回上一頁</a> | <a href="${cart}">前往購物車結算</a></div>
        	`
			addCartDIV()
			// addCart();
		})
	})
}

window.addEventListener('load', () => {
	loadProduct()
})

async function loadUserID() {
	const res = await fetch('/checkLogin')
	if (res.status === 200) {
		const resJson = await res.json()
		cart = `./cart.html?user_id=${resJson.id}`
	} else if (res.status === 203) {
		console.log(
			'navbar: user not found / not yet login after checking with DB'
		)
	} else {
		console.log(
			`navbar: user not found? / not yet login? res.status: ${res.status}`
		)
	}
}
