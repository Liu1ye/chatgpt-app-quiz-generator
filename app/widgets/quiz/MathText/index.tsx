'use client'

import { useEffect, useRef, useState, useMemo, useId } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathTextProps {
  text: string
  className?: string
}

interface ParsedPart {
  type: 'text' | 'math' | 'displayMath'
  content: string
}

/**
 * 解析文本中的数学公式
 * 支持 $$...$$ (块级公式) 和 $...$ (行内公式)
 */
function parseText(text: string): ParsedPart[] {
  const parts: ParsedPart[] = []
  let pos = 0

  while (pos < text.length) {
    // 检查块级公式 $$...$$
    const displayMathStart = text.indexOf('$$', pos)
    if (displayMathStart !== -1) {
      // 添加之前的文本
      if (displayMathStart > pos) {
        const textContent = text.slice(pos, displayMathStart)
        if (textContent) {
          parts.push({ type: 'text', content: textContent })
        }
      }

      // 查找结束标记
      const displayMathEnd = text.indexOf('$$', displayMathStart + 2)
      if (displayMathEnd !== -1) {
        const mathContent = text.slice(displayMathStart + 2, displayMathEnd)
        parts.push({ type: 'displayMath', content: mathContent })
        pos = displayMathEnd + 2
        continue
      }
    }

    // 检查行内公式 $...$
    const mathStart = text.indexOf('$', pos)
    if (mathStart !== -1 && mathStart !== displayMathStart) {
      // 添加之前的文本
      if (mathStart > pos) {
        const textContent = text.slice(pos, mathStart)
        if (textContent) {
          parts.push({ type: 'text', content: textContent })
        }
      }

      // 查找结束标记
      const mathEnd = text.indexOf('$', mathStart + 1)
      if (mathEnd !== -1) {
        const mathContent = text.slice(mathStart + 1, mathEnd)
        parts.push({ type: 'math', content: mathContent })
        pos = mathEnd + 1
        continue
      }
    }

    // 没有找到公式,添加剩余文本
    const remaining = text.slice(pos)
    if (remaining) {
      parts.push({ type: 'text', content: remaining })
    }
    break
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }]
}

/**
 * 数学公式渲染组件
 * 支持行内公式 $...$ 和块级公式 $$...$$
 * 示例:
 * - 行内公式: "这是一个公式 $e^{i\pi} + 1 = 0$ 在文本中"
 * - 块级公式: "$$e^{i\pi} + 1 = 0$$"
 */
const MathText = ({ text, className = '' }: MathTextProps) => {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const parts = useMemo(() => parseText(text), [text])

  // 使用 React 的 useId 生成稳定的 ID
  const uniqueId = useId()

  // 只在客户端渲染数学公式,避免水合错误
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // 只渲染当前容器内的数学公式
    const mathElements = containerRef.current.querySelectorAll('.math-formula')

    mathElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      const formula = htmlElement.dataset.formula
      const displayMode = htmlElement.dataset.display === 'true'

      if (formula && !htmlElement.hasAttribute('data-rendered')) {
        try {
          // 使用 renderToString 避免 quirks mode 问题
          const html = katex.renderToString(formula, {
            displayMode,
            throwOnError: false,
            output: 'html',
            strict: false,
          })
          htmlElement.innerHTML = html
          // 标记为已渲染
          htmlElement.setAttribute('data-rendered', 'true')
        } catch (error) {
          // 渲染失败时显示原始公式
          htmlElement.textContent = displayMode
            ? `$$${formula}$$`
            : `$${formula}$`
        }
      }
    })
  }, [mounted, text, parts])

  return (
    <div ref={containerRef} id={`math-${uniqueId}`} className={className}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={`${uniqueId}-${index}`}>{part.content}</span>
        }
        return (
          <span
            key={`${uniqueId}-${index}`}
            className="math-formula"
            data-formula={part.content}
            data-display={part.type === 'displayMath'}
            suppressHydrationWarning
          >
            {/* 服务端渲染原始文本,客户端会被 KaTeX 替换 */}
            {!mounted && part.content}
          </span>
        )
      })}
    </div>
  )
}

export default MathText
