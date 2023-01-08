import { z } from 'zod'
import {
  Emoji,
  EmojiResult,
  EmojiListResult,
  CategoryResult,
  CategoryListResult,
} from '../schemas/emoji'

export type TEmoji = z.infer<typeof Emoji>

export type TEmojiResult = z.infer<typeof EmojiResult>

export type TEmojiListResult = z.infer<typeof EmojiListResult>

export type TCategoryResult = z.infer<typeof CategoryResult>

export type TCategoryResultList = z.infer<typeof CategoryListResult>
