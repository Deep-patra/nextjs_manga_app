import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

async function fetchPages(chapterId: string) {
  const response = await fetch(`${baseURL}at-home/server/${chapterId}`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    const { id } = req.query
    const response: any = await fetchPages(id as string)

    if (response.result === "ok") {
      return res.status(200).json({ data: response })
    }

    return res.status(400).json({ error: "request is not ok" })
  }
  
  return res.status(400).json({ error: "invalid request method" })
}