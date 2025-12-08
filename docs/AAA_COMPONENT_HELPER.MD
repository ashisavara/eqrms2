### PAGE TITLES
<PageTitle title="Retiree Solutions" caption="Tax-efficient income with clarity on corpus sufficiency." />

### TEXT HIGHLIGHT
# perhaps include style options .. right now, only has one which is bold italic in border top & bottom
<TextHighlight> content here    </TextHighlight>

### HEADLINE TEXT BOX
# headline followed by some text
<HeadlineTextBox headline="headline here">
    content here
 </HeadlineTextBox>


### INFO CARDS
<InfoCard headline="Outsourced Family Office">content </InfoCard>

### HEADLINE TEXTBOK
<HeadlineTextBox headline="Our Vision"> 
    content 
</HeadlineTextBox>

### IMAGE CAROUSEL
import ImageCarousel from "@/components/uiComponents/image-carousel";

const images = [
  { src: "path1.jpg", alt: "Description 1" },
  { src: "path2.jpg", alt: "Description 2" },
  { src: "path3.jpg", alt: "Description 3" },
];

<ImageCarousel images={images} autoplay={true} autoplayInterval={4000}/>

### SECTION TEXT HIGHLIGHT
<SectionTextHighlight color={} className=""></SectionTextHighlight>


### ACCORDIONS

<Accordion type="single" collapsible>
    <AccordionItem value="item-1">
        <AccordionTrigger>Item 1 Text</AccordionTrigger>
        <AccordionContent>
        Item 1 content
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
        <AccordionTrigger>Item 2 Text</AccordionTrigger>
        <AccordionContent>
        Item 2 Content
        </AccordionContent>
    </AccordionItem>
</Accordion>