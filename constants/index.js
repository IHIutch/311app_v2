const userType = Object.freeze({
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER: 'SUPER',
})

const reportStatus = Object.freeze({
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  SCHEDULED: 'SCHEDULED',
  CLOSED: 'CLOSED',
})

module.exports = {
  userType,
  reportStatus,
}
