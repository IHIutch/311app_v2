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

const alertStatus = Object.freeze({
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED',
})

module.exports = {
  userType,
  reportStatus,
  alertStatus,
}
