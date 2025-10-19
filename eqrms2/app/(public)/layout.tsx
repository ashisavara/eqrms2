export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-gray-100 border-b p-4">
        <div className="max-w-7xl mx-auto">Hello World</div>
      </div>
      {children}
    </div>
  );
}

