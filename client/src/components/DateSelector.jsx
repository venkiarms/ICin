import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
import { RxReset } from "react-icons/rx";

import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

const DateSelector = ({ selectedDate, setSelectedDate }) => {
	const { auth } = useContext(AuthContext)
	const wrapperRef = useRef(null)
	const [isEditing, SetIsEditing] = useState(false)

	const handlePrevDay = () => {
		const prevDay = new Date(selectedDate)
		prevDay.setDate(prevDay.getDate() - 1)
		setSelectedDate(prevDay)
		sessionStorage.setItem('selectedDate', prevDay)
	}
	const isEditableDate = (date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Reset hours to start of the day
		return date > today;
	  }

	const handleNextDay = () => {
		const nextDay = new Date(selectedDate)
		nextDay.setDate(nextDay.getDate() + 1)
		setSelectedDate(nextDay)
		sessionStorage.setItem('selectedDate', nextDay)
	}

	const handleToday = () => {
		const today = new Date()
		setSelectedDate(today)
		sessionStorage.setItem('selectedDate', today)
	}

	const formatDate = (date) => {
		const weekday = date.toLocaleString('default', { weekday: 'long' })
		const day = date.getDate()
		const month = date.toLocaleString('default', { month: 'long' })
		const year = date.getFullYear()
		return `${weekday} ${day} ${month} ${year}`
	}

	const DateShort = ({ date, selectedDate }) => {
		const day = date.getDate()
		const weekday = date.toLocaleString('default', { weekday: 'short' })

		const isThisDate =
			selectedDate.getDate() === date.getDate() &&
			selectedDate.getMonth() === date.getMonth() &&
			selectedDate.getFullYear() === date.getFullYear()

		const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

		return (
			<button
				title={formatDate(date)}
				className={`flex  min-w-[48px] flex-col items-center justify-center rounded p-1 font-semibold ${
					isThisDate
						? 'bg-gradient-to-br from-orange-800 to-black-700 text-white'
						: isToday
						? 'bg-gradient-to-br from-blue-100 to-white ring-2 ring-inset ring-red-800 hover:from-white hover:to-white'
						: isPast(date)
						? 'bg-gradient-to-br from-gray-600 to-gray-500 text-white hover:from-gray-500 hover:to-gray-400'
						: 'bg-gradient-to-br from-indigo-100 to-white hover:from-white hover:to-white'
				}`}
				onClick={() => {
					setSelectedDate(date)
					sessionStorage.setItem('selectedDate', date)
				}}
			>
				<p className="text-l">{weekday}</p>
				<p className="text-l"> S{day}</p>
			</button>
		)
	}

	const isPast = (date) => {
		return new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
	}

	const handleChange = (event) => {
		setSelectedDate(new Date(event.target.value+ 'T00:00')); // Create a date with the local timezone
		setSelectedDate(localDate);
		sessionStorage.setItem('selectedDate', localDate.toISOString());
	  }

	function generateDateRange(startDate, endDate) {
		const dates = []
		const currentDate = new Date(startDate)

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate.getTime()))
			currentDate.setDate(currentDate.getDate() + 1)
		}

		return dates
	}

	function getPastAndNextDateRange() {
		const today = new Date()
		const pastDays = new Date(today)
		if (auth.role === 'admin') {
			pastDays.setDate(today.getDate() - 7)
		}

		const nextDays = new Date(today)
		nextDays.setDate(today.getDate() + 14)

		return generateDateRange(pastDays, nextDays)
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, false)
		return () => {
			document.removeEventListener('click', handleClickOutside, false)
		}
	}, [])

	const handleClickOutside = (event) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			SetIsEditing(false)
		}
	}

	return (
		<div className="flex items-center justify-center gap-2">
			<div className="relative flex justify-between gap-2  bg-gradient-to-br from-red-600 to-indigo-700 p-8 font-bold text-white">
				{auth.role === 'admin' || isEditableDate(selectedDate) ? (
					<button
						title="Go to yesterday"
						className={' hover:bg-gradient-to-br hover:from-red-600 hover:to-red-600'}
						onClick={handlePrevDay}
					>
						<VscArrowLeft className="h-10 w-10 text-white" />
					</button>
				) : (
					<div className="h-10 w-10"></div>
				)}
			
				{ (
					<div className="w-full" ref={wrapperRef}>
						<input
							title="Select date"
							type="Date"
							min={auth.role !== 'admin' && new Date().toLocaleDateString('en-CA')}
							required
							autoFocus
							className={`w-full rounded border border-white bg-gradient-to-br from-grey-800 to-yellow-700 px-5 text-center text-2xl font-semibold drop-shadow-sm sm:text-3xl`}
							value={selectedDate.toLocaleDateString('en-CA')}
							onChange={handleChange}
							style={{ colorScheme: 'dark' }}
						/>
					</div>
				) }

				<div className="flex items-center justify-between gap-2">
					<button
						title="Go to tomorrow"
						className=" hover:bg-gradient-to-br hover:from-red-600 hover:to-red-600"
						onClick={handleNextDay}
					>
						<VscArrowRight className="h-10 w-10 text-white" />
					</button>
					<button
						title="Go to today"
						className=" px-1 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-600"
						onClick={handleToday}
					>
						<RxReset className="h-10 w-10 text-white" />
					</button>
				</div>
			</div>
			
		</div>
	)
}

export default DateSelector
