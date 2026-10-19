import { useEffect, useMemo, useState } from 'react'
import type { UsePaginationOptions, UsePaginationReturn } from './pagination.types'

export function usePagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(totalItems, startIndex + pageSize)

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex)
  }, [items, startIndex, endIndex])

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  return {
    paginatedItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
  }
}
