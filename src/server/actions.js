import HttpError from '@wasp/core/HttpError.js'

export const createRoom = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const room = await context.entities.Room.create({
    data: {
      name: args.name,
      description: args.description,
      groupId: args.groupId
    }
  })

  return room
}

export const updateRoom = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const room = await context.entities.Room.findUnique({
    where: { id: args.roomId }
  })
  if (!room) { throw new HttpError(404) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: room.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }

  return context.entities.Room.update({
    where: { id: args.roomId },
    data: { description: args.description, name: args.name }
  })
}

export const deleteRoom = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }


  const room = await context.entities.Room.findUnique({
    where: { id: args.id }
  })
  if (!room) { throw new HttpError(404) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: room.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }
  
  return context.entities.Room.delete({
    where: { id: room.id }
  })
}

export const createBooking = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { recurring, endAfter, date, roomId, startTime, endTime, description } = args;
  let bookingDates = [date];
  const collisions = [];

  // Calculate next booking dates based on recurring type
  if (recurring && endAfter > 1) {
    const startDate = new Date(date);
    for (let i = 1; i < endAfter; i++) {
      let nextDate = new Date(startDate);
      switch (recurring) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + i);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + (i * 7));
          break;
        case 'biweekly':
          nextDate.setDate(nextDate.getDate() + (i * 14));
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + i);
          break;
        default:
          throw new HttpError(400, 'Invalid recurring type.');
      }
      bookingDates.push(nextDate.toISOString().split('T')[0]);
    }
  }

  const originalStartTime = new Date(startTime);
  const originalEndTime = new Date(endTime);

  // Extract time parts
  const startHours = originalStartTime.getHours();
  const startMinutes = originalStartTime.getMinutes();

  const endHours = originalEndTime.getHours();
  const endMinutes = originalEndTime.getMinutes();

  for (let bookingDate of bookingDates) {
    // Adjust date and time for repeat bookings
    const startDateTime = new Date(bookingDate);
    startDateTime.setHours(startHours, startMinutes, 0);

    const endDateTime = new Date(bookingDate);
    endDateTime.setHours(endHours, endMinutes, 0);

    // 1. Query existing bookings
    const existingBookings = await context.entities.Booking.findMany({
      where: { 
        date: bookingDate,
        roomId
      }
    });

    // 2. Check for overlaps
    for (let booking of existingBookings) {
      if ((startDateTime >= new Date(booking.startTime) && startDateTime < new Date(booking.endTime)) ||
          (endDateTime > new Date(booking.startTime) && endDateTime <= new Date(booking.endTime)) ||
          (startDateTime <= new Date(booking.startTime) && endDateTime >= new Date(booking.endTime))) {
        collisions.push({
          date: bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime
        });
      }
    }
  }

  // Check for collisions and throw error
  if (collisions.length > 0) {
    throw new HttpError(409, JSON.stringify({
      error: 'BookingCollisionError',
      message: 'There are conflicts with existing bookings.',
      collisions
    }));
  }

  // 3. Create the booking(s) (if there's no overlap)
  const bookings = [];
  for (let bookingDate of bookingDates) {
    const startDateTime = new Date(bookingDate);
    startDateTime.setHours(startHours, startMinutes, 0);

    const endDateTime = new Date(bookingDate);
    endDateTime.setHours(endHours, endMinutes, 0);

    const newBooking = await context.entities.Booking.create({
      data: {
        userId: context.user.id,
        roomId,
        description,
        date: bookingDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      }
    });
    bookings.push(newBooking);
  }

  return bookings;
}



export const updateBooking = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  const booking = await context.entities.Booking.findUnique({
    where: { id: args.id }
  })
  if (booking.userId !== context.user.id) { throw new HttpError(403) }

  return context.entities.Booking.update({
    where: { id: args.id },
    data: {
      date: args.date,
      startTime: args.startTime,
      endTime: args.endTime
    }
  })
}

export const deleteBooking = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const booking = await context.entities.Booking.findUnique({
    where: { id: args.id }
  })
  if (booking.userId !== context.user.id) { throw new HttpError(403) }

  return context.entities.Booking.delete({
    where: { id: args.id }
  })
}

export const createInvitation = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: args.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }
  
  // Create an invite for each email
  const invites = await Promise.all(
    args.invitedEmails.map(email => 
      context.entities.GroupInvite.create({
        data: {
          invitedEmail: email,
          role: args.role,
          groupId: args.groupId,
          createdById: context.user.id,
        }
      })
    )
  );

  return invites;
}


export const deleteInvitation = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: args.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }
  
  return context.entities.GroupInvite.delete({
    where: { id: args.inviteId}
  })

}


export const acceptInvitation = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const invite = await context.entities.GroupInvite.findUnique({
    where: { id: args.id }
  })
  if (invite.invitedEmail !== context.user.email) { throw new HttpError(403) }

  const membership = await context.entities.GroupMembership.create({
    data: {
      groupId: invite.groupId,
      role: invite.role,
      userId: context.user.id
    }
  })

  await context.entities.GroupInvite.update({
    where: { id: args.id },
    data: { response: "accepted" }
  })

  return membership
}

export const declineInvitation = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const invite = await context.entities.GroupInvite.findUnique({
    where: { id: args.id }
  })
  if (invite.invitedEmail !== context.user.email) { throw new HttpError(403) }


  return await context.entities.GroupInvite.update({
    where: { id: args.id },
    data: { response: "declined" }
  })

}

export const createGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  // Create the group
  const group = await context.entities.Group.create({
    data: {
      name: args.name,
      description: args.description
    }
  });

  // Check if the group was successfully created
  if (!group) {
    throw new Error('Failed to create group');
  }

  // Create a group membership with 'ADMIN' role
  const membership = await context.entities.GroupMembership.create({
    data: {
      groupId: group.id,
      userId: context.user.id, // assuming context.user has the user's ID
      role: 'ADMIN'
    }
  });

  // Check if the membership was successfully created
  if (!membership) {
    throw new Error('Failed to set user as admin');
  }

  return group;
};


export const updateGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const group = await context.entities.Group.findUnique({
    where: { id: args.id }
  })
  if (!group) { throw new HttpError(404) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: group.group, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }

  return context.entities.Group.update({
    where: { id: args.id },
    data: { description: args.description, name: args.name }
  })
}


export const deleteGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const group = await context.entities.Group.findUnique({
    where: { id: args.id }
  })
  if (!group) { throw new HttpError(404) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: group.id, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }
  
  return context.entities.Group.delete({
    where: { id: group.id }
  })
}

export const updateGroupMembership = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: args.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  if (!isAdmin) { throw new HttpError(403) }
  
  return context.entities.GroupMembership.update({
    where: { 
      groupId_userId: {
        userId: args.userId, 
        groupId: args.groupId
      }
    },
    data: {
      role: args.role
    }
  })
}

export const deleteGroupMembership = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  //Check that user is admin
  const memberships = await context.entities.GroupMembership.findMany({
    where: {groupId: args.groupId, userId: context.user.id}
  })
  
  const isAdmin = memberships.some(membership => membership.role === 'ADMIN');
  const isSelf = context.user.id == args.userId
  if (!isAdmin && !isSelf) { throw new HttpError(403) }
  
  return context.entities.GroupMembership.delete({
    where: { 
      groupId_userId: {
        userId: args.userId, 
        groupId: args.groupId
      }
    }
  })
}