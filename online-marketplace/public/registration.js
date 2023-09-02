import { loadNavItems } from './navbar.js'
loadNavItems

document
	.querySelector('#registrationButton')
	.addEventListener('click', async () => {
		const username = document.querySelector('#username').value
		const email = document.querySelector('#email').value
		const password = document.querySelector('#password').value
		const confirmPassword = document.querySelector('#confirmPassword').value;
		const telephone = document.querySelector('#telephone').value
		const address = document.querySelector('#address').value

		if (username.length < 3) {
			alert('Username should be at least 3 characters long')
			return
		}

		// Check if email is valid using a simple regex pattern
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailPattern.test(email)) {
			alert('Invalid email format')
			return
		}

		// Check if password is at least 8 characters long
		if (password.length < 8) {
			alert('Password should be at least 8 characters long')
			return
		}

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		if (telephone.trim() === '' || isNaN(telephone)) {
			alert('Telephone should be a valid number')
			return
		}

		if (address.trim() === '') {
			alert('Address cannot be empty')
			return
		}

		const registrationObj = {
			username: username,
			email: email,
			password: password,
			telephone: telephone,
			address: address
		}
		console.log(registrationObj)
		const res = await fetch('/login/registration', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(registrationObj)
		})
		if (res.status === 200) {
			console.log('Registration success')
			document.querySelector('#username').value = ''
			document.querySelector('#email').value = ''
			document.querySelector('#password').value = ''
			document.querySelector('#telephone').value = ''
			document.querySelector('#address').value = ''
		} else {
			console.log('Registration failure')
		}
	})
