import express, { Request, Response } from 'express'
import { client } from '../util'
import { isLoggedInAPI } from '../guard'
import { User } from '../models'

// Define router name
export const viewOrderRoutes = express.Router()

// GET view order list
viewOrderRoutes.get('/', isLoggedInAPI, viewOrder)
async function viewOrder(req: Request, res: Response) {
	try {
		//取得用戶ID
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const userID = user.id
		console.log(`user with ID ${userID} entered view order page`)

		//取得訂單資料
		const orders = (
			await client.query(
				'select * from order_info where user_ID = $1 ORDER BY updated_at DESC',
				[userID]
			)
		).rows

		//檢查有沒有訂單存在
		console.log('orders length:', orders.length)
		if (orders.length === 0) {
			console.log('Nil orders can be find!')
			res.status(203).json({ msg: 'Nil orders can be find!' })
		} else if (orders.length > 0) {
			console.log('Orders found:', orders)
			res.status(200).json(orders)
		} else {
			console.log('Something error when get view order:', orders)
			res.json(404).json({ msg: 'Something error when get view order!' })
			// res.redirect('./index.html')
		}
	} catch (e) {
		console.log('Something error when get view order:', e)
	}
}

viewOrderRoutes.get('/:id', isLoggedInAPI, viewInvoice)
async function viewInvoice(req: Request, res: Response) {
	try {
		//取得 userID
		const result = await client.query(
			'select users.id from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		const userID = user.id
		console.log(`user with ID ${userID} entered view order_items page`)

		//取得 Invoice_No & orderID
		const invoiceNo: number = Number(req.params.id)
		const OrdersResult = await client.query(
			'select order_info.id from order_info where order_info.invoice_no = $1',
			[invoiceNo]
		)
		const orderID = OrdersResult.rows[0].id

		//取得 order_items
		const order_items = (
			await client.query(
				`SELECT order_items.*, products.name, products.image FROM order_items 
            INNER JOIN users on order_items.user_id = users.id 
            INNER JOIN products on order_items.product_id = products.id  
            WHERE user_id = $1 AND order_id = $2 ORDER BY updated_at DESC, product_id ASC`,
				[userID, orderID]
			)
		).rows

		//檢查有沒有訂單存在
		console.log('order_items length:', order_items.length)
		if (order_items.length === 0) {
			console.log('Nil order_items can be find!')
			res.status(203).json({ msg: 'Nil order_items can be find!' })
		} else if (order_items.length > 0) {
			console.log('Orders found:', order_items)
			res.status(200).json(order_items)
		} else {
			console.log(
				'Something error when get view order_items:',
				order_items
			)
			res.json(404).json({
				msg: 'Something error when get view order_items!'
			})
		}
	} catch (e) {
		console.log('Something error when get view order_items:', e)
	}
}
