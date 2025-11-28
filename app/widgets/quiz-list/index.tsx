import ListItem from './QuizListItem'
import { QuizData, QuizListResponse } from '../types'
import Quiz from '../quiz'
import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  ArrowRightLgIcon,
  ArrowLeftLgIcon,
  FolderOpenIcon,
} from '@/app/assets/icons'
import GPTButton from '@/app/components/GptButton'
import { useCallTool } from '@/app/hooks'
import { Skeleton } from '@/app/components/Skeleton'
import { cn } from '@/app/lib/cn'
import { useTranslation } from 'react-i18next'

const FRONTEND_PAGE_SIZE = 5 // 前端每页显示数量
const BACKEND_PAGE_SIZE = 20 // 后端每页返回数量

const QuizList = () => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [dataList, setDataList] = useState<QuizData[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const callTool = useCallTool()
  const { t } = useTranslation()
  // 计算总页数
  const totalPages = useMemo(
    () => Math.ceil(total / FRONTEND_PAGE_SIZE),
    [total]
  )

  // 计算需要加载到第几页后端数据
  const getRequiredBackendPage = useCallback((frontendPage: number) => {
    return Math.ceil((frontendPage * FRONTEND_PAGE_SIZE) / BACKEND_PAGE_SIZE)
  }, [])

  // 获取当前页应该显示的数据
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * FRONTEND_PAGE_SIZE
    const endIndex = startIndex + FRONTEND_PAGE_SIZE
    return dataList.slice(startIndex, endIndex)
  }, [currentPage, dataList])

  // 加载后端数据
  const getDataList = useCallback(
    async (backendPage: number) => {
      try {
        setFetchLoading(true)
        const res = (await callTool('fetch', {
          id: '/library/v1/quizzes',
          method: 'GET',
          queryParams: {
            page: String(backendPage),
            pageSize: String(BACKEND_PAGE_SIZE),
            wisebaseId: 'inbox',
          },
        })) as any

        if (res?.structuredContent?.response?.code === 0) {
          const data = res.structuredContent.response.data as QuizListResponse
          setTotal(Number(data.total))

          // 追加新数据并去重
          setDataList((prev) => {
            const newItems = data.items.map((item) => ({
              ...item.data,
              id: item.id,
            }))

            const existingIds = new Set(prev.map((item) => item.id))
            const uniqueNewItems = newItems.filter(
              (item) => !existingIds.has(item.id)
            )

            return [...prev, ...uniqueNewItems]
          })
        }
      } catch (error) {
        console.error('Failed to fetch quiz list:', error)
      } finally {
        setFetchLoading(false)
      }
    },
    [callTool]
  )

  // 初始加载
  useEffect(() => {
    getDataList(1)
  }, [getDataList])

  // 点击列表项
  const handleClickItem = useCallback((qd: QuizData) => {
    setCurrentQuiz(qd)
  }, [])

  // 返回列表
  const handleBackToList = useCallback(() => {
    setCurrentQuiz(null)
  }, [])

  // 上一页
  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  // 下一页
  const handleNext = useCallback(async () => {
    if (currentPage >= totalPages) return

    const nextPage = currentPage + 1
    const requiredBackendPage = getRequiredBackendPage(nextPage)
    const loadedBackendPages = Math.ceil(dataList.length / BACKEND_PAGE_SIZE)

    // 如果需要的数据还没加载，先请求后端
    if (requiredBackendPage > loadedBackendPages) {
      await getDataList(requiredBackendPage)
    }

    setCurrentPage(nextPage)
  }, [
    currentPage,
    totalPages,
    dataList.length,
    getRequiredBackendPage,
    getDataList,
  ])

  // 空状态
  if (dataList.length === 0 && fetchLoading) {
    return <Skeleton />
  }

  // 显示单个 Quiz
  if (currentQuiz) {
    return (
      <Quiz
        isFromList
        quizDataFromList={currentQuiz}
        onClickBackToList={handleBackToList}
      />
    )
  }

  // 显示列表
  return (
    <div className="flex flex-col w-full h-[475px] bg-bg-primary">
      {/* 头部 */}
      <div
        className={cn('p-[16px_10px_16px_16px]', {
          'border-solid border-b-[1px] border-border-heavy':
            currentPageData.length === 0,
        })}
      >
        <span className="text-text-primary text-[17px] font-[500]">
          {t('quiz.my-quiz')}
        </span>
        <span className="text-text-secondary text-[14px] font-[500]">
          {' '}
          ({total})
        </span>
      </div>

      {/* 列表内容 */}
      <div className="flex-1 overflow-y-auto">
        {dataList.length > 0 ? (
          dataList.map((item) => (
            <ListItem key={item.id} item={item} onClick={handleClickItem} />
          ))
        ) : (
          <div className="flex-center flex-col gap-y-4 size-full">
            <div className="p-2 bg-bg-elevated-secondary rounded-[10px] flex-center">
              <FolderOpenIcon size={24} />
            </div>
            <span className="text-[14px] text-text-secondary">
              {t('quiz.no-file')}
            </span>
          </div>
        )}
      </div>

      {/* 分页控制 */}
      {dataList.length > 0 ? (
        <div className="flex items-center justify-between p-[12px_10px_12px_12px] border-t-[1px] border-solid border-border-heavy">
          <div className="text-text-secondary text-[14px]">
            {currentPage} / {totalPages || 1}
          </div>
          <div className="flex gap-x-1">
            <GPTButton
              variant="text"
              disabled={currentPage === 1 || fetchLoading}
              icon={<ArrowLeftLgIcon />}
              onClick={handlePrev}
            />
            <GPTButton
              variant="text"
              disabled={currentPage >= totalPages || fetchLoading}
              icon={<ArrowRightLgIcon />}
              loading={fetchLoading}
              onClick={handleNext}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default QuizList
