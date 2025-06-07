"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
// import { Menu, Transition } from '@headlessui/react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/20/solid'

import { clsx } from "clsx"

interface DayFormat {
    date: {
        year: number,
        month: number,
        day: number,
    },
    isCurrentMonth: boolean,
    isSelected: boolean,
    isToday: boolean,
}

export default function CalendarMonth({
    calendarName,
    selectedYear,
    selectedMonth,
    hoverDate,
    setHoverDate,
    selectedDay,
    setSelectedDay,
    rentedDays,
    loading,
    setReserve,
    toggleMonth
}: {
    calendarName?: string,
    selectedDay: number,
    setSelectedDay: Dispatch<SetStateAction<number>>,
    hoverDate: number,
    setHoverDate: Dispatch<SetStateAction<number>>,
    selectedMonth: number,
    selectedYear: number,
    rentedDays: Array<number>,
    loading: boolean,
    setReserve: Dispatch<SetStateAction<boolean>>,
    toggleMonth: (val: 1 | -1) => void
}) {
    const today = new Date();
    const [days, setDays] = useState<Array<DayFormat>>([]);

    const updateCalendar = () => {
        let temp_day: Array<DayFormat> = [];
        const lastMonthEndedDay = new Date(selectedYear, selectedMonth - 1, 1).getDay();
        const daysInMonth = getDays(selectedYear, selectedMonth);
        let weeks = Math.ceil((daysInMonth + lastMonthEndedDay) / 7);

        for (let i = 0; i < weeks * 7; ++i) {
            let padding = 0;
            let day = i;
            if (i < lastMonthEndedDay) {
                padding = -1;
                day += getDays(selectedYear, selectedMonth - 1) - lastMonthEndedDay;
            } else if (i > lastMonthEndedDay + daysInMonth - 1) {
                padding = 1;
                day -= lastMonthEndedDay + daysInMonth;
            } else {
                day -= lastMonthEndedDay;
            }

            temp_day.push({
                date: {
                    year: selectedYear,
                    month: selectedMonth + padding,
                    day: day + 1,
                },
                // `${selectedYear}-${paddingZero(selectedMonth + padding)}-${paddingZero(day + 1)}`
                isCurrentMonth: padding === 0,
                isToday: (today.getDate() + (today.getMonth() + 1) * 100) === ((day + 1) + (selectedMonth + padding) * 100),
                isSelected: !padding && rentedDays.includes(day + 1),
            })
        }
        // console.log(temp_day)
        setDays(temp_day);
    }

    useEffect(() => {
        updateCalendar();
    }, [rentedDays, selectedMonth])

    return (
        <div className="select-none">
            {/* <h2 className="text-base font-semibold leading-6 text-gray-900">{calendarName}</h2> */}

            <div className="">
                <div className="mt-10 text-center lg:w-80 lg:mt-9 bg-slate-50 py-3 rounded-md px-3 dark:bg-slate-800">
                    <div className="flex items-center text-gray-900">
                        <button type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-50"
                            onClick={() => { toggleMonth(-1) }}
                        >
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="flex-auto text-sm font-semibold text-black dark:text-white">{MonthInEng(selectedMonth)}</div>
                        <button type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-50"
                            onClick={() => { toggleMonth(1) }}
                        >
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className={clsx('linear-activity', loading || 'invisible')}>
                        <div className="indeterminate"></div>
                    </div>
                    <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500 dark:text-gray-300">
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                    </div>
                    <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 dark:bg-gray-700 text-sm shadow ring-1 ring-gray-200 dark:ring-gray-700">
                        {days.map((day, dayIdx) => (
                            <button key={`${day.date.year}-${paddingZero(day.date.month)}-${paddingZero(day.date.day)}`}
                                type="button"
                                className={clsx(
                                    'py-1.5 focus:z-10',
                                    (day.date.day === selectedDay && day.date.month === selectedMonth) ? "bg-gray-300 dark:bg-slate-400" :
                                        (day.isCurrentMonth ? "hover:bg-gray-100 bg-white dark:bg-slate-600" : "bg-gray-50 hover:bg-gray-100 dark:bg-slate-800"),
                                    (day.isSelected || day.isToday) && 'font-semibold',
                                    day.isSelected && 'text-white',
                                    !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                                    !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                                    day.isToday && !day.isSelected && 'text-indigo-600',
                                    dayIdx === 0 && 'rounded-tl-lg',
                                    dayIdx === 6 && 'rounded-tr-lg',
                                    dayIdx === days.length - 7 && 'rounded-bl-lg',
                                    dayIdx === days.length - 1 && 'rounded-br-lg',
                                )}
                                onMouseEnter={() => { if (day.date.month === selectedMonth) { setHoverDate(day.date.day) } }}
                                onMouseLeave={() => { setHoverDate(NaN) }}
                                onClick={() => { if (day.date.month === selectedMonth) { setSelectedDay(day.date.day) } }}
                            >
                                <time dateTime={`${day.date.year}-${paddingZero(day.date.month)}-${paddingZero(day.date.day)}`}
                                    className={clsx(
                                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                        day.isSelected && day.isToday && 'bg-indigo-600',
                                        day.isSelected && !day.isToday && 'bg-orange-400'
                                    )}
                                >
                                    {day.date.day}
                                </time>
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="mt-8 w-full cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => { setReserve(true) }}
                    >
                        確定日期
                    </button>
                </div>

            </div>
        </div>
    )
}

function paddingZero(value: number) {
    return `000${value}`.slice(-2);
}

const getDays = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

const MonthInEng = (value: number) => {
    switch (value) {
        case 1:
            return "January";
        case 2:
            return "Febuary";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            return "Undefined"
    }
}

{/* <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
    {meetings.map((meeting) => (
        <li key={meeting.id} className="relative flex space-x-6 py-6 xl:static">
            <img src={meeting.imageUrl} alt="" className="h-14 w-14 flex-none rounded-full" />
            <div className="flex-auto">
                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">{meeting.name}</h3>
                <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                    <div className="flex items-start space-x-3">
                        <dt className="mt-0.5">
                            <span className="sr-only">Date</span>
                            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd>
                            <time dateTime={meeting.datetime}>
                                {meeting.date} at {meeting.time}
                            </time>
                        </dd>
                    </div>
                    <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                        <dt className="mt-0.5">
                            <span className="sr-only">Location</span>
                            <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </dt>
                        <dd>{meeting.location}</dd>
                    </div>
                </dl>
            </div>
            <Menu as="div" className="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center">
                <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={clsx(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={clsx(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    ))}
</ol> */}