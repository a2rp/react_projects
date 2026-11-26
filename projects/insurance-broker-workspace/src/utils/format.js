export const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value) || 0)
export const date = (value) => new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const initials = (name = '') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
export const nextId = (prefix, records) => `${prefix}-${String(Math.max(0, ...records.map((item) => Number(item.id.split('-')[1]) || 0)) + 1).padStart(4, '0')}`
export const today = () => {
  const current = new Date()
  const month = String(current.getMonth() + 1).padStart(2, '0')
  const day = String(current.getDate()).padStart(2, '0')
  return `${current.getFullYear()}-${month}-${day}`
}
export const csvCell = (value) => {
  const text = String(value ?? '')
  const firstMeaningfulCharacter = [...text].find((character) => character.charCodeAt(0) > 0x20)
  const safe = ['=', '+', '-', '@'].includes(firstMeaningfulCharacter) ? `'${text}` : text
  return `"${safe.replaceAll('"', '""')}"`
}
