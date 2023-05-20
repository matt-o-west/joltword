import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'

type Result =
  | string
  | string[]
  | undefined
  | {
      hwi?: {
        hw?: string
      }
    }

const Autocomplete = ({ matchingWords }) => {
  const [cursor, setCursor] = useState(-1)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cursor, matchingWords])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      // Move cursor down
      event.preventDefault()
      setCursor((oldCursor) =>
        Math.min(oldCursor + 1, matchingWords.length - 1)
      )
    } else if (event.key === 'ArrowUp') {
      // Move cursor up
      event.preventDefault()
      setCursor((oldCursor) => Math.max(oldCursor - 1, 0))
    } else if (event.key === 'Enter') {
      // Navigate to selected item
      event.preventDefault()
      if (cursor >= 0 && cursor < matchingWords.length) {
        const word = matchingWords[cursor]
        const path =
          typeof word === 'string'
            ? `/${word}`
            : `/${word.meta?.id?.replace(/:[^:]*$/, '')}`
        // Use your preferred method for navigation
        window.location.href = path
      }
    }
  }

  if (typeof matchingWords === 'string') {
    // Handle case where matchingWords is a string
    console.log(`Found matching words in ${matchingWords}`)
    return (
      <Link
        to={`/words/${matchingWords}`}
        className='text-2xl font-bold text-purple transition-all duration-250 hover:scale-110 '
      >
        {matchingWords}
      </Link>
    )
  } else if (Array.isArray(matchingWords)) {
    const wordsAsStrings = matchingWords
      .map((word) => (typeof word === 'string' ? word : word?.hwi?.hw))
      .filter((word) => !word.includes('*'))

    const uniqueWordsAsStrings = wordsAsStrings.filter(
      (word, index) => word[index] !== word[index + 1]
    )

    const uniqueWords = uniqueWordsAsStrings.map((string) =>
      typeof matchingWords[0] === 'string'
        ? string
        : matchingWords.find((word) => word?.hwi?.hw === string)
    )

    //console.log(`Found matching words in ${uniqueWords}`)
    return (
      <div className='flex flex-col justify-center items-center text-md p-2 py-8 m-2 desktop:max-w-2xl tablet:max-w-xl phone:max-w-315px phone:mx-auto'>
        {uniqueWords
          .map((word, i) => {
            if (typeof word === 'string') {
              return (
                <Link
                  key={word}
                  to={`/${word}`}
                  className={`text-lg font-bold text-purple transition-all duration-250 hover:scale-110 ${
                    cursor === i ? 'bg-lightgray' : ''
                  }`}
                >
                  {word}
                </Link>
              )
            } else if (typeof word === 'object' && word.hwi?.hw) {
              return (
                <Link
                  key={word.meta?.uuid}
                  to={`/${word.meta?.id?.replace(/:[^:]*$/, '')}`}
                  className={`text-lg font-bold text-purple transition-all duration-250 hover:scale-110 ${
                    cursor === i ? 'bg-lightgray' : ''
                  }`}
                >
                  {word.meta?.id?.replace(/:[^:]*$/, '')}
                </Link>
              )
            } else {
              return null // Don't render duplicate word
            }
          })
          .slice(0, 5)}
      </div>
    )
  } else {
    // Handle case where matchingWords is not a string or an array
    return null
  }
}

export default Autocomplete
