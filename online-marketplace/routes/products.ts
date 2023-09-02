import express, { Request, Response } from 'express'
import { client } from '../util'

export const productRoutes = express.Router()

productRoutes.get('/', getProducts)

async function getProducts(req: Request, res: Response) {
	const result = await client.query(
		'SELECT products.id, products.name, products.price, products.stock, products.description, products.image, products.status from products'
	)

	const product = result.rows
	res.json(product)
}
