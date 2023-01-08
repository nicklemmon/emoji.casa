import { EmojiResult, EmojiListResult, CategoryResult, CategoryListResult } from '../schemas/emoji'

/** Arguments for the `emojiApiRequest` function */
type EmojiApiRequestParams = {
  params?: string
  route?: string
}

/**
 * Fetch generator for https://emoji-api.com
 * @see {@link https://emoji-api.com/#documentation}
 */
async function emojiApiRequest(emojiApiRequestParams?: EmojiApiRequestParams) {
  return await fetch(`/api/emoji`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err)

      throw new Error(err)
    })
}

/** Returns a list of all emoji. Search string optional. */
export async function getEmojiList(searchStr?: string) {
  const args = {
    route: '/emojis',
    params: searchStr ? `&search=${searchStr}` : undefined,
  }

  const { data } = EmojiListResult.parse(await emojiApiRequest(args))

  return data
}

/** Returns a list of emoji according to the passed-in slug */
export async function getEmoji(slug: string) {
  const { data } = EmojiResult.parse(await emojiApiRequest({ route: `/emojis/${slug}` }))

  return data
}

/** Returns a list of all emoji categories */
export async function getCategoryList() {
  const { data } = CategoryListResult.parse(await emojiApiRequest({ route: '/categories' }))

  return data
}

/** Returns a particular category according to the passed-in slug */
export async function getCategory(category: string) {
  const { data } = CategoryResult.parse(await emojiApiRequest({ route: `/categories/${category}` }))

  return data
}
