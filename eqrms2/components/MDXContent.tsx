'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useMDXComponents } from '@/mdx-components';

interface MDXContentProps {
  mdxSource: MDXRemoteSerializeResult;
}

export function MDXContent({ mdxSource }: MDXContentProps) {
  const components = useMDXComponents() as Record<string, React.ComponentType<any>>;
  return <MDXRemote {...mdxSource} components={components} />;
}

