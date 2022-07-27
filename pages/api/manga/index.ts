import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const baseURL = process.env.BASE_URL;

const default_query = {
  limit: 30,
  offset: 0,
}

function getURLString(query: string, valueArray: any): string {
  const values = Array.isArray(valueArray) ? valueArray : [valueArray, ]
  
  let queryString = ""

  values.forEach((item: any, index: number) => {
    queryString += `${query}[]=${item}`
    index !== (values.length - 1) && (queryString += '&')
  })

  return queryString
}

const generateQuery = (query: any) => {
    const q = { ...default_query, ...query }

    if (q['ids[]'] !== undefined) {
      let queryString = `?${getURLString('ids', q['ids[]'])}`

      return queryString
    }

    let queryString = `?limit=${q.limit}&offset=${q.offset}`

    q['status[]'] !== undefined && (queryString += `&${getURLString('status', q['status[]'])}`)
    q['rating[]'] !== undefined && (queryString += `&${getURLString('contentRating', q['rating[]'])}`)
    q['publicationDemographic[]'] !== undefined && (queryString += `&${getURLString('publicationDemographic', q['publicationDemographic[]'])}`)
    q['inculdedTags[]'] !== undefined && (queryString += `&${getURLString('includedTags', q['includedTags[]'])}`)
    q['excludedTags[]'] !== undefined && (queryString += `&${getURLString('excludedTags', q['excludedTags[]'])}`)

    return queryString

}

async function fetchManga(query: any = {}) {
  let searchQuery = generateQuery(query)

  const response = await fetch(`${baseURL}manga${searchQuery}`)

  if (response.status !== 200) return {}
  const res = await response.json()

  return res
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // if the request method is GET
  if (req.method === "GET") {

    try { 

      let query = req.query

      if (query === undefined) query = {}
      
      // fetch the mangas from the mangadex api
      const response = (await fetchManga(query)) as any

      if (response.result === "ok" && response.data !== null) {
        return res.status(200).json({ data: response.data })
      }

    } catch (error) {

      return res.status(400).json({ error: error })
      
    }
  }

  return res.status(400).json({ error: { message: "Invalid request method" }})
}