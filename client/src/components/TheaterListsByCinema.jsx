import {
	ArrowsRightLeftIcon,
	ArrowsUpDownIcon,
	CheckIcon,
	PencilSquareIcon,
	TrashIcon
} from '@heroicons/react/24/solid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DateSelector from './DateSelector'
import Theater from './Theater'
import { RiImageEditFill } from "react-icons/ri";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FaArrowsAltV,FaArrowsAltH  } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

const TheaterListsByCinema = ({ cinemas, selectedCinemaIndex, setSelectedCinemaIndex, fetchCinemas, auth }) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const {
		register: registerName,
		handleSubmit: handleSubmitName,
		setValue: setValueName,
		formState: { errors: errorsName }
	} = useForm()

	const [movies, setMovies] = useState()
	const [selectedDate, setSelectedDate] = useState(
		(sessionStorage.getItem('selectedDate') && new Date(sessionStorage.getItem('selectedDate'))) || new Date()
	)
	const [isIncreasing, SetIsIncreaseing] = useState(false)
	const [isDeleting, SetIsDeleting] = useState(false)
	const [isDecreasing, SetIsDecreasing] = useState(false)
	const [isEditing, SetIsEditing] = useState(false)

	const fetchMovies = async (data) => {
		try {
			const response = await axios.get('/movie')
			// console.log(response.data.data)
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	useEffect(() => {
		SetIsEditing(false)
		setValueName('name', cinemas[selectedCinemaIndex].name)
	}, [cinemas[selectedCinemaIndex].name])

	const handleDelete = (cinema) => {
		const confirmed = window.confirm(
			`Do you want to delete cinema ${cinema.name}, including its theaters, showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteCinema(cinema._id)
		}
	}

	const onDeleteCinema = async (id) => {
		try {
			SetIsDeleting(true)
			const response = await axios.delete(`/cinema/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			setSelectedCinemaIndex(null)
			fetchCinemas()
			toast.success('Delete cinema successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsDeleting(false)
		}
	}

	const onIncreaseTheater = async (data) => {
		try {
			SetIsIncreaseing(true)
			const response = await axios.post(
				`/theater`,
				{
					cinema: cinemas[selectedCinemaIndex]._id,
					number: cinemas[selectedCinemaIndex].theaters.length + 1,
					row: data.row.toUpperCase(),
					column: data.column
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			fetchCinemas()
			// console.log(response.data)
			toast.success('Add theater successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error(errors, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsIncreaseing(false)
		}
	}

	const handleDecreaseTheater = (cinema) => {
		const confirmed = window.confirm(
			`Do you want to delete theater ${cinemas[selectedCinemaIndex].theaters.length}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDecreaseTheater()
		}
	}

	const onDecreaseTheater = async () => {
		try {
			SetIsDecreasing(true)
			const response = await axios.delete(`/theater/${cinemas[selectedCinemaIndex].theaters.slice(-1)[0]._id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchCinemas()
			toast.success('Deleted theater!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsDecreasing(false)
		}
	}

	const onEditCinema = async (data) => {
		try {
			const response = await axios.put(
				`/cinema/${cinemas[selectedCinemaIndex]._id}`,
				{
					name: data.name
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			fetchCinemas(data.name)
			toast.success('Edit cinema name successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		}
	}

	return (
		<div className="mx-4 h-fit rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 text-gray-900 drop-shadow-md sm:mx-8">
			<div className="flex items-center justify-center gap-2 rounded-t-md bg-gradient-to-br from-orange-400 to-amber-700  text-center text-5xl font-bold text-white sm:py-5">
				{isEditing ? (
					<input
						title="Cinema name"
						type="text"
						required
						autoFocus
						className={`flex-grow rounded border border-white bg-gradient-to-br from-gray-900 to-gray-800 px-1 text-center text-2xl font-semibold drop-shadow-sm sm:text-3xl ${
							errorsName.name && 'border-2 border-red-500'
						}`}
						{...registerName('name', { required: true })}
					/>
				) : (
					<span className="flex-grow text-4xl sm:text-3xl">{cinemas[selectedCinemaIndex]?.name}</span>
				)}
				{auth.role === 'admin' && (
					<>
						{isEditing ? (
							<form onClick={handleSubmitName(onEditCinema)}>
								<button
									title="Save cinema name"
									className="flex w-fit items-center gap-1 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500  py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400"
									onClick={() => {
										SetIsEditing(false)
									}}
								>
									SAVE
									<CheckIcon className="h-5 w-5" />
								</button>
							</form>
						) : (
							<button
								title="Edit cinema name"
								className="flex w-fit items-center gap-2  bg-gradient-to-r from-green-600 to-green-500  py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-500 hover:to-blue-400"
								onClick={() => SetIsEditing(true)}
							>
								EDIT
								<RiImageEditFill className="h-5 w-5" />
							</button>
						)}
						<button
							title="Delete cinema"
							disabled={isDeleting}
							className="flex w-fit items-center gap-2  bg-gradient-to-r from-red-700 to-red-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-red-600 hover:to-rose-600 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleDelete(cinemas[selectedCinemaIndex])}
						>
							{isDeleting ? (
								'Processing...'
							) : (
								<>
									DELETE
									<RiDeleteBack2Fill className="h-5 w-5" />
								</>
							)}
						</button>
					</>
				)}
			</div>
			<div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
				<DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onIncreaseTheater)}>
					<h2 className="text-4xl font-bold">Screens</h2>
					{auth.role === 'admin' && (
						<div className="flex w-full flex-wrap justify-between gap-4  bg-gradient-to-br from-indigo-100 to-white p-4">
							<h3 className="flex items-center text-2xl font-bold">Add Screen</h3>
							<div className="flex grow flex-col gap-4 sm:justify-end md:flex-row">
								<div className="flex flex-wrap justify-end gap-4">
									<div className="flex flex-wrap gap-2">
										<FaArrowsAltV  className="h-6 w-6" />
										<div className="my-1 flex flex-col items-end">
											<label className="text-lg font-semibold leading-5">Row Limit:</label>
											<label className="text-s font-semibold">(A-Z)</label>
										</div>
										<input
											title={errors.row ? errors.row.message : 'A to Z'}
											type="text"
											maxLength="2"
											required
											className={`w-14 rounded px-3 py-1 text-2xl font-semibold drop-shadow-sm leading-3
											${errors.row && 'border-2 border-red-500'}`}
											{...register('row', {
												required: true,
												pattern: {
													value: /^([A-Za-z])$/,
													message: 'Invalid row'
												}
											})}
										/>
									</div>
									<div className="flex flex-wrap gap-2">
										<FaArrowsAltH  className="h-6 w-6" />
										<div className="my-1 flex flex-col items-end">
											<label className="text-lg font-semibold leading-5">Column Limit:</label>
											<label className="text-s font-semibold">(1-50)</label>
										</div>
										<input
											title={errors.column ? errors.column.message : '1 to 50'}
											type="number"
											min="1"
											max="50"
											maxLength="3"
											required
											className={`w-24 rounded px-3 py-1 text-2xl font-semibold drop-shadow-sm leading-3 ${
												errors.column && 'border-2 border-red-500'
											}`}
											{...register('column', { required: true })}
										/>
									</div>
								</div>
								<div className="flex grow md:grow-0">
									<div className="flex  flex-col items-center justify-center gap-1  bg-gradient-to-br from-pink-800 to-pink-800 p-1 text-white">
										<label className="text-xl font-semibold leading-3">Screen Number: {cinemas[selectedCinemaIndex].theaters.length + 1}</label>
										
									</div>
									<button
  title="Add theater"
  disabled={isIncreasing}
  className="flex items-center justify-center whitespace-nowrap bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 text-lg font-medium text-white drop-shadow-md hover:from-green-900 hover:to-green-900"
  type="submit"
>
  <IoMdAddCircle className='h-8 w-8'/> 
  {isIncreasing ? 'Processing...' : ''}
</button>
								</div>
							</div>
						</div>
					)}
				</form>
				{cinemas[selectedCinemaIndex].theaters.map((theater, index) => {
					return (
						<Theater
							key={index}
							theaterId={theater._id}
							movies={movies}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					)
				})}
				{auth.role === 'admin' && cinemas[selectedCinemaIndex].theaters.length > 0 && (
					<div className="flex justify-center">
						<button
							title="Delete last screen"
							className="w-fit  bg-gradient-to-r from-red-700 to-red-600 px-2 py-1 font-medium text-white drop-shadow-md hover:from-red-600 hover:to-red-500 disabled:from-slate-500 disabled:to-slate-400"
							onClick={() => handleDecreaseTheater()}
							disabled={isDecreasing}
						>
							{isDecreasing ? 'Processing...' : 'DELETE LAST SCREEN'}
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default TheaterListsByCinema
