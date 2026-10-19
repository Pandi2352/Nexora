import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/cn'
import type { PaginationProps } from './pagination.types'

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showTotal = true,
  showQuickJumper = true,
  className,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('')

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const handleJump = () => {
    const page = parseInt(jumpValue, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleJump()
    }
  }

  const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endEntry = Math.min(totalItems, currentPage * pageSize)

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600',
        className,
      )}
    >
      {/* Total / Range stats */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        {showTotal && (
          <p className="text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-900">{startEntry}</span>–
            <span className="font-semibold text-slate-900">{endEntry}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalItems}</span> entries
          </p>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onPageSizeChange(Number(e.target.value))}
              className="py-1 px-2 rounded-md border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:border-brand-500 cursor-pointer transition-colors"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Buttons and Quick Jump */}
      <div className="flex flex-wrap items-center gap-1">
        <Tooltip content="First page">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="size-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="size-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Previous page">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="size-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        </Tooltip>

        {/* Page Badges */}
        <div className="flex items-center gap-1 mx-0.5">
          {getPageNumbers().map((num, idx) => {
            if (num === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 font-medium select-none">
                  …
                </span>
              )
            }
            const pageNum = num as number
            const isActive = pageNum === currentPage
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'min-w-7 h-7 px-1.5 flex items-center justify-center rounded-md text-xs font-medium cursor-pointer transition-colors border',
                  isActive
                    ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <Tooltip content="Next page">
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="size-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Go to next page"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Last page">
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="size-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Go to last page"
          >
            <ChevronsRight className="size-3.5" />
          </button>
        </Tooltip>

        {showQuickJumper && totalPages > 5 && (
          <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200">
            <span className="text-slate-400 text-xs">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={String(currentPage)}
              className="w-10 h-7 py-0.5 px-1 text-center text-xs rounded-md border border-slate-200 bg-white outline-none focus:border-brand-500"
              aria-label="Jump to page number"
            />
            <span className="text-slate-400 text-xs">of {totalPages}</span>
          </div>
        )}
      </div>
    </div>
  )
}
