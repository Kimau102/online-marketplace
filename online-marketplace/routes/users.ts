import express, { Request, Response } from 'express'
import { User } from '../models'
import { checkPassword, client, hashPassword } from '../util'

export const loginRoutes = express.Router()

loginRoutes.post('/', loginAC)
loginRoutes.post('/registration', registrateAC)

async function loginAC(req: Request, res: Response) {
	// console.log("req.body.username:", req.body.username)
	const result = await client.query(
		// 'SELECT users.username, users.password FROM users;'
		'select users.id, users.username, users.password, users.admin_auth from users where users.username = $1',
		[req.body.username]
	)
	const userList: User[] = result.rows

	///////////////login without checkPassword()
	// const checkLogin = userList.some(
	// 	(user) => user.password === req.body.password
	// )

	////////////////login with checkPassword()
	if (userList.length > 0) {
		const checkLogin = await checkPassword(req.body.password, userList[0].password)
		if (checkLogin) {
			let user = userList[0]
			req.session.user = user.username
			res.json({
				msg: 'login success',
				id: user.id,
				username: user.username,
				admin_auth: user.admin_auth
			})
			console.log(
				'login success and updated session user as:',
				req.session.user,
				'(', new Date().toLocaleDateString(), new Date().toLocaleTimeString(), ')'
			)
		}else {
			res.status(401).json({ msg: 'login failure'})
		}
	} else {
		res.status(401).json({ msg: 'login failure'})
	}
}

async function registrateAC(req: Request, res: Response) {
	console.log(req.body)
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	const telephone = req.body.telephone
	const address = req.body.address

	const existingUsers = (
		await client.query(
			`
						SELECT username FROM users
						WHERE username = $1
					`,
			[username]
		)
	).rows
	if (existingUsers.length < 1) {
		await client.query(
			`
					INSERT INTO users (username, email, password, telephone, address, admin_auth) 
					VALUES ($1, $2, $3, $4, $5, $6)`,
			[
				username,
				email,
				await hashPassword(password),
				telephone,
				address,
				false
			]
		)
		res.status(200).json({ msg: 'registration success!!' })
	} else {
		res.status(406).json({ msg: 'username exiting!!!' })
	}
}
