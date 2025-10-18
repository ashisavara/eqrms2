import Content from './content.mdx';

export default function BlogsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl">
        <Content />
      </div>
    </div>
  );
}

