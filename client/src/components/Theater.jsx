import { ArrowsRightLeftIcon, ArrowsUpDownIcon, InformationCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-tailwindcss-select'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import Loading from './Loading'
import Showtimes from './Showtimes'
import { IoMdAddCircle } from "react-icons/io";
import { FaArrowsAltV,FaArrowsAltH  } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";

const Theater = ({ theaterId, movies, selectedDate, filterMovie, setSelectedDate }) => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		watch,
		formState: { errors }
	} = useForm()

	const { auth } = useContext(AuthContext)

	const [theater, setTheater] = useState({})
	const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false)
	const [isAddingShowtime, SetIsAddingShowtime] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState(null)

	const fetchTheater = async (data) => {
		try {
			setIsFetchingTheaterDone(false)
			let response
			if (auth.role === 'admin') {
				response = await axios.get(`/theater/unreleased/${theaterId}`, {
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				})
			} else {
				response = await axios.get(`/theater/${theaterId}`)
			}
			// console.log(response.data.data)
			setTheater(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingTheaterDone(true)
		}
	}

	useEffect(() => {
		fetchTheater()
	}, [theaterId])

	useEffect(() => {
		setValue('autoIncrease', true)
		setValue('rounding5', true)
		setValue('gap', '00:10')
	}, [])

	const onAddShowtime = async (data) => {
		try {
			SetIsAddingShowtime(true)
			if (!data.movie) {
				toast.error('Please select a movie', {
					position: 'top-center',
					autoClose: 2000,
					pauseOnHover: false
				})
				return
			}
			let showtime = new Date(selectedDate)
			const [hours, minutes] = data.showtime.split(':')
			showtime.setHours(hours, minutes, 0)
			const response = await axios.post(
				'/showtime',
				{ movie: data.movie, showtime, theater: theater._id, repeat: data.repeat, isRelease: data.isRelease },
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			// console.log(response.data)
			fetchTheater()
			if (data.autoIncrease) {
				const movieLength = movies.find((movie) => movie._id === data.movie).length
				const [GapHours, GapMinutes] = data.gap.split(':').map(Number)
				const nextShowtime = new Date(showtime.getTime() + (movieLength + GapHours * 60 + GapMinutes) * 60000)
				if (data.rounding5 || data.rounding10) {
					const totalMinutes = nextShowtime.getHours() * 60 + nextShowtime.getMinutes()
					const roundedMinutes = data.rounding5
						? Math.ceil(totalMinutes / 5) * 5
						: Math.ceil(totalMinutes / 10) * 10
					let roundedHours = Math.floor(roundedMinutes / 60)
					const remainderMinutes = roundedMinutes % 60
					if (roundedHours === 24) {
						nextShowtime.setDate(nextShowtime.getDate() + 1)
						roundedHours = 0
					}
					setValue(
						'showtime',
						`${String(roundedHours).padStart(2, '0')}:${String(remainderMinutes).padStart(2, '0')}`
					)
				} else {
					setValue(
						'showtime',
						`${String(nextShowtime.getHours()).padStart(2, '0')}:${String(
							nextShowtime.getMinutes()
						).padStart(2, '0')}`
					)
				}
				if (data.autoIncreaseDate) {
					setSelectedDate(nextShowtime)
					sessionStorage.setItem('selectedDate', nextShowtime)
				}
			}
			toast.success('Add showtime successful!', {
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
			SetIsAddingShowtime(false)
		}
	}

	function rowToNumber(column) {
		let result = 0
		for (let i = 0; i < column.length; i++) {
			const charCode = column.charCodeAt(i) - 64 // Convert character to ASCII and adjust to 1-based index
			result = result * 26 + charCode
		}
		return result
	}

	if (!isFetchingTheaterDone) {
		return <Loading />
	}

	return (
		<div className="flex flex-col">
			<div className="flex md:justify-between">
				<h3
					className={`flex w-fit items-center  bg-gradient-to-br from-pink-800 to-pink-800 px-6 py-0.5 text-2xl font-bold text-white  ${
						auth.role !== 'admin' && 'rounded-t-2xl'
					}`}
				>
					{theater.number}
				</h3>
				{auth.role === 'admin' && (
					<div className="flex w-fit flex-col gap-x-3  bg-gradient-to-br from-indigo-800 to-red-700 px-4 py-0.5 font-semibold text-white md:flex-row md:gap-x-6 ">
						<div className="flex items-center gap-2">
							<FaArrowsAltV className="h-5 w-5" />
							{theater?.seatPlan?.row === 'A' ? (
								<h4>Row : A</h4>
							) : (
								<h4>Row : A - {theater?.seatPlan?.row}</h4>
							)}
						</div>
						<div className="flex items-center gap-2">
							<FaArrowsAltH className="h-5 w-5" />
							{theater?.seatPlan?.column === 1 ? (
								<h4>Column : 1</h4>
							) : (
								<h4>Column : 1 - {theater?.seatPlan?.column}</h4>
							)}
						</div>
						<div className="flex items-center gap-2">
							<p>Capacity:</p>
							<MdEventSeat className="h-5 w-5" />
							{(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString('en-US')}{' '}
							Seats
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-4 rounded-b-md rounded-tr-md bg-gradient-to-br from-indigo-100 to-white py-4 md:rounded-tr-none">
				{auth.role === 'admin' && (
					<>
						<form
							className="mx-4 flex flex-col gap-x-4 gap-y-2 lg:flex-row"
							onSubmit={handleSubmit(onAddShowtime)}
						>
							<div className="flex grow flex-col gap-2 rounded-lg">
								<div className="flex flex-col gap-2 rounded-lg lg:flex-row lg:items-stretch">
									<div className="flex grow-[2] items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5">
											Movie:
										</label>
										<Select
											value={selectedMovie}
											options={movies?.map((movie) => ({
												value: movie._id,
												label: movie.name
											}))}
											onChange={(value) => {
												setValue('movie', value.value)
												setSelectedMovie(value)
											}}
											isSearchable={true}
											primaryColor="indigo"
											classNames={{
												menuButton: (value) =>
													'flex w-1/2 font-semibold text-xl border border-red-500 rounded shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400 focus:border-red-800 focus:ring focus:ring-red-500/20'
											}}
										/>
									</div>
									<div className="flex items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5">
											Showtime:
										</label>
										<input
											type="time"
											className="h-9 w-full bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm"
											required
											{...register('showtime', { required: true })}
										/>
									</div>
								</div>
								<div className="flex flex-col gap-2 rounded-lg lg:flex-row lg:items-stretch">
									<div className="flex items-center gap-x-2 gap-y-1 lg:flex-col lg:items-start">
										<label className="whitespace-nowrap text-lg font-semibold leading-5">
											Repeat (Day):
										</label>
										<input
											type="number"
											min={1}
											defaultValue={1}
											max={31}
											className="h-9 w-full bg-white px-2 py-1 font-semibold text-gray-900 drop-shadow-sm"
											required
											{...register('repeat', { required: true })}
										/>
									</div>
									<label className="flex items-center gap-x-2 gap-y-1 whitespace-nowrap text-lg font-semibold leading-5 lg:flex-col lg:items-start">
										Release now:
										<input
											type="checkbox"
											className="h-6 w-6 lg:h-9 lg:w-9"
											{...register('isRelease')}
										/>
									</label>
									
									
									
								</div>
							</div>
							<button
								title="Add showtime"
								disabled={isAddingShowtime}
								className="whitespace-nowrap  bg-gradient-to-r from-green-600 to-green-500 px-5 py-5 font-medium text-white drop-shadow-md hover:from-green-800 hover:to-green-800 disabled:from-slate-500 disabled:to-slate-400"
								type="submit"
							>
								<IoMdAddCircle className='h-12 w-12'/>
							</button>
						</form>
						{filterMovie?.name && (
							<div className="mx-4 flex gap-2  bg-gradient-to-r from-indigo-600 to-blue-500 p-2 text-white">
								<InformationCircleIcon className="h-6 w-6" />
								{`You are viewing the showtimes of "${filterMovie?.name}"`}
							</div>
						)}
					</>
				)}
				<Showtimes
					showtimes={theater.showtimes}
					movies={movies}
					selectedDate={selectedDate}
					filterMovie={filterMovie}
				/>
			</div>
		</div>
	)
}
export default Theater
