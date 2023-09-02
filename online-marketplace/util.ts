import { Client } from 'pg'
import dotenv from 'dotenv'
import * as bcrypt from 'bcryptjs'
import formidable, { Fields, Files } from 'formidable'
import IncomingForm from 'formidable/Formidable'
// import fs from "fs"
import { Request } from 'express'

///////////////////////////////////////////////////
// postgres client setup
dotenv.config()

export const client = new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

///////////////////////////////////////////////////
// bcrypt for hash
const SALT_ROUNDS = 10

/**
 * @params plainPassword: supplied when signup
 */
export async function hashPassword(plainPassword: string) {
	const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS)
	return hash
}

/**
 * @params plainPassword: supplied when login
 * @params hashedPassword: looked up from database
 */
export async function checkPassword(
	plainPassword: string,
	hashedPassword: string
) {
	const isMatched: boolean = await bcrypt.compare(
		plainPassword,
		hashedPassword
	)
	return isMatched
}

export function parse(form: IncomingForm, req: Request) {
	return new Promise<[Fields, Files]>((resolve, reject) => {
		form.parse(req, async (err, fields, files) => {
			if (err) {
				reject(err)
			} else {
				resolve([fields, files])
			}
		})
	})
}

let counter = 0
export const form = formidable({
	uploadDir: 'public/photo',
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false,
	filename: (originalName, originalExt, part) => {
		counter++
		return `newBook${counter}.jpg`
	}
})
