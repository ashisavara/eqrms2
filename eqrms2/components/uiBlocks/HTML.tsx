interface HTMLProps {
  children: string;
}

export default function HTML({ children }: HTMLProps) {
  return (
    <div dangerouslySetInnerHTML={{ __html: children }} />
  );
}
