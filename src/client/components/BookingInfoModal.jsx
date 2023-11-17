import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { format, parseISO } from 'date-fns';

function BookingInfoModal({ open, setOpen, event, user, deleteBookingFn}) {

  const formattedStartTime = format(event.booking.startTime, 'HH:mm');
  const formattedEndTime = format(event.booking.endTime, 'HH:mm');
  
  function handleClick() {
    deleteBookingFn(event.booking.id)
    setOpen(false)
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
              <Dialog.Panel className="z-20 w-full max-w-xs relative transform rounded-lg bg-white p-2 sm:px-4 sm:pb-4 sm:pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-2">
                <div>
                  {/* <header className="flex items-center text-gray-900 my-4"> */}
                    <div className="border-b border-gray-200 bg-white px-4 py-5">
                      <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                        <div className="ml-4 mt-2">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">Booking Details</h3>
                        </div>
                        <div className="ml-4 mt-2 flex-shrink-0">
                          {(user.email == event.userEmail) && <button
                            type="button"
                            onClick={handleClick}
                            className="relative inline-flex items-center rounded-md bg-secondary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Delete
                          </button>}
                        </div>
                      </div>
                    </div>
                  {/* </header> */}
                  
                  <main className="min-w-full bg-white overflow-hidden sm:rounded-lg p-2">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">Room</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{event.room}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">Date</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{event.booking.date}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">Time</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{formattedStartTime}{' - '} {formattedEndTime}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">Booked By</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{event.userEmail}</td>
                            </tr>
                            <tr>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">Description</td>
                                <td className="px-2 py-2 sm:px-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">{event.description}</td>
                            </tr>
                        </tbody>
                    </table>
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

export default BookingInfoModal;
