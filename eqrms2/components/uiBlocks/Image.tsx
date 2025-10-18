interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export default function Image({ src, alt, caption, width, height }: ImageProps) {
  // Construct the full Supabase Storage URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/blog${src}`;

  return (
    <figure className="my-4">
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto rounded-lg shadow-sm"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 text-center mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
