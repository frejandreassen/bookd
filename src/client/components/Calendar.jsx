import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, Cog8ToothIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/20/solid'
import {format, parseISO, addDays, subDays } from 'date-fns'
import { sv } from 'date-fns/locale';
import DatePickerModal from './DatePickerModal'
import BookingModal from './BookingModal';
import BookingInfoModal from './BookingInfoModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AdminHeader = () => {
  return(<header className="flex flex-none items-center justify-end border-b border-gray-200 py-2 sm:py-4">
    <button className="flex items-center space-x-2 ">
      <span>Settings</span>
      <Cog8ToothIcon className="h-5 w-5" />
    </button>
    
  </header>)
}

export default function Calendar({user, rooms, bookings, selectedDate, setSelectedDate, selectedRoom, setSelectedRoom, createBookingFn, deleteBookingFn}) {
  if (rooms.length < 1) return (<div>'There are no rooms in this facility. Please add a room'</div>)
  useEffect(() => {
    setSelectedRoom(rooms[0])
  },[]);
  
  const container = useRef(null)
  const containerNav = useRef(null)
  const containerOffset = useRef(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingInfoOpen, setBookingInfoOpen] = useState(false)
  const [startHour, setStartHour] = useState((Math.max(Math.min(new Date().getHours(), 17), 6) + 1).toString().padStart(2,'0'))
  const [selectedEvent, setSelectedEvent] = useState(null);
 
  
  function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth;
  }

  const allColumns = rooms.map(room => room.name);
  const [currentStartColumn, setCurrentStartColumn] = useState(0);
  const windowWidth = useWindowWidth();

  let maxVisibleColumns;
  if (windowWidth <= 640) {  // Tailwind's "sm" breakpoint
      maxVisibleColumns = 1;
  } else if (windowWidth <= 768) {  // Tailwind's "md" breakpoint
      maxVisibleColumns = 3;
  } else if (windowWidth <= 1024) {  // Tailwind's "lg" breakpoint
      maxVisibleColumns = 4;
  } else {  // Larger than "lg"
      maxVisibleColumns = 6;
  }
  const columns = allColumns.slice(currentStartColumn, currentStartColumn + maxVisibleColumns);
  const showNavigationButtons = columns.length < allColumns.length;

  


  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60
    container.current.scrollTop = 0
      // ((container.current.scrollHeight - containerNav.current.offsetHeight - containerOffset.current.offsetHeight) *
      //   currentMinute) /
      // 1440
  }, [])
  

  function transformBookings(bookings, rooms) {
    return bookings.map(booking => {
        const startTime = new Date(booking.startTime).getHours() + new Date(booking.startTime).getMinutes() / 60;
        const endTime = new Date(booking.endTime).getHours() + new Date(booking.endTime).getMinutes() / 60;
        const duration = endTime - startTime;

        // Find the room description based on roomId from the booking
        const roomName = rooms.find(room => room.id === booking.roomId)?.name || 'Unknown Room';
        return {
            startTime,
            endTime,
            duration,
            description: booking.description,
            color: booking.color,
            room: roomName,
            userEmail: booking.user.email,
            booking
        };
    });
  }

  const allEvents = transformBookings(bookings, rooms);


  const events = allEvents.filter(event => columns.includes(event.room));

  
  const handlePreviousDay = () => {
    const parsedDate = parseISO(selectedDate);
    const previousDay = subDays(parsedDate, 1);
    setSelectedDate(format(previousDay, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const parsedDate = parseISO(selectedDate);
    const nextDay = addDays(parsedDate, 1);
    setSelectedDate(format(nextDay, 'yyyy-MM-dd'));
  };

  function getColStartFromRoom(roomName) {
    const position = columns.indexOf(roomName);
    return getColStart(position)
  }

  function getColStart(i) {
    switch (i) {
      case 0: return 'sm:col-start-1';
      case 1: return 'sm:col-start-2';
      case 2: return 'sm:col-start-3';
      case 3: return 'sm:col-start-4';
      case 4: return 'sm:col-start-5';
      case 5: return 'sm:col-start-6';
      case 6: return 'sm:col-start-7';
      default: return ''; // or return a default value or throw an error
  }
  }

  function getGridColsClass() {
    switch (columns.length) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-3';
        case 4: return 'grid-cols-4';
        case 5: return 'grid-cols-5';
        case 6: return 'grid-cols-6';
        case 7: return 'grid-cols-7';
        default: return ''; // or return a default value or throw an error
    }
  }
  function getEventColorClasses(color) {
    switch (color) {
        case 'red':
            return {
                bg: 'bg-red-200',
                hoverBg: 'hover:bg-red-100',
                text: 'text-red-700',
                hoverText: 'group-hover:text-red-700',
                secondaryText: 'text-red-500',
                border: 'border-red-300',
            };
        case 'blue':
            return {
                bg: 'bg-blue-200',
                hoverBg: 'hover:bg-blue-100',
                text: 'text-blue-700',
                hoverText: 'group-hover:text-blue-700',
                secondaryText: 'text-blue-500',
                border: 'border-blue-300',
            };
        case 'green':
            return {
                bg: 'bg-green-200',
                hoverBg: 'hover:bg-green-100',
                text: 'text-green-700',
                hoverText: 'group-hover:text-green-700',
                secondaryText: 'text-green-700',
                border: 'border-green-300',
            };
        case 'yellow':
            return {
                bg: 'bg-yellow-200',
                hoverBg: 'hover:bg-yellow-100',
                text: 'text-yellow-700',
                hoverText: 'group-hover:text-yellow-700',
                secondaryText: 'text-yellow-500',
                border: 'border-yellow-300',
            };
        case 'purple':
            return {
                bg: 'bg-purple-200',
                hoverBg: 'hover:bg-purple-100',
                text: 'text-purple-700',
                hoverText: 'group-hover:text-purple-700',
                secondaryText: 'text-purple-500',
                border: 'border-purple-300',
            };
        case 'pink':
            return {
                bg: 'bg-pink-200',
                hoverBg: 'hover:bg-pink-100',
                text: 'text-pink-700',
                hoverText: 'group-hover:text-pink-700',
                secondaryText: 'text-pink-500',
                border: 'border-pink-300',
            };
        case 'secondary':
            return {
                bg: 'bg-secondary-200',
                hoverBg: 'hover:bg-secondary-100',
                text: 'text-secondary-700',
                hoverText: 'group-hover:text-secondary-700',
                secondaryText: 'text-secondary-500',
                border: 'border-secondary-300',
            };
        default:
            return {};
        }
    }


  function formatTimeFromFloat(floatTime) {
    const hours = Math.floor(floatTime);
    const minutes = (floatTime - hours) * 60;
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(Math.round(minutes)).padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
  }



  const navigateLeft = () => {
    setCurrentStartColumn(Math.max(0, currentStartColumn - 1));
  };

  const navigateRight = () => {
      setCurrentStartColumn(Math.min(allColumns.length - maxVisibleColumns, currentStartColumn + 1));
  };

  function handleEventClick(clickedEvent) {
    setSelectedEvent(clickedEvent);
    setBookingInfoOpen(true);
  }


  function handleGridClick(event) {
    const grid = event.currentTarget;

    // Get dimensions and position of the grid
    const rect = grid.getBoundingClientRect();

    // Check if the clicked target is not the grid itself but an item inside the grid
    if (event.target !== grid) {
      // alert("I clicked an event");
      return; // Exit the function early
    }

    // Calculate relative click position in the grid
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Determine clicked column
    const colsClass = getGridColsClass();
    const totalCols = parseInt(colsClass.split("-")[2]); // Extracting the number from grid-cols-3 -> 3
    const colWidth = rect.width / totalCols;
    const col = Math.ceil(x / colWidth);
    setSelectedRoom(rooms[col - 1 + currentStartColumn])
    
    
    // Determine clicked row
    const totalRows = 57; // As given in your grid setup
    const rowHeight = rect.height / totalRows;
    const row = Math.ceil(y / rowHeight);
    const start = Math.round(row / 4 + 6) 
    setStartHour(start.toString().padStart(2,'0'))
    setBookingOpen(true)
    // alert(`You clicked position: Row ${row}, Column ${col}. startHour: ${start}`);
  }
  
  return (
    <div className="flex flex-col">
      <DatePickerModal open={datePickerOpen} setOpen={setDatePickerOpen} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {selectedEvent && <BookingInfoModal open={bookingInfoOpen} setOpen={setBookingInfoOpen} event={selectedEvent} user={user} deleteBookingFn={deleteBookingFn}/>}
      <BookingModal 
        open={bookingOpen} 
        setOpen={setBookingOpen} 
        selected={selectedRoom}
        setSelected={setSelectedRoom}
        selectedDate={selectedDate}
        startHour={startHour}
        setStartHour={setStartHour}
        rooms={rooms}
        createBookingFn={createBookingFn}
        />
      {/* <AdminHeader /> */}
      <header className="flex flex-none items-center justify-end border-b border-gray-200 py-2 sm:py-4">

        
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-10 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={handlePreviousDay}
            >
              <span className="sr-only">Previous day</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <h1 
              className="h-10 truncate text-base border-gray-300 border-y font-semibold leading-6 text-gray-900 hover:cursor-pointer hover:text-primary-500 hover:bg-gray-100 p-2 transition duration-300 ease-in-out transform hover:scale-105" 
              onClick={()=>setDatePickerOpen(true)}>
              <time dateTime="2022-01-01">{format(new Date(selectedDate), 'dd MMMM, yyyy', {locale: sv})}</time>
              {/* <ChevronDownIcon className="h-5 w-5 inline" aria-hidden="true" /> */}
            </h1>
            <button
              type="button"
              className="flex h-10 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={handleNextDay}
            >
              <span className="sr-only">Next day</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600"
              onClick={()=>setBookingOpen(true)}
            >
              Add event
            </button>
          </div>
          
            <button 
              type="button"
              className="md:hidden mx-2 flex items-center rounded-full border border-transparent text-gray-400 hover:text-gray-500"
              onClick={()=>setBookingOpen(true)}
            >
              <span className="sr-only">Add event</span>
              <PlusCircleIcon className="h-7 w-7" aria-hidden="true" />
            </button>
        </div>
      </header>
      <div ref={container} className="isolate flex flex-auto flex-col overflow-auto bg-white relative justify-center items-center">
     

        <div className={`w-full flex-none flex-col sm:max-w-none ${(columns.length <= 2) ? 'md:max-w-xl' : 'md:max-w-full'}`}>
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white border-b ring-opacity-5 sm:pr-8"
          >
            <div className={getGridColsClass() + ` -mr-px grid-cols-1 divide-x divide-gray-300 border-r border-gray-300 text-sm leading-6 text-gray-500 sm:grid`}>
                <div className="col-end-1 w-14" />
                {columns.map((column, i) => (
                    <div key={i} className={`flex items-center justify-center py-3 `}>
                        <span className="font-bold">{column}</span>
                    </div>
                ))}
                 {showNavigationButtons && (
                    <>
                        <button 
                            onClick={navigateLeft}
                            className={`bg-white absolute top-0 left-0 z-50 p-2 m-1 ml-5 sm:ml-10 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition ${currentStartColumn === 0 ? 'invisible opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            disabled={currentStartColumn === 0}
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>

                        <button 
                            onClick={navigateRight}
                            className={`bg-white absolute top-0 right-0 z-50 p-2 m-1 mr-5 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition ${currentStartColumn + maxVisibleColumns >= allColumns.length ? 'invisible opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            disabled={currentStartColumn + maxVisibleColumns >= allColumns.length}
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid "
                style={{ gridTemplateRows: 'repeat(28)' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7 "></div>
                
                {["7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((time, index) => (
                  <Fragment key={index}>
                    <div className="border-b border-gray-100 border-t border-t-gray-300">
                      <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-sm leading-5 text-gray-500">
                        {time}
                      </div>
                    </div>
                    <div className=""/>
                  </Fragment>
                ))}
                <div className=""/>
              </div>

              {/* Vertical lines */}
              <div className={getGridColsClass() + ` col-start-1 col-end-2 row-start-1 hidden grid-cols-1 grid-rows-1 divide-x divide-gray-300 sm:grid`}>
                {columns.map((col, i) => {
                  const colStart = getColStart(i)
                  return (
                  <div key={i} className={`${colStart} row-span-full`}/>
                )})}
                <div className={getColStart(columns.length + 1) + ` row-span-full w-8`} />
              </div>

              {/* Events */}
              <ol
                className={getGridColsClass() + ` hover:cursor-pointer col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:pr-8`}
                style={{ gridTemplateRows: 'repeat(57, minmax(18px, 1fr))' }}
                onClick={handleGridClick}
              >
                {events.map((event, index) => {
                  const colStart = getColStartFromRoom(event.room);
                  const color = (user.email == event.userEmail) ? 'green' : 'secondary'
                  const colorClasses = getEventColorClasses(color);
                  return (
                      <li
                          key={index}
                          className={`hover:cursor-pointer relative flex ${colStart}`}
                          style={{
                              gridRow: `${(event.startTime - 6) * 4} / span ${event.duration * 4}`,
                          }}
                      >
                          <button
                              onClick={() => handleEventClick(event)}
                              className={`group absolute -ml-1 h-full text-left w-9/10 shadow-lg border inset-1 flex flex-col overflow-y-auto rounded-lg border-b  ${colorClasses.bg} p-1 text-xs leading-5 ${colorClasses.hoverBg}`}
                          >
                              <p className={`order-1 -my-1 font-semibold ${colorClasses.text}`}>
                                  {event.description}
                              </p>
                              <p className={`${colorClasses.secondaryText} ${colorClasses.hoverText} -my-1 font-semibold`}>
                                  <time dateTime={`${selectedDate}T${formatTimeFromFloat(event.startTime)}`}>
                                    {formatTimeFromFloat(event.startTime)}
                                  </time>
                                  -
                                  <time dateTime={`${selectedDate}T${formatTimeFromFloat(event.endTime)}`}>
                                    {formatTimeFromFloat(event.endTime)}
                                  </time>
                              </p>
                              <div className={`${colorClasses.secondaryText} ${colorClasses.hoverText} truncate`}>{event.userEmail}</div>
                          </button>
                      </li>
                    )
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
