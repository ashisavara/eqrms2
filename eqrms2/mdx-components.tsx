import type { MDXComponents } from 'mdx/types'
import AlertBox from '@/components/uiBlocks/AlertBox'
import TextHighlight from '@/components/uiBlocks/TextHighlight'
import HTML from '@/components/uiBlocks/HTML'
import Image from '@/components/uiBlocks/Image'
import InfoCard from '@/components/uiBlocks/InfoCard'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import TopFundListPublic from '@/components/uiBlocks/TopFundListPublic'
import TopFundAutoPublic from '@/components/uiBlocks/TopFundAutoPublic'
 
const components: MDXComponents = {
  AlertBox,
  TextHighlight,
  HTML,
  Image,
  InfoCard,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  TopFundListPublic,
  TopFundAutoPublic,
  // Add more global MDX components here
}
 
export function useMDXComponents(): MDXComponents {
  return components
}