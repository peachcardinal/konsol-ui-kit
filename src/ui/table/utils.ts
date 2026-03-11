export function getByDataIndex<TRecord extends Record<string, unknown>>(
  record: TRecord,
  dataIndex?: string | string[],
): unknown {
  if (!dataIndex)
    return undefined
  const path = Array.isArray(dataIndex) ? dataIndex : dataIndex.split('.').filter(Boolean)

  let cur: unknown = record
  for (const key of path) {
    if (cur == null)
      return undefined
    if (typeof cur !== 'object')
      return undefined
    cur = (cur as Record<string, unknown>)[key]
  }
  return cur
}
