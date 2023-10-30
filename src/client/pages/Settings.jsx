import React, {useState, useEffect, Fragment} from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import logout from '@wasp/auth/logout';
import { BuildingOffice2Icon, CalendarIcon } from '@heroicons/react/20/solid'
import BookingInfoModal from '../components/BookingInfoModal';
import getGroupsByUser from '@wasp/queries/getGroupsByUser';
import getBookingsByUser from '@wasp/queries/getBookingsByUser';
import getGroupInvites from '@wasp/queries/getGroupInvites'
import deleteBooking from '@wasp/actions/deleteBooking'
import acceptInvitation from '@wasp/actions/acceptInvitation'
import declineInvitation from '@wasp/actions/declineInvitation'
import createGroup from '@wasp/actions/createGroup'
import GroupModal from '../components/GroupModal';

import {format} from 'date-fns'
import Loader from '../components/Loader';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export function SettingsPage({user}) {
  const [bookingInfoOpen, setBookingInfoOpen] = useState(false)
  const [addFacilityOpen, setAddFacilityOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { data: facilityGroups, error, isLoading } = useQuery(getGroupsByUser)
  const { data: bookings, error: error2, isLoading: isLoading2} = useQuery(getBookingsByUser)
  const { data: invites, error: error3, isLoading: isLoading3} = useQuery(getGroupInvites)
  if (isLoading) return (<Loader />);
  if (isLoading2) return (<Loader />);
  if (isLoading3) return (<Loader />);
  if (error) return 'Error: ' + error;
  if (error2) return 'Error: ' + error2;
  if (error3) return 'Error: ' + error3;

  const deleteBookingFn = async (id) => {
    try {
      await deleteBooking({id})
      
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  const acceptInvitationFn = async (id) => {
    try {
      await acceptInvitation({id})
      
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  const declineInvitationFn = async (id) => {
    try {
      await declineInvitation({id})
      
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  const addGroup = async () => {
    try {
      setAddFacilityOpen(true)
      // createGroup({name: "Testnamnet"})
    } catch(err) {
      window.alert('Error: ' + err.message)
    }
  }

  function handleEventClick(booking) {
    const event = {
      description: booking.description,
      room: booking.room.name,
      userEmail: user.email,
      booking: booking
    }
    setSelectedEvent(event);
    setBookingInfoOpen(true);
  }

  return (
    <div className="sm:p-4 max-w-3xl m-auto">
      {addFacilityOpen && <GroupModal open={addFacilityOpen} setOpen={setAddFacilityOpen} createGroup={createGroup}/>}
      {bookingInfoOpen && <BookingInfoModal open={bookingInfoOpen} setOpen={setBookingInfoOpen} event={selectedEvent} user={user} deleteBookingFn={deleteBookingFn}/>}
      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        {/* GROUP INVITES */}
        {(invites.length > 0) && <div className="shadow-xl border border-3 border-pink-300 rounded-md p-6 -mx-6 -mt-10 mb-10">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">You have new invitations!</h2>

            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              {(invites.length > 0) && invites.map((invite, idx) => (
                
                  <li key={idx}  className="flex justify-between gap-x-6 py-6 " >
                    <div>
                      <div className="font-medium text-gray-900">{invite.group.name}</div>
                      <div className="font-medium text-gray-400">{`Invited by:  ${invite.createdBy.email}`}</div>
                    </div>
                    <div className="space-x-4">
                      <button 
                        onClick={() => {acceptInvitationFn(invite.id)}} 
                        type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                        Accept
                      </button>
                      <button 
                        onClick={() => {declineInvitationFn(invite.id)}} 
                        type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                        Decline
                      </button>
                    </div>
                  </li>))
                }
            </ul>
          </div>}
          
          {/* BOOKINGS */}
          <div>
            <h2 className="text-xl font-semibold leading-7 text-gray-900">Bookings</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">Your upcoming bookings</p>

            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              {(bookings.length >0) ? bookings.map((booking, idx) => (
              <li key={idx} className="flex justify-between gap-x-6 py-6">
                <div className="w-full font-medium text-gray-900 flex justify-start">
                  
                  <CalendarIcon className="hidden h-5 w-5 my-auto md:block mr-10 "/>
                  
                  <div className="mr-10 ">
                    <div>{booking.date}  </div>
                    <div>{`${format(booking.startTime, 'HH:mm')} - ${format(booking.endTime, 'HH:mm')}`}</div>
                  </div>
                  <div>
                    <div>{booking.room.name}</div>
                    <div className="text-gray-400">{booking.description}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleEventClick(booking)}
                  type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                  Details
                </button>
              </li>)) :  <li className="flex justify-between gap-x-6 py-6"> <div className="font-medium text-gray-900"> -- No bookings --</div> </li>}
            </ul>
          </div>
          
          {/* GROUPS */}
          <div className="mt-10 mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-xl font-semibold leading-7 text-gray-900">Facilities</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Your resource and room collections
              </p>

              <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                {(facilityGroups.length > 0) ? facilityGroups.map((membership, idx) => (
                  
                    <li key={idx}  className=" flex justify-between" >
                      <Link className="flex justify-start space-x-4 py-6 w-full" to={`/g/${membership.groupId}`}>
                        <div className="self-center">
                          <BuildingOffice2Icon className="h-5 w-5 " />
                        </div>
                        <div className="">
                            <div className="font-medium text-gray-900 ">{membership.group.name}</div>
                            <p className="text-gray-400">{membership.group.description}</p>
                            <p className="flex flex-wrap">
                              {membership.group.rooms.map((room, idx) =>(
                                <Fragment key={idx}>
                                  <span key={idx} className="ml-1 text-gray-400 ">{room.name}{idx < membership.group.rooms.length - 1 && ','}</span>
                                </Fragment>
                              ))}
                            </p>
                        </div>
                      </Link>
                      <Link to={`/g/${membership.groupId}/settings`} className="flex">
                        <button type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                          Settings
                        </button>
                      </Link>
                    </li>)) : <li className="flex justify-between gap-x-6 py-6"> <div className="font-medium text-gray-900"> -- No facilities --</div> </li>
                  }
              </ul>
              <div className="flex border-t border-gray-100 pt-6">
                <button 
                  onClick={()=>{addGroup()}}
                  type="button" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-500">
                  <span aria-hidden="true">+</span> Add Facility
                </button>
              </div>
            </div>

            

            
            {/* PERSONAL SETTINGS */}
            
            <div>
              <div className="w-full justify-center pt-10 mt-10 sm:flex">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md text-red-600 px-3 py-2 text-sm font-semibold border border-red-600 shadow-sm hover:text-white hover:bg-red-500 sm:w-auto"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
              <div className="w-full my-4 sm:text-center text-gray-400 ">Logged in as {user.email}</div>
            </div>
            {/* <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Language and dates</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Choose what language and date format to use throughout your account.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Language</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">English</div>
                    <button type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                      Update
                    </button>
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Date format</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">DD-MM-YYYY</div>
                    <button type="button" className="font-semibold text-secondary-600 hover:text-secondary-500">
                      Update
                    </button>
                  </dd>
                </div>
                <Switch.Group as="div" className="flex pt-6">
                  <Switch.Label as="dt" className="flex-none pr-6 font-medium text-gray-900 sm:w-64" passive>
                    Automatic timezone
                  </Switch.Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className={classNames(
                        automaticTimezoneEnabled ? 'bg-secondary-600' : 'bg-gray-200',
                        'flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          automaticTimezoneEnabled ? 'translate-x-3.5' : 'translate-x-0',
                          'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </dd>
                </Switch.Group>
              </dl>
            </div> */}
          </div>
        </main>
    </div>
  );
}