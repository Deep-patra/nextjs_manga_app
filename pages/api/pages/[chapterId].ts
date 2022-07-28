import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";

const fetchPages = async (chapterID: string): Promise<any> => {
  const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterID}`)

  const json = await response.json()

  return json
}


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {

    try {

      const { chapterId } = req.query
      
      const response = await fetchPages(chapterId as string)

      if (response.result !== "ok") throw new Error("response result is not ok")

      return res.status(200).json({ data: response })

    } catch( error ) {
      return res.status(400).json({ message: "response result is not ok "})
    }

  } else {
    return res.status(400).json({ message: "request method is invalid " })
  }
}