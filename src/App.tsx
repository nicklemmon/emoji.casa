import { QueryClient, QueryClientProvider } from 'react-query'
import React, { useEffect, useId, useRef, useState } from 'react'
import debounce from 'lodash-es/debounce.js'
import { twMerge } from 'tailwind-merge'
import { matchSorter } from 'match-sorter'
import { useEmojiListQuery } from './hooks/api'
import useCopyToClipboard from './hooks/clipboard'
import { TEmoji } from './types/api'

/** TODO
 * - [X] Add clear button
 * - [X] Handle undefined result from API - throwing a Zod error right now
 * - [] Move search state to query param in URL
 */

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <div className="py-12 px-6 md:p-12">
          <div className="w-full flex items-center flex-col">
            <header className="text-center">
              <h1 className="font-bold font-secondary drop-shadow text-5xl block text-center mb-2 -translate-x-3">
                <span aria-hidden="true">🏠&nbsp;</span>emoji.casa
              </h1>

              <span className="text-lg text-slate-400">
                The home of quick and easy emoji search.
              </span>
            </header>

            <main className="w-full">
              <EmojiForm />
            </main>
          </div>
        </div>

        <footer className="sticky top-[100vh] bg-slate-800 bg-opacity-40 text-center px-6 py-4 md:px-12">
          <p className="text-lg text-slate-400">
            Built with{' '}
            <span aria-label="love" role="img">
              💌
            </span>{' '}
            by{' '}
            <a
              className="underline text-indigo-300"
              href="https://nicklemmon.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>Nick Lemmon</span>
              <span className="sr-only">&nbsp;(Opens in a new tab)</span>
            </a>
            <span>, all rights reserved {new Date().getFullYear()}</span>
          </p>
        </footer>
      </div>
    </QueryClientProvider>
  )
}

function EmojiForm() {
  const input = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const helpId = useId()
  const { status, data } = useEmojiListQuery()
  const [searchStr, setSearchStr] = useState<string | undefined>(undefined)

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchStr((e.target as HTMLInputElement).value)
  }

  const handleClearClick = () => {
    setSearchStr(undefined)

    if (input?.current) {
      input.current.focus()
      input.current.value = ''
    }
  }

  const debouncedFn = debounce(handleChange, 150)

  return (
    <div className="mx-auto w-full max-w-3xl p-3 md:p-8 flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-xl block sr-only">
          Search
        </label>

        <div
          className={twMerge(
            'relative w-full border border-slate-700  drop-shadow-lg bg-slate-800 rounded-lg transition-opacity',
          )}
        >
          <input
            id={inputId}
            className={twMerge(
              'text-slate-200 bg-transparent w-full text-lg p-4 rounded-lg transition-all',
              'focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none',
            )}
            ref={input}
            autoFocus
            type="text"
            placeholder="e.g., 'smile', 'cry', 'hands'"
            aria-describedby={helpId}
            onChange={debouncedFn}
          />

          {searchStr ? (
            <button
              className={twMerge(
                'px-6 text-sm h-full rounded-br-lg rounded-tr-lg absolute right-0 top-1/2 -translate-y-1/2 transition-all',
                'hover:bg-slate-700',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400',
              )}
              onClick={handleClearClick}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {status === 'success' && data && searchStr ? (
        <EmojiResults data={data} searchStr={searchStr} />
      ) : null}

      {!searchStr ? (
        <p id={helpId} className="text-center text-lg text-slate-300">
          No results yet. Type to search emoji by name.
        </p>
      ) : null}
    </div>
  )
}

/** Certain emoji are repeated due to different versions of available emoji */
const UNICODE_STR_BLOCKLIST = ['E11.0', 'E13.0', 'E0.6', 'E1.0', 'E0.7', 'E5.0', 'E3.0']

/** Filters emoji results by the search string and removes emoji by a lit of hard-coded sub strings */
function filterEmojiResults(data: TEmoji[], searchStr: string) {
  return matchSorter(data, searchStr, { keys: ['unicodeName'] }).filter(({ unicodeName }) => {
    return !UNICODE_STR_BLOCKLIST.some((substring) => unicodeName.includes(substring))
  })
}

function EmojiResults({ data, searchStr }: { data: TEmoji[]; searchStr: string }) {
  const filteredData = filterEmojiResults(data, searchStr)

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-lg text-slate-300">
        {filteredData.length === 0 ? 'No results found for' : 'Results for'}
        &nbsp;<span className="font-bold">"{searchStr}"</span>.
      </p>

      {filteredData.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {filteredData.map((emoji) => (
            <li className="w-full" key={emoji.slug}>
              <EmojiButton emoji={emoji} />
            </li>
          ))}
        </ul>
      ) : null}
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
        'hover:bg-indigo-800',
        'active:scale-[0.98]',
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
