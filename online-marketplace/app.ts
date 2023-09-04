import express, { Request, Response } from 'express'
import session from 'express-session'
import path from 'path'
import { User } from './models'
import { isLoginGuard } from './guard'
import { loginRoutes } from './routes/users'
import { productRoutes } from './routes/products'
import { cartRoutes } from './routes/cart'
import { addCartRoutes } from './routes/cart_add'
import { viewOrderRoutes } from './routes/view_order'
// import cookieParser from 'cookie-parser'
import { client } from './util'
import { checkOutRoutes } from './routes/checkout'
import { createProductRoutes } from './routes/create_product'
import { deleteProductRoutes } from './routes/delete_product'
client.connect() // "dial-in" to the postgres server

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
	session({
		secret: 'I Love shopping',
		resave: true,
		saveUninitialized: true
	})
)

declare module 'express-session' {
	interface SessionData {
		user?: string,
		counter?: number
	}
}

const visitors = {};
app.use((req, res, next) => {
  const logTime = new Date();
  if (!req.session.counter) {
    req.session.counter = 1;
    if (!visitors[req.session.id]) {
		visitors[req.session.id] = true;
    }
    console.log(`Total visitors: ${Object.keys(visitors).length}`);
    console.log('Cookies first time:', req.session.id, ', welcome for first time!', '(', logTime.toLocaleDateString(), logTime.toLocaleTimeString(), ')');
  }
  next();
});

app.use('/login', loginRoutes)
app.use('/product', productRoutes)
app.use('/add_cart', addCartRoutes)
app.use('/cart', cartRoutes)
app.use('/checkout', checkOutRoutes)
app.use('/viewOrders', viewOrderRoutes)
app.use('/add', createProductRoutes)
app.use('/put', deleteProductRoutes)

app.get('/getProducts', async (req, res) => {
	const result = await client.query('SELECT products.id')

	const productId = result.rows
	console.log(productId)
})

app.get('/checkLogin', async (req: Request, res: Response) => {
	if (req.session?.user) {
		console.log('checkLogin route: req.session.user:', req.session.user)
		const result = await client.query(
			'select users.id, users.username, users.password, users.admin_auth, users.email, users.telephone, users.address from users where users.username = $1',
			[req.session.user]
		)
		const user: User = result.rows[0]
		console.log('checked login user details:', user)

		// 回傳 user.id 給 FRONT END
		res.status(200)
		res.json({
			msg: 'You already login!!!',
			id: user.id,
			username: user.username,
			admin_auth: user.admin_auth,
			email: user.email,
			telephone: user.telephone,
			address: user.address
		})
	} else {
		console.log('checkLogin route: req.session.user not found!')
		res.status(203).json({ msg: 'checkLogin: Please login account' })
		//試野
	}
})

app.get('/logout', async (req, res) => {
	if (req.session) {
		// res.clearCookie('isLoggedIn')
		// console.log(req.session)
		delete req.session['user']
	}
	res.redirect('/')
})

app.use(express.static('./public'))

app.use(isLoginGuard, express.static('./protected'))

app.use((req, res) => {
	res.status(404)
	res.sendFile(path.resolve('./public/404.html'))
})

const PORT = 80
app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`)
})
