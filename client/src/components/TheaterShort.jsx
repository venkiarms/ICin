import { ArrowsRightLeftIcon, ArrowsUpDownIcon, UserIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import Loading from './Loading'
import Showtimes from './Showtimes'

const TheaterShort = ({ theaterId, movies, selectedDate, filterMovie, rounded = false }) => {
	const { auth } = useContext(AuthContext)
	const [theater, setTheater] = useState({})
	const [isFetchingTheaterDone, setIsFetchingTheaterDone] = useState(false)

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
		<div
			className={`flex flex-col bg-gradient-to-br from-yellow-100 to-white sm:flex-row sm:rounded-tr-none`}
		>
			<div className="flex flex-col sm:flex-row">
				<div
					className={`flex min-w-[500px] flex-row items-center justify-center gap-x-2 bg-gradient-to-br from-pink-500 to-pink-400 px-4 py-0.5 text-2xl font-bold text-white sm:flex-col `}
				>
					<p className="text-4xl">Screen {theater.number}</p>
					
				</div>
				{auth.role === 'admin' && (
					<div
					className={`flex w-full min-w-[500px] flex-row justify-between items-center border-b-2 border-indigo-200 bg-gradient-to-br from-indigo-400 to-indigo-300 px-4 py-0.5 text-lg font-bold sm:w-auto sm:flex-row sm:border-none`}
				  >
					<div className="flex items-center gap-2">
					  <ArrowsUpDownIcon className="h-5 w-5" />
					  {theater?.seatPlan?.row === 'A' ? (
						<h4>Row : A</h4>
					  ) : (
						<h4>Row : A - {theater?.seatPlan?.row}</h4>
					  )}
					</div>
					<div className="flex items-center gap-2">
					  <ArrowsRightLeftIcon className="h-5 w-5" />
					  {theater?.seatPlan?.column === 1 ? (
						<h4>Column : 1</h4>
					  ) : (
						<h4>Column : 1 - {theater?.seatPlan?.column}</h4>
					  )}
					</div>
					<div className="flex items-center gap-2">
					  <UserIcon className="h-5 w-5" />
					  {(rowToNumber(theater.seatPlan.row) * theater.seatPlan.column).toLocaleString('en-US')} Seats
					</div>
				  </div>
				  
				)}
			</div>
			<div className="mx-4 flex items-center">
				<Showtimes
					showtimes={theater.showtimes}
					movies={movies}
					selectedDate={selectedDate}
					filterMovie={filterMovie}
					showMovieDetail={false}
				/>
			</div>
		</div>
	)
}
export default TheaterShort
