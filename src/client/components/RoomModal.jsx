
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { format, parseISO } from 'date-fns';

function RoomModal({ open, setOpen, groupId, room, createRoom, updateRoom}) {
  const [roomDescription, setRoomDescription] = useState('')
  const [roomName, setRoomName] = useState('')
  
  useEffect( () => {
    if (room) {
      setRoomDescription(room.description)
      setRoomName(room.name)
    } else {
      setRoomDescription('')
      setRoomName('')
    }
  }, [room])


  async function handleSave() {
    if (room) {
      console.log("UPDATE")
      await updateRoom({roomId: room.id, name: roomName, description: roomDescription})
    } 
    else {
      console.log("CREATE")
      await createRoom({name: roomName, description: roomDescription, groupId: groupId})
    }
    setOpen(false)
    setRoomDescription('')
    setRoomName('')
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
                <header className="flex items-center text-gray-900 p-2 text-lg font-semibold">
                    {(room) ? <div className="flex justify-between w-full">
                                <div>Update Resource</div>
                              </div> 
                              :<span>Add new Resource</span>}
                </header>
                <main className="min-w-full bg-white overflow-hidden sm:rounded-lg p-2">
                <div className="relative my-4">
                  <input className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder='Room name...'
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}/>
                </div>
                <div className="relative my-4">
                  <textarea className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder='Description...'
                  value={roomDescription}
                  onChange={e => setRoomDescription(e.target.value)}/>
                </div>
                </main>
                <div className="flex justify-center w-full p-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Save
                  </button>
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

export default RoomModal;
