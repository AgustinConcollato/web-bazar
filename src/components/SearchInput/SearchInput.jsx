import { useState, useEffect, useRef } from 'react'
import { api, urlStorage } from 'api-services'
import './SearchInput.css'
import { Loading } from '../Loading/Loading'
import { Link, useNavigate } from 'react-router-dom'

export function SearchInput() {
    const { Products } = api

    const [query, setQuery] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [hidden, setHidden] = useState(true)

    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const products = new Products()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setHidden(true)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    async function handleChange(event) {
        const value = event.target.value
        setQuery(value)

        if (value.trim() === '') {
            setHidden(true)
            setFilteredOptions([])
            return
        } else {
            setIsLoading(true)
            const response = await products.search({ options: { name: value.trim(), page: 1 } })

            if (response) {
                const filtered = response.data.filter(option =>
                    option.name.toLowerCase().includes(value.toLowerCase())
                )
                setFilteredOptions(filtered)
                setIsLoading(false)
                setHidden(false)
            }
        }

        setHighlightedIndex(0)
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                Math.min(prevIndex + 1, filteredOptions.length - 1)
            )
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0))
        } else if (event.key === 'Enter') {
            event.preventDefault()
            if (filteredOptions[highlightedIndex]) {
                navigate('producto/' + filteredOptions[highlightedIndex].id)
                setQuery(filteredOptions[highlightedIndex].name)
                setFilteredOptions([])
                setHidden(true)
            }
        }
    }

    function handleOptionClick(option) {
        setQuery(option.name)
        setFilteredOptions([])
        setHidden(true)
    }

    return (
        <div className="search" ref={dropdownRef}>
            <input
                type="text"
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar productos por nombre"
                name="name"
                className="input"
                autoComplete="off"
                required
                onFocus={() => setHidden(false)}
            />
            {(!hidden && filteredOptions.length != 0) && (
                <ul className="options-list">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        filteredOptions.map((option, index) => (
                            <li key={option.id}>
                                <Link
                                    to={'producto/' + option.id}
                                    className={highlightedIndex === index ? 'highlighted' : ''}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    <img
                                        src={`${urlStorage}/${JSON.parse(option.thumbnails)[0]}`}
                                        alt=""
                                    />
                                    {option.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}
