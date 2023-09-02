import express, { Request, Response } from 'express'
import { client } from '../util'
import { isLoggedInAPI } from '../guard'

export const checkOutRoutes = express.Router()

checkOutRoutes.post('/:id', isLoggedInAPI, checkoutOrder)

async function checkoutOrder(req: Request, res: Response) {
	const userID = parseInt(req.params.id)
	// console.log(req.body)
	try {
		//clear cart table by checkout
		const buyItems = (
			await client.query(`
                SELECT * FROM cart WHERE user_id = ${userID} AND status = TRUE
            `)
		).rows
		// console.log(userID) //query id
		// console.log(buyItems)

		if (buyItems.length > 0) {
			let allItemsBought = true
			let buyItem
			for (buyItem of buyItems) {
				const buyItemID = buyItem.product_id as Number
				const buyItemQuantities = buyItem.quantities as Number

				const productsStock = (
					await client.query(`
                    SELECT stock FROM products WHERE id = ${buyItemID};
                `)
				).rows[0]

				console.log(
					'products stock remain before checkout:',
					productsStock.stock
				)

				if (productsStock.stock < buyItemQuantities) {
					allItemsBought = false
					break // Stop checking if one item can't be bought
				}
			}
			if (allItemsBought) {
				for (buyItem of buyItems) {
					const buyItemID = buyItem.product_id as Number
					const buyItemQuantities = buyItem.quantities as Number

					await client.query(
						`
                        DELETE FROM cart WHERE user_id = $1
                    `,
						[userID]
					)

					await client.query(
						`
                        UPDATE products SET stock = stock - $1 WHERE products.id = $2
                    `,
						[buyItemQuantities, buyItemID]
					)
					// console.log('process ok!!')
				}
				// //////////////////////////////////////// insert order_info table
				const formObj = req.body
				const maxInvoiceNo = await client.query(`
                    SELECT invoice_no FROM order_info WHERE invoice_no = (SELECT MAX(invoice_no) FROM order_info)
                    `)

				let newInvoiceNo
				if (maxInvoiceNo.rowCount > 0) {
					newInvoiceNo = maxInvoiceNo.rows[0].invoice_no + 1
				} else {
					newInvoiceNo = 1000 // If no existing invoices, start from 1000
				}

				const invoiceNos = await client.query(
					`
                    INSERT INTO order_info (invoice_no, user_id, address, remark, status, telephone, total_amount) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING invoice_no`,
					[
						newInvoiceNo,
						formObj.user_id,
						formObj.address,
						formObj.remark,
						true,
						formObj.telephone,
						formObj.total_amount
					]
				)
				const invoiceNo = invoiceNos.rows[0].invoice_no
				console.log('created with invoice_no:', invoiceNo)

				// //////////////////////////////insert order_items table
				for (let buyItem of buyItems) {
					// console.log(buyItem)
					let productsPrice = (
						await client.query(`
                    SELECT products.price FROM products WHERE id = ${buyItem.product_id}
                    `)
					).rows[0]

					let orderID = (
						await client.query(`
                        SELECT order_info.id FROM order_info WHERE invoice_no = ${newInvoiceNo}
                    `)
					).rows[0].id
					await client.query(
						`
                    INSERT INTO order_items (user_id, order_id, product_id, quantities, price) 
                    VALUES ($1, $2, $3, $4, $5)`,
						[
							formObj.user_id,
							orderID,
							buyItem.product_id,
							buyItem.quantities,
							productsPrice.price
						]
					)
				}
				res.status(200).json({
					msg: 'checkout and insert buyer info and order info and order item success!!!',
					invoiceNo: invoiceNo
				})
			}
		} else {
			res.status(400).json({
				msg: 'No any product in cart, please add products'
			})
		}
	} catch (e) {
		console.log(e)
	}
}
