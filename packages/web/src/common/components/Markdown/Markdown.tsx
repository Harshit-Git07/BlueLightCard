import { FC } from 'react';
import { MarkdownProps } from './types';
import { default as MarkdownToJsx } from 'markdown-to-jsx';

const Markdown: FC<MarkdownProps> = ({ content }) => {
  return <MarkdownToJsx>{content}</MarkdownToJsx>;
};

export default Markdown;
