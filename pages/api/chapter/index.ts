import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.BASE_URL

const generateQuery = (ids: string[] = []) => {
  let query = "?"

  ids.forEach((item: string, index: number) => {
    query += `ids[]=${item}`
    if (index !== (ids.length - 1)) query += "&"
  })

  return query
}

const updateQuery = (query: string, ids: string[]) => {
  if (ids.length > 0) query += generateQuery(ids)

  return query
}

async function fetchChapter(ids: string[]): Promise<any> {

  const url = updateQuery(`${baseURL}chapter`, ids)

  const response = await fetch(`${url}`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {

    const ids = req.query['ids[]'] as string[]
    const response: any = await fetchChapter(ids)

    if (response.result === "ok" && response.data !== null) {
      return res.status(200).json({ data: response.data })
    }

    return res.status(400).json({ error: "resposne is invaid" })
  }
  
  return res.status(400).json({ error: "invalid request method" })
}