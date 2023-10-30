import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays, addDays, addMonths, subMonths } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid'

function adjustedGetDay(endOfThisMonth) {
  const day = getDay(endOfThisMonth);
  return (day + 6) % 7;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function DatePickerModal({ open, setOpen, selectedDate, setSelectedDate}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  

  useEffect(() => {
    
    const startOfThisMonth = startOfMonth(currentDate);
    const endOfThisMonth = endOfMonth(currentDate);
    
    let startWeekday = getDay(startOfThisMonth) === 0 ? 6 : getDay(startOfThisMonth) - 1;
    let startDate = subDays(startOfThisMonth, startWeekday);
    
    let endDate = addDays(endOfThisMonth, 6 - adjustedGetDay(endOfThisMonth));
    let dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    const formattedDays = dateRange.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const isHistory = formattedDate < format(new Date(), 'yyyy-MM-dd')
      return {
        date: formattedDate,
        isToday: formattedDate === format(new Date(), 'yyyy-MM-dd'),
        isHistory,
        isCurrentMonth: format(date, 'MM-yyyy') === format(currentDate, 'MM-yyyy'),
        isSelected: formattedDate === selectedDate,
      }
    });
    
    setDays(formattedDays);
  }, [currentDate, selectedDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center mt-10 justify-center p-4 text-center sm:items-center sm:p-0 sm:mt-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-xs relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-2">
                <div>
                  <header className="flex items-center text-gray-900 my-4">
                    <button
                      onClick={handlePreviousMonth}
                      type="button"
                      className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Previous month</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="flex-auto text-sm text-center font-semibold">{capitalizeFirstLetter(format(currentDate, 'MMMM yyyy',  {locale: sv}))}</div>
                    <button
                      onClick={handleNextMonth}
                      type="button"
                      className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Next month</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </header>
                  <div className="mt-6 grid grid-cols-7 text-xs text-center leading-6 text-gray-500">
                    <div>M</div>
                    <div>T</div>
                    <div>O</div>
                    <div>T</div>
                    <div>F</div>
                    <div>L</div>
                    <div>S</div>
                  </div>
                  <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                    {days.map((day, dayIdx) => (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => handleDateClick(day.date)} 
                        className={classNames(
                          'py-1.5 hover:bg-gray-100 focus:z-10',
                          // day.isHistory && 'bg-purple-100',
                          day.isCurrentMonth ? 'bg-white' : 'bg-gray-100',
                          (day.isToday) && 'font-bold',
                          day.isSelected && 'text-white font-semibold',
                          day.isCurrentMonth && 'text-gray-900',
                          !day.isCurrentMonth && 'text-gray-400',
                          day.isToday && !day.isSelected && 'font-bold',
                          
                          dayIdx === 0 && 'rounded-tl-lg',
                          dayIdx === 6 && 'rounded-tr-lg',
                          dayIdx === days.length - 7 && 'rounded-bl-lg',
                          dayIdx === days.length - 1 && 'rounded-br-lg'
                        )}
                      >
                        <time
                          dateTime={day.date}
                          className={classNames(
                            'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                            day.isSelected && 'bg-slate-600',
                          )}
                        >
                          {day.date.split('-').pop().replace(/^0/, '')}
                        </time>
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default DatePickerModal;
