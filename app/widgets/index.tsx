'use client'

import { useWidgetProps } from '@/app/hooks'
import Quiz from './quiz'
import QuizList from './quiz-list'
import useMounted from '../hooks/use-mount'
import { Skeleton } from '../components/Skeleton'

const WIDGETS: Record<string, React.ComponentType> = {
  quiz: Quiz,
  'quiz-list': QuizList,
}

const DEFAULT_WIDGET = 'quiz'

const WidgetSelector = () => {
  const widgetProps = useWidgetProps<{ type?: string }>()
  const isMounted = useMounted()

  const widgetType = widgetProps?.type || DEFAULT_WIDGET

  const WidgetComponent = WIDGETS[widgetType]

  if (!WidgetComponent || !isMounted) {
    return <Skeleton />
  }

  return <WidgetComponent />
}

export default WidgetSelector
