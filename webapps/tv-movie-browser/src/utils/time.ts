// Moment.js is dead and no longer recommended for new projects

const getDay = (timestamp: Date): Day => ({
  dayOfMonth: timestamp.getDate(),
  month: timestamp.getMonth() + 1,
  year: timestamp.getFullYear(),
})

const getToday = () => getDay(new Date())

export const parseDate = (date?: string) => {
  if (!date) return getToday()

  // Matches YYYY-MM-DD ?
  const match = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(date)
  if (!match) return getToday()

  // NOTE: this is just a cursory sanity check, e.g. 2021-02-30 is accepted
  const time = Date.parse(date)
  if (Number.isNaN(time)) return getToday()

  return getDay(new Date(time))
}
