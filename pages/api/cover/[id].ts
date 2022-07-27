import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

async function fetchCover(coverId: string) {
  const response = await fetch(`${baseURL}cover/${coverId}`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    try {
      const { id } = req.query
      const response: any = await fetchCover(id as string)

      if (response.result === "ok" && (response.data !== null || undefined)) {
        return res.status(200).json({ data: response.data })
      }

      return res.status(400).json({ error: "response is not ok" })
    } catch(err) {
      return res.status(400).json({ error: err })
    }
  }
  
  return res.status(400).json({ error: "invalid request method"})
}