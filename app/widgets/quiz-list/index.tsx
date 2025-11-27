import ListItem from './QuizListItem'
import mockData from '../../api/mock2.json'
import { QuizData } from '../types'
import Quiz from '../quiz'
import { useState } from 'react'
import { ArrowRightLgIcon, ArrowLeftLgIcon } from '@/app/assets/icons'
import GPTButton from '@/app/components/GptButton'

const QuizList = () => {
  const data = mockData.data

  const [currentQuiz, setCurrentQuiz] = useState<null | QuizData>(null)

  const handleClickItem = (qd: QuizData) => {
    setCurrentQuiz(qd)
  }

  return (
    <>
      {currentQuiz ? (
        <Quiz
          isFromList
          quizDataFromList={currentQuiz}
          onClickBackToList={() => setCurrentQuiz(null)}
        />
      ) : (
        <div className="flex flex-col w-full h-[475px] bg-bg-primary">
          <div className="p-[16px_10px_16px_16px]">
            <span className="text-text-primary text-[17px] font-[510]">
              My Quizzes
            </span>
            <span className="text-text-secondary text-[14px] font-[510]">
              {' '}
              ({data.total})
            </span>
          </div>
          <div className="flex-1">
            {data.data.map((item: QuizData, index) => {
              return (
                <ListItem onClick={handleClickItem} key={index} item={item} />
              )
            })}
          </div>
          <div className="flex items-center justify-between p-[16px_10px_12px_12px] border-t-[1px] border-solid border-border-heavy">
            <div className="text-text-secondary text-[16px]"> 1 / 24 </div>
            <div className="flex gap-x-[]">
              <span className="px-3 py-2 cursor-pointer text-interactive-icon-tertiary-interactive">
                <GPTButton variant="text" icon={<ArrowLeftLgIcon />} />
              </span>
              <span className="px-3 py-2 cursor-pointer">
                <GPTButton variant="text" icon={<ArrowRightLgIcon />} />
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QuizList
