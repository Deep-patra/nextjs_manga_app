import { FC, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import style from "./pages.module.css";
import CircularLoading from "../CircularProgress";
import Link from "next/link";

const Heading = () => {
  const router = useRouter();
  const [metaData, changeMetaData] = useState<any>(null);
  const { id } = router.query;

  const fetchMangaMetadata = (id: string) => {
    fetch(`/api/manga/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          changeMetaData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMangaMetadata(id as string);
  }, []);

  return (
    <div className={style.headingWrapper}>
      {metaData !== null ? (
        <h2>
          {metaData.attributes.title.en === undefined
            ? Object.values(metaData.attributes.title)[0]
            : metaData.attributes.title.en}
        </h2>
      ) : null}
    </div>
  );
};

interface ChapterHeadingProps {
  chapter: any;
}

const ChapterHeading: FC<ChapterHeadingProps> = ({ chapter }) => {
  const attribute = chapter.attributes;

  return (
    <div className={style.chapterHeadingWrapper}>
      <h4>
        {`Chapter ${attribute.chapter}. ${
          attribute.title !== null ? attribute.title : ""
        }`}
      </h4>
    </div>
  );
};

interface NavButtonProps {
  chapter: any;
  data: any;
}

const NavButtons: FC<NavButtonProps> = ({ chapter, data }) => {
  const router = useRouter()
  const { id, chapterNumber } = router.query

  let hasPreviousChapter: boolean = false
  let hasNextChapter: boolean = false
  let previousChapter: string = ""
  let nextChapter: string = ""

  Array.from(Object.keys(data)).forEach(
    (item: string, index: number, list: string[]) => {
      if (item === chapter.attributes.chapter) {
        
        if (index - 1 !== -1) {
          hasPreviousChapter = true
          previousChapter = list[index - 1]

        }

        if (index + 1 !== list.length) {
          hasNextChapter = true
          nextChapter = list[index + 1]
        }
      }
    }
  );

  const handlePreviousChapter = () => {
    if (parseInt(chapter.attributes.chapter) !== NaN && parseInt(chapter.attributes.chapter) - 1 !== -1) {
      router.push(`/manga/${id}/read_chapter/${previousChapter}`)
    }
  };

  const handleNextChapter = () => {
    if (parseInt(chapter.attributes.chapter) - 1 !== -1) {
      router.push(`/manga/${id}/read_chapter/${nextChapter}`)
    }
  };

  return (
    <div className={style.navButtonWrapper}>
      {hasPreviousChapter ? (
        <button
          type="button"
          className={style.previousButton + " " + style.navButton}
          onClick={handlePreviousChapter}
        >
          Previous
        </button>
      ) : null}

      {hasNextChapter ? (
        <button
          type="button"
          className={style.nextButton + " " + style.navButton}
          onClick={handleNextChapter}
        >
          Next
        </button>
      ) : null}
    </div>
  );
};

interface PageProps {
  url: string,
  pageNumber: number,
  width: number
}

const Page: FC<PageProps> = ({ url, pageNumber, width }) => {
  const pageRef = useRef<HTMLDivElement>(null)
  const aspectRatio = useRef<number>(0)

  const [showImage, changeStatus] = useState<boolean>(false)
  const [isLoading, changeLoadingState] = useState<boolean>(true)

  const router = useRouter()


  useEffect(() => {
    changeStatus(false)
    changeLoadingState(true)
  }, [router.query.chapterNumber])

  useEffect(() => {

    function intersectCallback(entries: any, observer: any) {
      entries.forEach((entry: any, index: number) => {
        if (entry.target === pageRef.current) {
          if (entry.isIntersecting && showImage === false) {
            changeStatus(true)
          }
        }
      })
    }

    let observer: IntersectionObserver | null = null

    if (pageRef.current !== null) {
      const options = {
        root: null,
        rootMargin: "10px",
        threshold: 0.0,
      }

      observer = new IntersectionObserver(intersectCallback, options)

      observer.observe(pageRef.current)
    }

    return () => {
      observer?.disconnect()
    }
  }, [])


  const handleLoadingStatus = ({ naturalWidth, naturalHeight}: { naturalWidth: number, naturalHeight: number }) => {
    changeLoadingState(false)

    const aspRatio = naturalHeight / naturalWidth
    
    aspectRatio.current = aspRatio
  }

  return (
    <div
      ref={pageRef}
      className={style.page}
      data-pagenumber={pageNumber}  
      style={{
        width: `${width}px`,
        height: `${width * aspectRatio.current}px`,
      }}
    >
      { 
        showImage ?
        (
          <>
            <Image
              src={`${url}`}
              alt={`page number ${pageNumber}`}
              layout="fill"
              objectFit="cover"
              onLoadingComplete={handleLoadingStatus}
              priority
            />

            {
              isLoading ?
                <div className={style.imageLoader}>
                  <CircularLoading width={50} height={50} strokeColor={"#9b59b6"} />
                </div>
              : null
            }
          </>
        )
        : <CircularLoading width={50} height={50} strokeColor={"gray"} />
      }
    </div>
  )
}

interface PagesProps {
  pages: any;
}

const Pages: FC<PagesProps> = ({ pages }) => {

  const [innerWidth, changeWidth] = useState<number>(800)


  useEffect(() => {

    const setWidth = () => {
      if (window.innerWidth > 800) {
        changeWidth(800)
        return
      }

      changeWidth(window.innerWidth)
    }
    
     // change the width
     setWidth()

    function resizeHandler(event: any) {
      setWidth()
    }

    window.addEventListener('resize', resizeHandler, false)

    return () => {
      window.removeEventListener('resize', resizeHandler, false)
    }
  }, [])


  if (pages === null)
    return (
      <div className={style.pagesContainer}>
        <CircularLoading width={20} height={20} strokeColor={"gray"} />
      </div>
    )
  
  return (
    <div className={style.pagesContainer}>
      {
        Array.from<string>(pages.chapter.data).map((item: string, index: number) => (
          <Page
            url={`${pages.baseUrl}/data/${pages.chapter.hash}/${item}`}
            key={index}
            pageNumber={index}
            width={innerWidth}
          />
        ))
      }
    </div>
  );
};

interface ChaptersProps {
  chapter: any,
  data: any,
}

const ChapterList: FC<ChaptersProps> = ({ chapter, data }) => {
  const router = useRouter()
  const { id } = router.query
  const [openChapters, toggleChapters] = useState<boolean>(false)

  const handleToggle = () => {
    toggleChapters(!openChapters)
  }

  return (
    <div className={style.chapterWrapper}>
      <button
        type="button"
        className={style.chapterButton}
        onClick={handleToggle}
      >
        Chapters
      </button>
      <div className={style.chapterContainer}>
      {
        openChapters ?
        (
          Array.from(Object.keys(data)).map((item: string, index: number) => (
            <div
              key={index}
              className={`${style.chaptersItem} ${chapter.attributes.chapter === item ? style.active : ""}`}
            >
              <Link href={`/manga/${id}/read_chapter/${item}`}>
                {`Chapter ${item}`}
              </Link>
            </div>
          ))
        )
        : null
      }
      </div>
    </div>
  )
}


interface Props {
  chapter: any;
  data: any;
}

const ChapterPages: FC<Props> = ({ chapter, data }) => {
  const [pages, changePage] = useState<any>(null);

  useEffect(() => {
    const fetchPages = async (chapterId: string): Promise<any> => {
      const response = await fetch(
        `/api/pages/${chapterId}`,
        {
          mode: "cors",
          credentials: "include",
        }
      );

      const res = await response.json();

      return res;
    };

    if (chapter !== null) {
      fetchPages(chapter.id)
        .then((response) => {
          const res = response.data

          if (res.result === "ok") {
            changePage(res);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [chapter]);

  return (
    <div className={style.pagesWrapper}>
      <Heading />
      <ChapterHeading chapter={chapter} />
      <NavButtons chapter={chapter} data={data} />
      <Pages pages={pages}/>
      <NavButtons chapter={chapter} data={data} />
      <ChapterList chapter={chapter} data={data}/>
    </div>
  );
};

export default ChapterPages;
