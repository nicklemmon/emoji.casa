import fetch from 'node-fetch'

export default async function handler(_request, response) {
  const res = await fetch(`https://emoji-api.com/emojis?access_key=${process.env.EMOJI_API_KEY}`, {
    method: 'GET',
  })

  const data = await res.json()

  return response.status(200).json({ data })
}
