export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showPageSizeSelector?: boolean
  showTotal?: boolean
  showQuickJumper?: boolean
  className?: string
}

export interface UsePaginationOptions<T> {
  items: T[]
  initialPage?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
}

export interface UsePaginationReturn<T> {
  paginatedItems: T[]
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  totalPages: number
  totalItems: number
  startIndex: number
  endIndex: number
}
