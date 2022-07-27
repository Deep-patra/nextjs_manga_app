import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

async function fetchManga(mangaId: string) {
  const response = await fetch(`${baseURL}manga/${mangaId}`)

  const res = await response.json()

  return res
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const { id } = req.query

    const response: any = await fetchManga(id as string)

    if ( response.result === "ok" && (response.data !== null || undefined)) {
      return res.status(200).json({ data: response.data })
    }

    return res.status(400).json({ error: "response is not ok" })
  }

  return res.status(400).json({ error: "invalid request method" })
}