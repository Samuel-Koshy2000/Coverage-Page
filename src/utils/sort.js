/**
 * Stable sort an array of objects by a key.
 * Preserves the original order of equal elements.
 *
 * @param {Array}  arr       - Array to sort
 * @param {string} key       - Object key to sort by
 * @param {'asc'|'desc'} dir - Sort direction
 * @returns {Array} New sorted array (original is not mutated)
 */
export function stableSort(arr, key, dir = 'asc') {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const valA = (a.item[key] ?? '').toString().toLowerCase()
      const valB = (b.item[key] ?? '').toString().toLowerCase()
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
      // Tie-break on original index to guarantee stability
      return dir === 'asc' ? cmp || a.index - b.index : -cmp || a.index - b.index
    })
    .map(({ item }) => item)
}
