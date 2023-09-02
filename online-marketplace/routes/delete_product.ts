import express, { Request, Response } from 'express'
import { client } from '../util'
import { isLoggedInAPI } from '../guard'

export const deleteProductRoutes = express.Router()

deleteProductRoutes.put('/:id', isLoggedInAPI, deleteProduct)

async function deleteProduct(req: Request, res: Response) {
	const productId: number = Number(req.params.id)

	await client.query(
		'UPDATE products SET status = false WHERE id = $1;',
		[productId]
	)

	res.json('ok')
}
