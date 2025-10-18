export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl">
        {children}
      </div>
    </div>
  );
}

