import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

async function fetchAggregate(mangaId: string) {
  
  const response = await fetch(`${baseURL}manga/${mangaId}/aggregate`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    const { id } = req.query

    const response: any = await fetchAggregate(id as string)

    if (response.result === "ok") {
      return res.status(200).json({ data: response.volumes })
    }

    return res.status(400).json({ error: "response is not ok" })
  }
  
  return res.status(400).json({ error: "request method invalid"})
}