import { z } from 'zod'

export const Emoji = z.object({
  slug: z.string(),
  character: z.string(),
  unicodeName: z.string(),
  codePoint: z.string(),
  group: z.string(),
  subGroup: z.string(),
})

export const EmojiResult = z.object({
  data: z.union([Emoji, z.undefined()]),
})

export const EmojiListResult = z.object({
  data: z.union([z.array(Emoji), z.undefined()]),
})

export const Category = z.object({
  slug: z.string(),
  subCategories: z.array(z.string()),
})

export const CategoryResult = z.object({
  data: z.union([Category, z.undefined()]),
})

export const CategoryListResult = z.object({
  data: z.union([z.array(Category), z.undefined()]),
})
