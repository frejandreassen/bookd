import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Disclosure, Switch } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import {format } from 'date-fns'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
const hours = ["07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"]
const minutes = ["00", "15", "30", "45"]
const repeatOptions = ["never", "daily", "weekly", "biweekly", "monthly"]
const endAfterOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function BookingModal({ open, setOpen, selected, setSelected, selectedDate, rooms, startHour, setStartHour, createBookingFn}) {
  const [startMinute, setStartMinute] = useState("00")
  const [endHour, setEndHour] = useState((new Date().getHours() + 1).toString()) 
  const [endMinute, setEndMinute] = useState("00")
  const [duration, setDuration] = useState(1)
  const [validEndTime, setValidEndTime] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [bookingTitle, setBookingTitle] = useState('')
  const [recurring, setRecurring] = useState("never")
  const [endAfter, setEndAfter] = useState(1)

  useEffect(() => {
    if (!open) {
      setRecurring("never");
      setEndAfter(1)
    } else {
    }
  }, [open]);

  useEffect(() => {
    if (endHour < startHour) {
      setValidEndTime(false) 
      setErrorMessage('Invalid time')
    }
    else if (endHour <= startHour && endMinute < startMinute) {
      setErrorMessage('Invalid time')
      setValidEndTime(false)
    }
    else {
      setDuration((endHour - startHour).toString().padStart(2,'0'))
      setValidEndTime(true)
    }


  }, [endHour, endMinute, selected])

  useEffect(() => {
    setEndHour((parseInt(startHour) + parseInt(duration)).toString().padStart(2,'0'))
  }, [startHour])



  async function handleClick() {
    const end = new Date(selectedDate)
    end.setHours(parseInt(endHour))
    end.setMinutes(parseInt(endMinute))
    end.setSeconds(0)
    end.setMilliseconds(0)
    
    const start = new Date(selectedDate)
    start.setHours(parseInt(startHour))
    start.setMinutes(parseInt(startMinute))
    start.setSeconds(0)
    start.setMilliseconds(0)

    
    if (end <= start) {
      setErrorMessage('Invalid booking time')
      setValidEndTime(false)
      return
    }
    const result = await createBookingFn(start, end, bookingTitle, recurring, endAfter)

    if (result) { 
      if (result.error === 'BookingCollisionError') {
        setErrorMessage(JSON.stringify(result));
      } else {
        // Handle other types of errors
        console.error('An unexpected error occurred', error);
      }
      setValidEndTime(false)
      return
    }
    
    setDuration(1) // Reset to default
    setBookingTitle('')
    setOpen(false)
  }

  function ErrorComponent({errorMessage}){
    try{
      const errorObject = JSON.parse(errorMessage)
      return (
        <div className="mt-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{errorObject.message}</strong>
          <ul className="list-disc pl-5 mt-2">
            {errorObject.collisions.map((c, index) => (
              <li key={index}>{c.date} from {format(new Date(c.startTime),'HH:mm')} to {format(new Date(c.endTime),'HH:mm')}</li>
            ))}
          </ul>
        </div>
      )
    } catch(err) {
      return (
        <div className="w-full text-sm text-center">{errorMessage}</div>
      )
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-400"
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
              <Dialog.Panel className="z-20 w-full max-w-xs relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-2">
                <div>
                  <header className="flex items-center text-gray-900 my-4">
                    
                  </header>
                  <main className="p-2">
                  <div className="relative my-4">
                    <input className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder='Title'
                    value={bookingTitle}
                    onChange={e => setBookingTitle(e.target.value)}/>
                  </div>
                  {/* ROOM Listbox */}
                  <Listbox value={selected} onChange={setSelected}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selected.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {rooms.map((room) => (
                                <Listbox.Option
                                  key={room.id}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pl-3 pr-9'
                                    )
                                  }
                                  value={room}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                        {room.name}
                                      </span>

                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active ? 'text-white' : 'text-primary-600',
                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                          )}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>

                  {/* Start time */}
                  <div className="grid grid-cols-2 ">
                    <div className="block text-sm font-medium leading-6 text-gray-900 mt-4">Start time</div>
                    <div className="col-start-1">
                      <Listbox className="" value={startHour} onChange={setStartHour}>
                        {({ open }) => (
                          <>
                            {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                            <div className="relative mt-2">
                              <Listbox.Button className="text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">{startHour}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {hours.map((hour) => (
                                    <Listbox.Option
                                      key={hour}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={hour}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                            {hour}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active ? 'text-white' : 'text-primary-600',
                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                              )}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                      </div>

                      <div className="col-start-2">
                      <Listbox className="" value={startMinute} onChange={setStartMinute}>
                        {({ open }) => (
                          <>
                            {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                            <div className="relative mt-2">
                              <Listbox.Button className="text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">{startMinute}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {minutes.map((minute) => (
                                    <Listbox.Option
                                      key={minute}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={minute}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                            {minute}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active ? 'text-white' : 'text-primary-600',
                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                              )}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>

                  {/* End time */}
                  <div className="grid grid-cols-2 ">
                    <div className="block text-sm font-medium leading-6 text-gray-900 mt-4">End time</div>
                    <div className="col-start-1">
                      <Listbox className="" value={endHour} onChange={setEndHour}>
                        {({ open }) => (
                          <>
                            {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                            <div className="relative mt-2">
                              <Listbox.Button className={() =>
                                        classNames(
                                          validEndTime ? ' ' : 'line-through text-red-600',
                                          'text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6'
                                        )
                                      }
                              >
                                <span className="block truncate">{endHour}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {hours.map((hour) => (
                                    <Listbox.Option
                                      key={hour}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={hour}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                            {hour}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active ? 'text-white' : 'text-primary-600',
                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                              )}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                      </div>

                      <div className="col-start-2">
                      <Listbox className="" value={endMinute} onChange={setEndMinute}>
                        {({ open }) => (
                          <>
                            {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                            <div className="relative mt-2">
                            <Listbox.Button className={() =>
                                        classNames(
                                          validEndTime ? ' ' : 'line-through text-red-600',
                                          'text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6'
                                        )
                                      }
                              >
                                <span className="block truncate">{endMinute}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {minutes.map((minute) => (
                                    <Listbox.Option
                                      key={minute}
                                      className={({ active }) =>
                                        classNames(
                                          active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                          'relative cursor-default select-none py-2 pl-3 pr-9'
                                        )
                                      }
                                      value={minute}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                            {minute}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active ? 'text-white' : 'text-primary-600',
                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                              )}
                                            >
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>
                  {(!validEndTime) && <ErrorComponent errorMessage={errorMessage}/>}

                  
                  <Disclosure as="div" className="pt-6" >
                    {({ open }) => (
                      <>
                        <dt>
                          <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                            <span className="text-base font-semibold leading-7">Advanced settings</span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                              ) : (
                                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2">
                          <div className="flex justify-between">
                            <span className="relative mt-2">Repeat</span>
                            <Listbox className="" value={recurring} onChange={setRecurring}>
                              {({ open }) => (
                                <>
                                  {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                                  <div className="relative mt-2 w-1/2">
                                  <Listbox.Button className={() =>
                                              classNames(
                                                'text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6'
                                              )
                                            }
                                    >
                                      <span className="block truncate">{recurring}</span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {repeatOptions.map((option) => (
                                          <Listbox.Option
                                            key={option}
                                            className={({ active }) =>
                                              classNames(
                                                active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                              )
                                            }
                                            value={option}
                                          >
                                            {({ selected, active }) => (
                                              <>
                                                <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                                  {option}
                                                </span>

                                                {selected ? (
                                                  <span
                                                    className={classNames(
                                                      active ? 'text-white' : 'text-primary-600',
                                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                  >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                          {(recurring !="never") && <div className="flex justify-between">
                            <span className="relative mt-2">End After</span>
                            <Listbox className="" value={endAfter} onChange={setEndAfter}>
                              {({ open }) => (
                                <>
                                  {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Room</Listbox.Label> */}
                                  <div className="relative mt-2 w-1/2">
                                  <Listbox.Button className={() =>
                                              classNames(
                                                'text-center relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6'
                                              )
                                            }
                                    >
                                      <span className="block truncate">{endAfter}{' times'}</span>
                                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {endAfterOptions.map((option) => (
                                          <Listbox.Option
                                            key={option}
                                            className={({ active }) =>
                                              classNames(
                                                active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                              )
                                            }
                                            value={option}
                                          >
                                            {({ selected, active }) => (
                                              <>
                                                <span className={classNames(active ? 'font-semibold' : 'font-normal', 'block truncate text-center')}>
                                                  {option}
                                                </span>

                                                {selected ? (
                                                  <span
                                                    className={classNames(
                                                      active ? 'text-white' : 'text-primary-600',
                                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                                    )}
                                                  >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                  </span>
                                                ) : null}
                                              </>
                                            )}
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  <div className="flex justify-center mt-8">
                    <button
                      type="button"
                      onClick={handleClick}
                      className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Save
                    </button>
                  </div>
                  </main>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default BookingModal;
