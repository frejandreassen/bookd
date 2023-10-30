import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function InviteMemberModal({ open, setOpen, groupId, createInvitation}) {
  const [inviteEmails, setInviteEmails] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedRole, setSelectedRole] = useState('MEMBER')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSave() {
    // Split the emails string by commas and remove whitespace.
    const emailsArray = inviteEmails.split(',').map(email => email.trim());

    // Validate each email.
    const invalidEmails = emailsArray.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      // If there are any invalid emails, set an error message with those emails.
      setErrorMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
      return; // Stop here and don't execute any further save logic.
    }

    await createInvitation({groupId, invitedEmails: emailsArray, role: selectedRole})
    // If all emails are valid, clear any existing error message.
    setErrorMessage('');
    setInviteEmails('');
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
                <header className="flex items-center text-gray-900 p-2 text-lg font-semibold">
                    Invite members
                </header>
                <main className="min-w-full bg-white sm:rounded-lg p-2">
                  <div className="relative my-4">
                    <textarea className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder='john@doe.com, jane@doe.com....'
                    value={inviteEmails}
                    onChange={e => {setInviteEmails(e.target.value); setErrorMessage('')}}/>
                    {<div className="w-full text-red-600 text-sm">{errorMessage}</div>}
                  </div>
                  
                  <Listbox value={selectedRole} onChange={setSelectedRole}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Role</Listbox.Label>
                        <div className="relative mt-2">
                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">{selectedRole}</span>
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
                              {["MEMBER", "ADMIN"].map((role) => (
                                <Listbox.Option
                                  key={role}
                                  className={({ active }) =>
                                    classNames(
                                      active ? 'bg-primary-600 text-white' : 'text-gray-900',
                                      'relative cursor-default select-none py-2 pl-3 pr-9'
                                    )
                                  }
                                  value={role}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'text-xs block truncate')}>
                                        {role}
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

                  
                </main>
                <div className="flex justify-center w-full p-2 mt-5">
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

export default InviteMemberModal;
