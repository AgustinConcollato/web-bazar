import { useEffect, useRef, useState } from "react"
import { Loading } from "../Loading/Loading"

export function InputCity({ url, province, setCity }) {

    const [query, setQuery] = useState('')
    const [filteredOptions, setFilteredOptions] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [hidden, setHidden] = useState(true)

    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const optionRefs = useRef([])

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

    useEffect(() => {
        if (optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'

            })
        }
    }, [highlightedIndex])

    async function handleChange(event) {
        const value = event.target.value
        setQuery(value)
        setCity(value)

        if (value.trim() === '') {
            setHidden(true)
            setFilteredOptions([])
            return
        } else {
            setIsLoading(true)
            const response = await fetch(`${url}/localidades?provincia=${province}&nombre=${value}`)

            const { localidades } = await response.json()

            if (localidades) {
                setFilteredOptions(localidades)
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
            const selectedOption = filteredOptions[highlightedIndex]
            if (selectedOption) {

                handleOption(selectedOption)
            }
        }
    }

    function handleOption(option) {
        setQuery(option.nombre)
        setCity(option.nombre)
        setHidden(true)
    }


    return (
        <div className="input-address" ref={dropdownRef}>
            <input
                type="text"
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Localidad"
                className="input"
                autoComplete="off"
                required
                onFocus={() => query && setHidden(false)}
            />
            {(!hidden && filteredOptions.length > 0) &&
                <div className='container-options-list'>
                    <ul className="options-list">
                        {isLoading ? (
                            <Loading />
                        ) : (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={option.id}
                                    className={highlightedIndex === index ? 'highlighted' : ''}
                                    ref={(el) => (optionRefs.current[index] = el)}
                                    onClick={() => handleOption(option)}
                                >
                                    {option.nombre}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}