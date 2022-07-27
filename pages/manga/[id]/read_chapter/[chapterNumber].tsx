import { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import Store from '../../../../stores/mangaStore/store'
import { Provider } from 'react-redux'
import { useEffect, useLayoutEffect, useState } from 'react'
import Container from '../../../../components/Container'
import Header from '../../../../components/Header'
import Pages from '../../../../components/Pages'

interface Props {
  data: any
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params
  const { id } = params as any

  const response = await fetch(`http://localhost:5000/api/manga/${id}/aggregate`)

  const res = await response.json()

  return {
    props: {
      data: res,
    }
  }
}

const ChaptersPage: NextPage<Props> = ({ data }) => {

  const router = useRouter()
  const [englishChapter, changeChapter] = useState<any>(null)
  const [allChapters, changeChapters] = useState<any>(null)
  const chapterNumber = router.query.chapterNumber as string

  useEffect(() => {
    changeChapter(null)
    changeChapters(null)
  }, [router.query.chapterNumber])

  useEffect(() => {

    const fetchChapter = async (ids: string[]) => {
      const fetches: Promise<any>[] = []

      ids.forEach((id: string) => {
        fetches.push(fetch(`/api/chapter/${id}`))
      })

      const response = await Promise.all(fetches)

      const res: any[] = response.map( async (item: any) => {
        const json = await item.json()

        return json
      })

      const result = await Promise.all(res)

      return result
    }

    const result = data.data

    let chapters = {}

    Array.from(Object.values(result)).forEach((volume: any) => {
      chapters = { ...chapters, ...volume.chapters }
    })

    // store the chapters in the state
    changeChapters(chapters)

    const chapter: any = Object.values(chapters).find((item: any) => {
      if (parseInt(item.chapter) === parseInt(chapterNumber)) return true

      return false
    })

    let ids = []

    if (chapter !== null && chapter !== undefined) {
      ids.push(chapter.id)

      chapter.others.forEach((id: string) => {
        ids.push(id)
      })
    }


    fetchChapter(ids)
    .then(res => {

      res.forEach((item: any) => {

        const chapterData = item.data
        if (chapterData.attributes.translatedLanguage === "en") {
          changeChapter(chapterData)
        }

      })

    })
    .catch(err => {})

  }, [chapterNumber])

  return (
    <Provider store={Store}>
      <Container>
        <Header showButton={false} toggleMenu={() => {}} toggleSearch={() => {}}/>
        {
          englishChapter !== null ?
          <Pages chapter={englishChapter} data={allChapters} />
          : null
        }
      </Container>
    </Provider>
  )
}

export default ChaptersPage