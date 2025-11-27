declare module '*.svg' {
  import { FC, SVGProps } from 'react'

  interface CustomSVGProps extends Omit<
    SVGProps<SVGSVGElement>,
    'width' | 'height'
  > {
    size?: number | string
    color?: string
  }

  const content: FC<CustomSVGProps>
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}

declare module '*.svg?raw' {
  const content: string
  export default content
}
