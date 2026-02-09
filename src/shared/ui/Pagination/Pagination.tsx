import './variables.css'
import style from './pagination.module.scss'
import { useState, ChangeEvent, KeyboardEvent } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [inputValue, setInputValue] = useState(currentPage.toString())

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleGo = () => {
    const page = parseInt(inputValue)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    } else {
      setInputValue(currentPage.toString())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo()
    }
  }

  const renderPages = () => {
    const pages = []

    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      if (i >= 1 && i <= totalPages) {
        pages.push(i)
      }
    }

    return pages
  }

  const pages = renderPages()
  const showFirstEllipsis = pages[0] > 2
  const showLastEllipsis = pages[pages.length - 1] < totalPages - 1

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '4px 8px' }}
      >
        Prev
      </button>

      {!pages.includes(1) && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{ padding: '4px 8px' }}
          >
            1
          </button>
          {showFirstEllipsis && <span style={{ padding: '0 4px' }}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '4px 8px',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            backgroundColor: page === currentPage ? '#e0e0e0' : 'transparent'
          }}
        >
          {page}
        </button>
      ))}

      {!pages.includes(totalPages) && (
        <>
          {showLastEllipsis && <span style={{ padding: '0 4px' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{ padding: '4px 8px' }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '4px 8px' }}
      >
        Next
      </button>

      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ width: '50px', padding: '4px' }}
      />
      <button onClick={handleGo} style={{ padding: '4px 8px' }}>
        Перейти
      </button>
    </div>
  )
}

export default Pagination