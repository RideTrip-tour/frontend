import { useEffect, useRef, useState } from 'react'
import './variables.css'
import style from './selectautocomplete.module.scss'

interface Option {
  value: string
  label: string
}

interface SelectAutocompleteProps {
  options: Option[]
  value?: Option | null
  placeholder?: string
  debounce?: number
  onChange: (option: Option) => (value: (((prevState: null) => null) | null)) => void
}

const SelectAutocomplete = ({
                              options,
                              value = null,
                              placeholder = 'Выберите значение',
                              debounce = 400,
                              onChange
                            }: SelectAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen) return

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(() => {
      const q = query.toLowerCase().trim()

      if (!q) {
        setFilteredOptions(options)
      } else {
        setFilteredOptions(
          options.filter(opt =>
            opt.label.toLowerCase().includes(q)
          )
        )
      }
    }, debounce)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [query, options, debounce, isOpen])

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  const handleSelect = (option: Option) => {
    onChange(option)
    setIsOpen(false)
    setQuery('')
    setFilteredOptions(options)
  }

  return (
    <div className={style.selectautocomplete}>
      <div
        className={style.selectautocomplete__control}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={style.selectautocomplete__value}>
          {value ? value.label : placeholder}
        </span>
      </div>

      {isOpen && (
        <div className={style.selectautocomplete__dropdown}>
          <input
            ref={inputRef}
            className={style.selectautocomplete__input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск..."
          />

          <div className={style.selectautocomplete__list}>
            {filteredOptions.length === 0 && (
              <div className={style.selectautocomplete__empty}>
                Ничего не найдено
              </div>
            )}

            {filteredOptions.map(option => (
              <div
                key={option.value}
                className={style.selectautocomplete__option}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectAutocomplete
