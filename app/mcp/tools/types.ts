// MCP Tool 共享类型定义

export type ContentWidget = {
  id: string
  title: string
  templateUri: string
  invoking: string
  invoked: string
  html: string
  description: string
  widgetDomain: string
}

export function widgetMeta(widget: ContentWidget) {
  return {
    'openai/outputTemplate': widget.templateUri,
    'openai/toolInvocation/invoking': widget.invoking,
    'openai/toolInvocation/invoked': widget.invoked,
    'openai/widgetAccessible': true,
    'openai/resultCanProduceWidget': true,
  } as const
}
