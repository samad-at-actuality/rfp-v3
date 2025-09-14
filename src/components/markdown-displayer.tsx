import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export const MarkdownDisplayer = ({ markdown }: { markdown: string }) => {
  return (
    <div className='__markdow_displayer_actuality'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _node, ...props }) => <table {...props} />,
          thead: ({ node: _node, ...props }) => <thead {...props} />,
          tbody: ({ node: _node, ...props }) => <tbody {...props} />,
          tr: ({ node: _node, ...props }) => <tr {...props} />,
          th: ({ node: _node, ...props }) => <th {...props} />,
          td: ({ node: _node, ...props }) => <td {...props} />,
          blockquote: ({ node: _node, ...props }) => <blockquote {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
