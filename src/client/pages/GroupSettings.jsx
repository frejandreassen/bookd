import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  EnvelopeOpenIcon,
  StarIcon,
  UserGroupIcon,
  UserCircleIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Loader from '../components/Loader';
import { useQuery } from '@wasp/queries';
import getGroup from '@wasp/queries/getGroup';
import getMembership from '@wasp/queries/getMembership';
import getGroupInvitesByGroup from '@wasp/queries/getGroupInvitesByGroup';
import deleteGroup from '@wasp/actions/deleteGroup';
import updateGroup from '@wasp/actions/updateGroup';
import updateRoom from '@wasp/actions/updateRoom';
import createRoom from '@wasp/actions/createRoom';
import deleteRoom from '@wasp/actions/deleteRoom';
import updateGroupMembership from '@wasp/actions/updateGroupMembership';
import deleteGroupMembership from '@wasp/actions/deleteGroupMembership';
import createInvitation from '@wasp/actions/createInvitation';
import deleteInvitation from '@wasp/actions/deleteInvitation';
import RoomModal from '../components/RoomModal';
import DeleteModal from '../components/DeleteModal';
import InviteMemberModal from '../components/InviteMemberModal'
import Page404 from './404';
import GroupModal from '../components/GroupModal';
import UpdateMembershipModal from '../components/UpdateMembershipModal';

export function GroupSettingsPage({user, match}){
  const [edit, setEdit] = useState(false)
  const [editMembers, setEditMembers] = useState(false)
  
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedMembership, setSelectedMembership] = useState(null)  
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [groupModalOpen, setGroupModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteGroupModalOpen, setDeleteGorupModalOpen] = useState(false)
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false)
  const [updateMembershipModalOpen, setUpdateMembershipModalOpen] = useState(false)

  const groupId = parseInt(match.params.groupId)
  const { data: group, isLoading, error} = useQuery(getGroup, {groupId})
  const { data: membership, isLoading: isLoadingMembership, error: errorMembership} = useQuery(getMembership, {groupId})
  const { data: invites, isLoading: isLoadingInvite, error: errorInvite } = useQuery(getGroupInvitesByGroup, {groupId})

  if (isLoading) return (<Loader />);
  if (isLoadingMembership) return (<Loader />);
  if (isLoadingInvite) return (<Loader />)
  if (error) return 'Error: ' + error;
  if (errorMembership) return 'Error: ' + errorMembership;
  if (errorInvite) return 'Error: ' +  errorInvite

  if (group && group.rooms) {
    group.rooms.sort((a, b) => a.id - b.id);
  }
  
  let isAdmin = false
  if (membership[0]) isAdmin = (membership[0].role === 'ADMIN')

  function handleUpdateGroupClick() {
    setGroupModalOpen(true)
  }
  
  function handleDeleteGroupClick() {
    setDeleteGorupModalOpen(true)
    
  }

  function handleEventClick(room) {
    setSelectedRoom(room)
    setRoomModalOpen(true);
  }

  function handleDeleteClick(room) {
    setSelectedRoom(room)
    setDeleteModalOpen(true)
  }

  function handleAddResource() {
    setSelectedRoom(null)
    setRoomModalOpen(true)
  }

  async function handleDeleteMemberClick(member) {
    await deleteGroupMembership(member)
  }

  function handleUpdateMemberClick(member) {
    setSelectedMembership(member);
    setUpdateMembershipModalOpen(true);
  }

  function handleInviteMemberClick() {
    setInviteMemberModalOpen(true)
  }

  function handleRemoveInvitationClick(inviteId) {
    deleteInvitation({inviteId})
  }

  async function handleLeaveClick(){
    await deleteGroupMembership({groupId: groupId, userId: user.id})
  }

  if (membership.length == 0) return (
    <Page404 />
  )
  if (group) return (
    <div className="sm:p-4 max-w-3xl m-auto">
      <GroupModal open={groupModalOpen} setOpen={setGroupModalOpen} group={group} updateGroup={updateGroup} />
      <DeleteModal open={deleteGroupModalOpen} setOpen={setDeleteGorupModalOpen} 
        deleteFn={deleteGroup} 
        deleteObject={group}
        title={'Delete Facility'}
        text={'You are about to delete this facility. All rooms, bookings and memberships associated with the resource will be permanently removed from our servers forever. This action cannot be undone.'}
        />
      <RoomModal open={roomModalOpen} setOpen={setRoomModalOpen} groupId={groupId} room={selectedRoom} updateRoom={updateRoom} createRoom={createRoom}/>
      <DeleteModal open={deleteModalOpen} setOpen={setDeleteModalOpen} deleteFn={deleteRoom} 
        deleteObject={selectedRoom}
        title={'Delete Room'}
        text={'You are about to delete this resource. All bookings associated with the resource will be permanently removed from our servers forever. This action cannot be undone.'}
      />
      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0 lg:pb-20">
        <div>
          <div className="flex justify-between mb-10 text-gray-500">
            <Link to={`/settings`} className="space-x-1 flex items-center">
              <ArrowLeftIcon className="h-5 w-5"/>
            </Link>
            <Link to={`/g/${groupId}`} className="space-x-1 flex items-center">
              <CalendarIcon className="h-5 w-5"/>
              <span>Calendar</span>
              <ArrowRightIcon className="h-5 w-5"/>
            </Link>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex space-x-2 ">
              {(!edit) && <BuildingOffice2Icon className="h-6 w-6" />}
              {(edit) && <button 
                onClick={() => handleUpdateGroupClick(group)}
                type="button" className="">
                <PencilSquareIcon className='h-5 w-5'/>
              </button>}
              <h2 className="text-xl font-semibold leading-7 text-gray-900 w-full">{group.name}</h2>
              
            </div>
            
            {isAdmin && <button onClick={()=>setEdit(!edit)} className="my-auto">
              <PencilSquareIcon className={`h-5 w-5 ${(edit) && 'fill-gray-300'}`} />
            </button>}
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-500">{group.description}</p>
          <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            {(group.rooms.length >0) ? group.rooms.map((room, idx) => (
            <li key={idx} className="flex justify-between gap-x-6 py-6">
              <div className="w-full flex justify-start">
                
                <BuildingOfficeIcon className="hidden h-5 w-5 my-auto md:block mr-10 "/>
                
                <div className="">
                  <div className="font-medium text-gray-900 ">{room.name}</div>
                  <p className="flex flex-wrap text-gray-400">{room.description}</p>
                </div>
              </div>
              {/* <StarIcon className="h-6 w-6 my-auto"/> */}
              {(edit) && <div className="my-auto md:flex align-center md:space-x-5">
                <button 
                  onClick={() => handleEventClick(room)}
                  type="button" className="w-full text-center font-semibold text-secondary-600 hover:text-secondary-500">
                  Update
                </button>
                <button 
                  type="button"
                  onClick={() => handleDeleteClick(room)} 
                  className="w-full text-center text-secondary-600 hover:text-secondary-500 font-semibold"
                >
                  Delete
                </button>
              </div>}
            </li>)) :  <li className="flex justify-between gap-x-6 py-6"> <div className="font-medium text-gray-900"> -- No resources --</div> </li>}
          </ul>
          {isAdmin && <div className="flex border-t border-gray-100 pt-6">
            <button 
              onClick={handleAddResource}
              type="button" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-500">
              <span aria-hidden="true">+</span> Add resource
            </button>
          </div>}

          {/* MEMBERS */}
          <InviteMemberModal open={inviteMemberModalOpen} setOpen={setInviteMemberModalOpen} groupId={groupId} createInvitation={createInvitation} />
          <UpdateMembershipModal open={updateMembershipModalOpen} setOpen={setUpdateMembershipModalOpen} membership={selectedMembership} updateMembership={updateGroupMembership}/>
          <div className="mt-10 flex w-full justify-between">
            <div className="flex space-x-2">
              <UserGroupIcon className="h-6 w-6" />
              <h2 className="text-xl font-semibold leading-7 text-gray-900">Members</h2>
            </div>
              {isAdmin && <button onClick={()=>setEditMembers(!editMembers)} className="mt-auto">
                <PencilSquareIcon className={`h-5 w-5 ${(editMembers) && 'fill-gray-300'}`} />
              </button>}
            </div>
            <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              {(group.members.length >0) ? group.members.map((member, idx) => (
              <li key={idx} className="flex justify-between gap-x-6 py-6">
                <div className="w-full flex justify-start">
                  <UserCircleIcon className="hidden h-5 w-5 my-auto md:block mr-10 "/>
                  
                  <div className="flex">
                    <div className="font-medium text-gray-900 ">{member.user.email}</div>
                    <div className="text-gray-400 ml-5">{member.role}</div>
                  </div>
                </div>
                
                {(editMembers && member.user.id !== user.id) && <div className="my-auto md:flex align-center md:space-x-5">
                  <button 
                    onClick={() => handleUpdateMemberClick(member)}
                    type="button" className="w-full text-center font-semibold text-secondary-600 hover:text-secondary-500">
                    Update
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteMemberClick(member)} 
                    className="w-full text-center text-secondary-600 hover:text-secondary-500 font-semibold"
                  >
                    Remove
                  </button>
                </div>}
              </li>)) :  <li className="flex justify-between gap-x-6 py-6"> <div className="font-medium text-gray-900"> -- No Members --</div> </li>}

              {(invites.length > 0) && invites.filter(i => i.response !== "accepted").map((invite, idx) => (
                <li key={idx} className="flex justify-between gap-x-6 py-6">
                  <div className="w-full flex justify-start">
                  <EnvelopeOpenIcon className="hidden h-5 w-5 my-auto md:block mr-10 "/>
                  
                  <div className="flex">
                    <div className="font-medium text-gray-900 ">{invite.invitedEmail}</div>
                    <div className="text-gray-400 ml-5">{invite.response == "declined" ? 'Invitation declined' : 'Invited'}</div>
                  </div>
                  
                </div>
                {(editMembers) && <div className="my-auto md:flex align-center md:space-x-5">
                  <button 
                    type="button"
                    onClick={() => handleRemoveInvitationClick(invite.id)} 
                    className="w-full text-center text-secondary-600 hover:text-secondary-500 font-semibold"
                  >
                    Remove
                  </button>
                </div>}
                </li>
              ))}
            </ul>

          
          {isAdmin && <div className="flex border-t border-gray-100 pt-6">
            <button 
              onClick={handleInviteMemberClick}
              type="button" className="text-sm font-semibold leading-6 text-secondary-600 hover:text-secondary-500">
              <span aria-hidden="true">+</span> Invite member
            </button>
          </div>}          
        </div>
        {(!isAdmin) ? <div className=" w-full pt-10 mt-10 sm:flex">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md text-secondary-600 px-3 py-2 text-sm font-semibold border border-secondary-600 shadow-sm hover:text-white hover:bg-secondary-500 sm:w-auto"
            onClick={handleLeaveClick}
          >
            Leave group
          </button>
        </div> 
        : 
        <div className=" w-full pt-10 mt-10 sm:flex">

          <button 
            type="button"
            onClick={() => handleDeleteGroupClick(group)} 
            className="inline-flex w-full justify-center rounded-md text-secondary-600 px-3 py-2 text-sm font-semibold border border-secondary-600 shadow-sm hover:text-white hover:bg-secondary-500 sm:w-auto">
            Delete facility
          </button>
        </div>}
      </main>
    </div>
  )
  return (<Page404 />)
}
