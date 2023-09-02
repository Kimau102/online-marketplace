import express, { Request, Response } from 'express'
import { client } from '../util'
import { isLoggedInAPI } from '../guard'
import { User } from '../models'

// Define router name
export const addCartRoutes = express.Router()

// POST add to cart list
addCartRoutes.post('/', isLoggedInAPI, addCart)
async function addCart(req: Request, res: Response) {
	try {
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const session_userID = user.id

		// // console.log('req.json:', req.body)
		// const userID = req.body.user_id;
		// console.log(`checking for session_userID: ${session_userID}, userID: ${userID}`)
		// console.log(`Remark: If above is different, should stop adding cart`)
		const userID = session_userID
		const productID = req.body.product_id
		const qty = req.body.qty
		console.log(
			`user with ID ${userID} want to add cart product with ID ${productID} as quantity ${qty}`
		)

		let cartOfProduct = (
			await client.query(
				`
        SELECT users.id AS user_id, products.id, cart.quantities FROM users 
        INNER JOIN cart on cart.user_id = users.id 
        INNER JOIN products on cart.product_id = products.id 
        WHERE users.id = $1 AND products.id = $2;
        `,
				[userID, productID]
			)
		).rows

		if (cartOfProduct.length === 0) {
			await client.query(
				'INSERT INTO cart (user_id, product_id, quantities) VALUES ($1, $2, $3)',
				[userID, productID, qty]
			)
			console.log('added new for above query')
			res.status(201).json({ msg: 'Successfully added' })
		} else {
			console.log(
				`already exist as quantity ${cartOfProduct[0].quantities} in cart, stop update for above query`
			)
			// let newQty = cartOfProduct[0].quantities + qty;
			// await client.query(
			// 	'UPDATE cart SET quantities = $1 WHERE user_id = $2 AND product_id = $3;',
			// 	[newQty, userID, productID]
			// 	)
			// 	await client.query(
			// 		'UPDATE cart SET updated_at = NOW() WHERE user_id = $1 AND product_id = $2;',
			// 		[userID, productID]
			// 		)
			// console.log(`updated for above query, new quantity as ${newQty} in cart`)
			res.status(200).json({ msg: 'Successful req, but stop add again' })
		}
	} catch (e) {
		console.log('Something error when add cart:', e)
	}
}

// DELETE add to cart list
addCartRoutes.delete('/:id', isLoggedInAPI, delCart)
async function delCart(req: Request, res: Response) {
	try {
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const session_userID = user.id
		const userID = session_userID
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

// PUT add to cart list
addCartRoutes.put('/', isLoggedInAPI, rvdCart)
async function rvdCart(req: Request, res: Response) {
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
