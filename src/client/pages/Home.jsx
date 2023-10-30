import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { format } from 'date-fns'
import getRoomsByUser from '@wasp/queries/getRoomsByUser';
import createBooking from '@wasp/actions/createBooking'
import Calendar from '../components/Calendar';
import deleteBooking from '@wasp/actions/deleteBooking';
import Loader from '../components/Loader';

export function HomePage({user}) {
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(format(new Date(),'yyyy-MM-dd'));
  const [selectedRoom, setSelectedRoom] = useState({})
  

  
  const { data: rooms, isLoading, error } = useQuery(getRoomsByUser, {date: selectedDate})
  // const { data: bookings, error: error2, isLoading: isLoading2 } = useQuery(getBookingsByGroup, {groupId: groupId, date: selectedDate})  
  
  if (isLoading) return (<Loader />);
  // if (isLoading2) return (<Loader />);
  // if (isLoadingMembership) return (<Loader />);
  if (error) return 'Error: ' + error;
  // if (error2) return 'Error: ' + error2;
  
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
  const bookings = []
  rooms.map(r => bookings.push(...r.bookings))
  rooms.sort((a,b) => a.id - b.id)
  rooms.sort((a,b) => a.groupId - b.groupId)
  if (rooms.length > 0) return (
    <div className="sm:p-4">
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
  if (rooms.length == 0) {
    history.push('/settings')
    return null
  }
}