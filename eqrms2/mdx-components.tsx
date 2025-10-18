import type { MDXComponents } from 'mdx/types'
import AlertBox from '@/components/uiBlocks/AlertBox'
import TextHighlight from '@/components/uiBlocks/TextHighlight'
import HTML from '@/components/uiBlocks/HTML'
import Image from '@/components/uiBlocks/Image'
 
const components: MDXComponents = {
  AlertBox,
  TextHighlight,
  HTML,
  Image,
  // Add more global MDX components here
}
 
export function useMDXComponents(): MDXComponents {
  return components
}