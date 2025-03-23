import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate()
	const { auth, setAuth } = useContext(AuthContext)
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isLoggingIn, SetLoggingIn] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetLoggingIn(true)
		try {
			const response = await axios.post('/auth/login', data)
			// console.log(response.data)
			toast.success('Login success!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			setAuth((prev) => ({ ...prev, token: response.data.token }))
			navigate('/')
		} catch (error) {
			console.error(error.response.data)
			setErrorsMessage(error.response.data)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingIn(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500'
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-3xl space-y-8  bg-white p-20 ">
				<div>
					
					<h2 className="mt-4 text-center text-5xl font-extrabold text-gray-900">LOGIN</h2>
					<div></div>
					<p className="text-center mt-8 space-y-5">Hello there! Login and start booking your movie tickets.</p>
				</div>
				<form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
					<input
						name="username"
						type="text"
						autoComplete="username"
						{...register('username', { required: true })}
						className={inputClasses`${errors.username ? 'border-red-500' : ''}`}
						placeholder="Username"
					/>
					{errors.username && <span className="text-sm text-red-500">Username is required</span>}
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						{...register('password', { required: true })}
						className={inputClasses`${errors.password ? 'border-red-500' : ''}`}
						placeholder="Password"
					/>
					{errors.password && <span className="text-sm text-red-500">Password is required</span>}

					<div>
						{errorsMessage && <span className="text-sm text-red-500">{errorsMessage}</span>}
						<button
    						type="submit"
    						className="mt-4 w-full rounded-none bg-orange-500 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-slate-500"
    						disabled={isLoggingIn}
						>
    						{isLoggingIn ? 'Processing...' : 'Login'}
						</button>

					</div>
					<p className="text-center">
						Don’t have an account?{' '}
						<Link to={'/register'} className="font-bold text-green-600">
							Register here
						</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
