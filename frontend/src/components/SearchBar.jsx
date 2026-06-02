import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Поиск фильмов...', initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Поиск"
      />
      <button type="submit" aria-label="Найти">🔍</button>
    </form>
  )
}
