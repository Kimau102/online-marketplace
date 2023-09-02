import express, { Request, Response } from 'express'
import { client } from '../util'
import { isLoggedInAPI } from '../guard'
import { User } from '../models'

// Define router name
export const cartRoutes = express.Router()

// GET view cart list
cartRoutes.get('/', isLoggedInAPI, getCart)
async function getCart(req: Request, res: Response) {
	try {
		// const userID = parseInt(req.query.user_id as string)
		// 因為安全問題, userID 停止使用 params user_id
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const session_userID = user.id
		const userID = session_userID

		console.log(`user with ID ${userID} entered cart view page`)

		let carts = (
			await client.query(
				`
        SELECT users.id AS user_id, users.address, users.telephone, products.id, products.name, products.image, products.price, products.status, cart.quantities FROM users 
        INNER JOIN cart on cart.user_id = users.id 
        INNER JOIN products on cart.product_id = products.id 
        WHERE cart.status = true AND products.status = true AND users.id = $1 ORDER BY cart.updated_at ASC
        `,
				[userID]
			)
		).rows

		//檢查是否空籃
		console.log('carts length:', carts.length)
		if (carts.length) {
			res.json(carts)
		} else {
			console.log('Nil item in cart!', carts)
			res.json(404)
			// res.redirect('./index.html')
		}
	} catch (e) {
		console.log('Something error when get cart:', e)
	}
}

// PUT add to cart list
cartRoutes.put('/', isLoggedInAPI, editCart)
async function editCart(req: Request, res: Response) {
	try {
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const userID = user.id
		// console.log('req.json:', req.body)
		const productID = req.body.product_id
		const qty = req.body.product_quantities
		console.log(
			`user with ID ${userID} want to update cart product with ID ${productID} as quantity ${qty}`
		)
		await client.query(
			'UPDATE cart SET quantities = $1 WHERE user_id = $2 AND product_id = $3;',
			[qty, userID, productID]
		)
		await client.query(
			'UPDATE cart SET updated_at = NOW() WHERE user_id = $1 AND product_id = $2;',
			[userID, productID]
		)
		console.log('updated for above query')
		res.status(200).json({ msg: 'Successfully updated' })
	} catch (e) {
		console.log('Something error when put cart:', e)
	}
}

// POST add to cart list
cartRoutes.post('/', isLoggedInAPI, addCart)
async function addCart(req: Request, res: Response) {
	try {
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const session_userID = user.id

		// console.log('req.json:', req.body)
		const userID = req.body.user_id
		console.log(
			`checking for session_userID: ${session_userID}, userID: ${userID}`
		)
		console.log(`Remark: If above is different, should stop adding cart`)
		const productID = req.body.product_id
		const qty = req.body.qty
		console.log(
			`user with ID ${userID} want to update cart product with ID ${productID} as quantity ${qty}`
		)

		await client.query(
			'INSERT INTO cart (user_id, product_id, quantities) VALUES ($1, $2, $3)',
			[userID, productID, qty]
		)
		console.log('added for above query')
		res.status(200).json({ msg: 'Successfully added' })
	} catch (e) {
		console.log('Something error when add cart:', e)
	}
}

// DELETE add to cart list
cartRoutes.delete('/:id', isLoggedInAPI, delCart)
async function delCart(req: Request, res: Response) {
	try {
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const userID = user.id
		const productID: number = Number(req.params.id)
		console.log(
			`user with ID ${userID} want to delete cart product with ID ${productID}`
		)
		const deleteSQL = await client.query(
			`DELETE FROM cart WHERE user_id = $1 and product_id = $2`,
			[userID, productID]
		)
		if (deleteSQL) {
			console.log(
				`user with ID ${userID} deleted cart product with ID ${productID}`
			)
			res.status(200).json({ msg: 'Successfully deleted' })
		} else {
			console.log(
				`user with ID ${userID} failed delete cart product with ID ${productID}`
			)
			res.status(405).json({ msg: 'Something error when delete' })
		}
	} catch (e) {
		console.log('Something error when delete cart:', e)
	}
}
