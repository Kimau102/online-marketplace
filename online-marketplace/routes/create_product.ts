import { isLoggedInAPI } from '../guard'
import { client, form, parse } from '../util'
import express, { Request, Response } from 'express'

export const createProductRoutes = express.Router()

createProductRoutes.post('/', isLoggedInAPI, createProduct)

async function createProduct(req: Request, res: Response) {
	const [fields, files] = await parse(form, req)

	// const id: number = parseInt(fields.id as string)
	const name = fields.name[0]
	const price: number = parseInt(fields.price as string)
	const stock: number = parseInt(fields.stock as string)
	const category = fields.category[0]
	const description = fields.description[0]
	const image = files.image[0]?.newFilename

	await client.query(
		'INSERT INTO products(name, price, stock, category, description, image) VALUES ($1, $2, $3, $4, $5, $6);',
		[name, price, stock, category, description, image]
	)
	res.status(200).json({ msg: 'added' })
}
