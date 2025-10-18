interface TextHighlightProps {
  children: React.ReactNode;
}

export default function TextHighlight({ children }: TextHighlightProps) {
  return (
    <div className="font-semibold italic border-t border-b border-gray-300 py-2 text-center">
      {children}
    </div>
  );
}
