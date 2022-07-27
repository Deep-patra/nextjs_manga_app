import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { ContentRating } from '../../../api_types/contentRating'
import { ReadingStatus } from '../../../api_types/readingStatus'
import { Status } from '../../../api_types/status'

dotenv.config()

const baseURL = process.env.BASE_URL

const searchQuery = {
  title: "",
}

async function fetchResults(query: any = {}) {
  let newQuery = { ...searchQuery, ...query}

  const response = await fetch(`${baseURL}manga?title=${encodeURI(newQuery.title)}`)

  const json = await response.json()

  return json
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    let query = req.query

    if (query === undefined) query = {}

    const response: any = await fetchResults(query)

    if (response.result === "ok") {
      return res.status(200).json({ data: response.data })
    }

    return res.status(400).json({ error: "request is not ok" })
  }
  
  return res.status(400).json({ error: "invalid request method "})
}