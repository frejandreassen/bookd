import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@wasp/queries';
import { format } from 'date-fns'
import getRoomsByGroup from '@wasp/queries/getRoomsByGroup';
import getMembership from '@wasp/queries/getMembership';
import createBooking from '@wasp/actions/createBooking'
import Calendar from '../components/Calendar';
import getBookingsByGroup from '@wasp/queries/getBookingsByGroup';
import deleteBooking from '@wasp/actions/deleteBooking';
import Loader from '../components/Loader';
import Page404 from './404';

export function GroupPage({user, match}) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(),'yyyy-MM-dd'));
  const [selectedRoom, setSelectedRoom] = useState({})
  const groupId = parseInt(match.params.groupId)

  const { data: membership, isLoading: isLoadingMembership, error: errorMembership} = useQuery(getMembership, {groupId})
  const { data: rooms, isLoading, error } = useQuery(getRoomsByGroup, {groupId: groupId , date: selectedDate})
  const { data: bookings, error: error2, isLoading: isLoading2 } = useQuery(getBookingsByGroup, {groupId: groupId, date: selectedDate})  
  
  if (isLoading) return (<Loader />);
  if (isLoading2) return (<Loader />);
  if (isLoadingMembership) return (<Loader />);
  if (error) return 'Error: ' + error;
  if (error2) return 'Error: ' + error2;
  
  const createBookingFn = async (startTime, endTime, bookingTitle, recurring, endAfter) => {
    try {
      const date = selectedDate
      const description = bookingTitle
      const roomId = selectedRoom.id
      await createBooking({date, startTime, endTime, description, roomId, recurring, endAfter})
      return
    } catch (err) {
      // window.alert('Error: ' + err.message)
      return JSON.parse(err.message)
    }
  }

  const deleteBookingFn = async (id) => {
    try {
      await deleteBooking({id})
      
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }
  rooms.sort((a,b) => a.id - b.id)
  if (membership.length > 0) return (
    <div className="sm:p-4">
      <Link to={`/g/${groupId}/settings`} className="space-x-1 flex items-center text-sm text-gray-500">
        {/* <ArrowLeftIcon className="h-5 w-5"/> */}
        <Cog6ToothIcon className="h5 w-5" />
        {/* <span>Settings</span> */}
      </Link>
      <Calendar 
        user={user}
        rooms={rooms} 
        bookings={bookings}
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        createBookingFn={createBookingFn}
        deleteBookingFn={deleteBookingFn}
      />
    </div>
  );
  if (membership.length == 0) return (
    <Page404 />
  )
}