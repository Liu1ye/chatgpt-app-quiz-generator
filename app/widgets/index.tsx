'use client';

import { useWidgetProps } from '@/app/hooks';
import Quiz from './quiz';
import QuizList from './quiz-list'

const WIDGETS: Record<string, React.ComponentType> = {
  'quiz': Quiz,
  'quiz-list': QuizList,
};

const DEFAULT_WIDGET = 'quiz';

const WidgetSelector = () => {
  const widgetProps = useWidgetProps<{ type?: string }>();

  const widgetType = widgetProps?.type || DEFAULT_WIDGET;

  const WidgetComponent = WIDGETS[widgetType];

  if (!WidgetComponent) {
    return (
      <></>
    );
  }

  return <WidgetComponent />;
};

export default WidgetSelector;
