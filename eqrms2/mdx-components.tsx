import type { MDXComponents } from 'mdx/types'
import RedContainer from '@/components/uiBlocks/red-Container'
 
const components: MDXComponents = {
  RedContainer,
  // Add more global MDX components here
}
 
export function useMDXComponents(): MDXComponents {
  return components
}