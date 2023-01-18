import React, { useEffect, useId, useRef, useState } from 'react'
import { createBrowserRouter, useSearchParams, RouterProvider, Router } from 'react-router-dom'
import * as emoji from 'emoji-api'
import debounce from 'lodash-es/debounce.js'
import { twMerge } from 'tailwind-merge'
import { matchSorter } from 'match-sorter'
import useCopyToClipboard from './hooks/clipboard'

const router = createBrowserRouter([{ path: '/', element: <LandingPage /> }])
const allEmoji = emoji.all()
const emojiList = allEmoji.map((emoji: emoji.Emoji) => {
  return {
    name: emoji.name,
    emoji: emoji.emoji,
    group: emoji.group,
    subGroup: emoji.subGroup,
  }
})

type Emoji = Pick<emoji.Emoji, 'name' | 'emoji' | 'group' | 'subGroup'>

type EmojiList = typeof emojiList

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <div className="py-12 px-6 md:p-12">
        <div className="w-full flex items-center flex-col">
          <header className="text-center">
            <h1 className="font-bold font-secondary drop-shadow text-4xl md:text-5xl block text-center mb-2 -translate-x-3">
              <span aria-hidden="true">🏠&nbsp;</span>emoji.casa
            </h1>

            <span className="text-lg text-slate-400">
              Your home for quick and easy emoji search.
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
  )
}

function EmojiForm() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchStr = searchParams.get('search') ?? ''
  const input = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const helpId = useId()

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchParams({ search: (e.target as HTMLInputElement).value })
  }

  const handleClearClick = () => {
    searchParams.delete('search')
    setSearchParams(searchParams)

    if (input?.current) {
      input.current.focus()
      input.current.value = ''
    }
  }

  const debouncedFn = debounce(handleChange, 500)

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
            defaultValue={searchStr}
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

      {status === 'loading' && searchStr ? (
        <p id={helpId} className="text-center text-lg text-slate-300">
          Loading results for <span className="font-bold">"{searchStr}"...</span>.
        </p>
      ) : null}

      {status === 'error' && searchStr ? (
        <div className="text-center text-lg text-slate-300 p-8 border border-red-400 bg-red-400 bg-opacity-10 rounded">
          <p>
            Unfortunately something went wrong<span aria-hidden="true">&nbsp;😥</span>. Please try
            again later.
          </p>
        </div>
      ) : null}

      {searchStr ? <EmojiResults emojiList={emojiList} searchStr={searchStr ?? ''} /> : null}

      {!searchStr ? (
        <p id={helpId} className="text-center text-lg text-slate-300">
          No results yet. Type to search emoji by name.
        </p>
      ) : null}
    </div>
  )
}

/** Filters emoji results by the search string and removes emoji by a lit of hard-coded sub strings */
function filterEmojiResults(data: EmojiList, searchStr: string) {
  return matchSorter(data, searchStr, { keys: ['name'] })
}

function EmojiResults({ emojiList, searchStr }: { emojiList: EmojiList; searchStr: string }) {
  const filteredData = filterEmojiResults(emojiList, searchStr)

  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-lg text-slate-300">
        {filteredData.length === 0 ? 'No results found for' : 'Results for'}
        &nbsp;<span className="font-bold">"{searchStr}"</span>.
      </p>

      {filteredData.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {filteredData.map((emoji) => (
            <li className="w-full" key={emoji.name}>
              <EmojiButton emoji={emoji} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const COPIED_MSG_DURATION = 1500

function EmojiButton({ emoji }: { emoji: Emoji }) {
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
      onClick={() => handleClick(emoji.emoji)}
      className={twMerge(
        'group shadow h-14 w-full flex justify-between items-center gap-4 text-lg bg-indigo-900 border border-indigo-600 rounded transition-all',
        'hover:bg-indigo-800',
        'active:scale-[0.98]',
        'focus-visible:bg-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500',
      )}
    >
      <span className="p-4 h-full flex items-center gap-4">
        <span className="text-2xl">{emoji.emoji}</span>

        <span className="font-mono text-sm">{emoji.name}</span>
      </span>

      <span
        className={twMerge(
          'flex items-center h-full px-6 bg-indigo-800 border-l border-indigo-600 transition-colors',
          'group-hover:bg-indigo-700',
        )}
      >
        <span className="text-sm w-12">{copied ? 'Copied!' : 'Copy'}</span>
        <span className="sr-only">&nbsp;{emoji.name}</span>
      </span>
    </button>
  )
}

export default App
