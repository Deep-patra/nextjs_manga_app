import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

async function fetchRandom() {
  const response = await fetch(`${baseURL}manga/random`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if (req.method === "GET") {
    const response: any = await fetchRandom()

    if (response.result === "ok" && (response.data !== null || undefined)) {
      return res.status(200).json({ data: response.data })
    }
  }

  return res.status(400)
}