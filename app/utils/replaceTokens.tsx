import { Link } from '@remix-run/react'
import reactStringReplace from 'react-string-replace'

const replaceTokens = (text: string) => {
  const parsedTokens = reactStringReplace(
    text,
    /\{sc\}(.*?)\{\/sc\}/g,
    (match, i) => <span key={i}>{match}</span>
  )

  return parsedTokens
}

export default replaceTokens
