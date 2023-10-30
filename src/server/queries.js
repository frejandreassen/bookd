import HttpError from '@wasp/core/HttpError.js'


export const getGroupsByUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  return context.entities.GroupMembership.findMany({
    where: { 
      userId: context.user.id
    },
    orderBy: {
      group : {
        id: 'asc'
      }
    },
    include: {
      group: {
        include: {
          rooms: true
        }
      }
    }
  });
}

export const getGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  return context.entities.Group.findUnique({
    where: { 
      id: args.groupId
    },
    include: {
      rooms: true,
      members: {
        include: {
          user: true
        }
      }
    }
  });
}

export const getMembership = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  return context.entities.GroupMembership.findMany({
    where: { 
      groupId: args.groupId,
      userId: context.user.id
    }
  });
}

export const getRooms = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Room.findMany({
    include: {
      bookings: {
        where: {
          date: args.date
        }
      }
    }
  });
}

export const getRoomsByGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Room.findMany({
    include: {
      bookings: {
        where: {
          date: args.date
        }
      }
    },
    where: {
      groupId: args.groupId
    }
  });
}


export const getRoomsByUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Room.findMany({
    include: {
      bookings: {
        where: {
          date: args.date
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      }
    },
    where: {
      group: {
        members: {
          some: {
            userId: context.user.id
          }
        }
      }
    }
  });
}



export const getBookings = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }
  
  return context.entities.Booking.findMany({
    where: { 
      date: args.date
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });
}

export const getBookingsByGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Booking.findMany({
    where: { 
      date: args.date,
      room:  {
        groupId: args.groupId,
      }
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });
}

export const getBookingsByUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const userId = context.user.id;

  const bookings = await context.entities.Booking.findMany({
    where: { 
      userId: userId,
      endTime: {
        gt: new Date().toISOString()
      }
    },
    orderBy: {
      startTime: 'asc'
    },
    include: {
      room: true,
    }
  });
  return bookings
}


export const getGroupInvites = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const userEmail = context.user.email;

  return context.entities.GroupInvite.findMany({
    where: { 
      invitedEmail: userEmail,
      response: ""
    },
    include: {
      group: true,
      createdBy: {
        select: {
          email: true
        }
      }
    }
  });
}


export const getGroupInvitesByGroup = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.GroupInvite.findMany({
    where: { 
      groupId: args.groupId
    },
  });
}