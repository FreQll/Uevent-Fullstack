import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

type Pagination = {
  page?: number,
  totalPages: number,
}

const Pagination = ({ page, totalPages } : Pagination) => {
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

  const getPagesToShow = () => {
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (currentPage <= 3) {
      startPage = 1;
      endPage = totalPages < 5 ? totalPages : 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )
  }

  const pages = getPagesToShow()

  const prevButton = currentPage > 1 ? (
    <Link
      href={`?page=${currentPage - 1}`}
      className={cn(
        'rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50',
        currentPage === 1 ? 'cursor-not-allowed bg-gray-300' : ''
      )}
    >
      Previous
    </Link>
  ) : (
    <span className={cn(
      'rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50',
      currentPage === 1 ? 'cursor-not-allowed bg-gray-300' : ''
    )}>
      Previous
    </span>
  )

  const nextButton = currentPage < totalPages ? (
    <Link
      href={`?page=${currentPage + 1}`}
      className={cn(
        'rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50',
      )}
    >
      Next
    </Link> 
  ) : (
    <span className={cn(
      'rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50',
      'cursor-not-allowed bg-gray-300'
    )}>
      Next
    </span>
  )
  
  
  return (
    <div className='flex items-center justify-center space-x-4'>
      
      {prevButton}

      <nav aria-label='Pagination' className='relative z-0 inline-flex -space-x-px rounded-md'>
          {pages.map((p, i) => (
            <Link
              key={i}
              href={`?page=${p}`}
              className={cn(
                'relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50',
                p === currentPage ? 'cursor-not-allowed bg-gray-300' : '',
                i === 0 ? 'rounded-l-md': '',
                i === pages.length - 1 ? 'rounded-r-md': '',
              )}
            >
            {p}
            </Link>
          ))}
      </nav>

      {nextButton}
    </div>
  )
}

export default Pagination
