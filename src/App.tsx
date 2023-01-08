import { QueryClient, QueryClientProvider } from 'react-query'
import React, { useEffect, useState } from 'react'
import debounce from 'lodash-es/debounce.js'
import { twMerge } from 'tailwind-merge'
import { matchSorter } from 'match-sorter'
import { useEmojiListQuery } from './hooks/api'
import useCopyToClipboard from './hooks/clipboard'
import { TEmoji } from './types/api'

/** TODO
 * - [] Add clear button
 * - [] Move search state to query param in URL
 * - [X] Handle undefined result from API - throwing a Zod error right now
 */

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-12">
        <div className="w-full flex items-center flex-col">
          <div className="text-center">
            <h1 className="font-bold drop-shadow text-5xl block text-center mb-2">emoji.casa</h1>

            <span className="text-lg text-slate-400">quick emoji search!</span>
          </div>

          <EmojiForm />
        </div>
      </div>
    </QueryClientProvider>
  )
}

function EmojiForm() {
  const { status, data } = useEmojiListQuery()
  const [searchStr, setSearchStr] = useState<string | undefined>(undefined)

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchStr((e.target as HTMLInputElement).value)
  }

  const debouncedFn = debounce(handleChange, 250)

  return (
    <div className="w-full max-w-3xl p-8 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor="search-field" className="text-xl block sr-only">
          Search
        </label>

        <input
          id="search-field"
          className={twMerge(
            'w-full border border-slate-700 text-slate-200 text-lg drop-shadow-lg bg-slate-800 p-4 rounded-lg transition-opacity',
            status === 'loading' ? 'cursor-wait opacity-70' : 'opacity-100',
          )}
          autoFocus
          disabled={status === 'loading'}
          type="text"
          placeholder="e.g., 'smile', 'cry', 'hands'"
          onChange={debouncedFn}
        />
      </div>

      {status === 'success' && (
        <>
          {data && searchStr ? (
            <EmojiResults data={data} searchStr={searchStr} />
          ) : (
            <p className="text-center text-lg text-slate-300">No results yet. Type to search.</p>
          )}
        </>
      )}
    </div>
  )
}

function EmojiResults({ data, searchStr }: { data: TEmoji[]; searchStr: string }) {
  const filteredData = matchSorter(data, searchStr, { keys: ['unicodeName'] }).filter(
    (emoji) => !emoji.unicodeName.includes('E0.6'),
  )

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-lg text-slate-300">
        Results for <span className="font-bold">"{searchStr}"</span>.
      </p>

      <ul className="flex flex-col gap-4">
        {filteredData.map((emoji) => (
          <li className="w-full" key={emoji.slug}>
            <EmojiButton emoji={emoji} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const COPIED_MSG_DURATION = 1500

function EmojiButton({ emoji }: { emoji: TEmoji }) {
  const [copied, setCopied] = useState(false)
  const [_value, copy] = useCopyToClipboard()

  const handleClick = (emoji: string) => {
    copy(emoji)
    setCopied(true)
  }

  // Runs a timer to update the copied message
  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), COPIED_MSG_DURATION)

    return () => {
      clearTimeout(timer)
    }
  }, [copied])

  return (
    <button
      onClick={() => handleClick(emoji.character)}
      className={twMerge(
        'group shadow h-14 w-full flex justify-between items-center gap-4 text-lg bg-indigo-900 border border-indigo-600 rounded transition-all',
        'hover:bg-indigo-800 hover:-translate-y-1',
        'focus-visible:bg-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500',
      )}
    >
      <span className="p-4 h-full flex items-center gap-4">
        <span className="text-2xl">{emoji.character}</span>

        <span className="font-mono text-sm">{emoji.unicodeName}</span>
      </span>

      <span
        className={twMerge(
          'flex items-center h-full px-6 bg-indigo-800 border-l border-indigo-600 transition-colors',
          'group-hover:bg-indigo-700',
        )}
      >
        <span className="text-sm w-12">{copied ? 'Copied!' : 'Copy'}</span>
        <span className="sr-only">&nbsp;{emoji.unicodeName}</span>
      </span>
    </button>
  )
}

export default App
