import { Request, Response, NextFunction } from 'express'
import path from 'path'

export const isLoginGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session?.user) {
		console.log('username:', req.session.user)
		next()
	} else {
		res.status(404)
		res.sendFile(path.resolve('./public/404.html'))
	}
}

export const isLoggedInAPI = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.session?.user) {
		console.log('req session user name:', req.session.user)
		next()
	} else {
		res.status(401).json({ msg: 'Please login account' })
	}
}
