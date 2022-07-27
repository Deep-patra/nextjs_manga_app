interface Chapter {
  chapterId: string,
  time: string,
}

interface Manga {
  id: string,
  isFavourite: boolean,
  lastReadChapter: string | null,
  readChapters: Chapter[],
  lastRead: string,
}

export type { Manga }
export default Manga