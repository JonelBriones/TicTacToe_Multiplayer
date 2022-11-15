let users = []

function userJoin(id, username, ready, room, letter) {
  const user = { id, username, ready, room, letter }
  if (users.length === 2) return { error: 'Room Full' }
  users.push(user)
  console.log('current list of players:', users)
  return user
}
function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

function getRoomUser(room) {
  const user = users.filter((user) => user.room === room)
  console.log(`users in room: ${room}`, user)
  return user
}

function userLeave(id) {
  // const updateUser = users.filter((user) => user.id !== id)
  // console.log(updateUser)
  // return updateUser
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    console.log('INDEX', index)
    const updateUsers = users.splice(index, 1)[0]
    console.log('UPDATED USERS IN LOBBY', updateUsers)
    return updateUsers
  }
}
module.exports = {
  userJoin,
  users,
  getCurrentUser,
  getRoomUser,
  userLeave,
}
