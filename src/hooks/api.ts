import { useQuery } from 'react-query'
import { getCategory, getCategoryList, getEmoji, getEmojiList } from '../helpers/api'

/** react-query hook for fetching emoji list */
export function useEmojiListQuery(searchStr?: string) {
  return useQuery([`getEmojiList`, searchStr], ({ queryKey }) => getEmojiList(queryKey[1]), {
    retry: false,
    refetchOnWindowFocus: false,
  })
}

/** react-query hook for fetching a single emoji by its slug */
export function useEmojiQuery(slug: string) {
  return useQuery([`getEmoji`, slug], ({ queryKey }) => getEmoji(queryKey[1]))
}

/** react-query hook for fetching all categories */
export function useCategoryListQuery() {
  return useQuery(['getCategoryList'], () => getCategoryList())
}

/** react-query hook for fetching a single category by its slug */
export function useCategoryQuery(slug: string) {
  return useQuery([`getCategory`, slug], ({ queryKey }) => getCategory(queryKey[1]))
}
