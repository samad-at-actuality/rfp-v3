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
      <style>{`
.__markdow_displayer_actuality{ 
  strong {
    font-weight:750;
  }
  hr {
    margin-top:1rem;
    margin-bottom:1rem;
    background-color:black;
  }
  hr:nth-last-of-type(-n+3) {
    background-color: transparent;
    height: 1px;
    opacity:0; 
  }
  ul { list-style-type: disc; margin-left:30px; }
  p,li {
    font-size:14px;
  }
  h1 {
    font-size:22px;
    font-weight:800;
    margin-bottom:1.2rem;
  }
  h2 {
    font-size:18px;
    font-weight:700;
    margin-bottom:1rem;
  }    
}
h3 {
  font-size:16px;
  font-weight:600;
  margin-bottom:0.8rem;
}            
h4 {
  font-size:14px;
  font-weight:600;
  margin-bottom:0.6rem;
}
h5 {
  font-size:14px;
  font-weight:600;
  margin-bottom:0.5rem;
}
h6 {
  font-size:12px;
  font-weight:600;
  margin-bottom:0.4rem;
}
  li {
    margin-bottom:0.6rem; 
  }
  p{
    margin-bottom: 0.5rem;
  }   
  blockquote {
    border-left: 4px solid #d1d5db; 
    padding-left: 1rem;
    margin: 0.8rem 0;
    color: #4b5563;
    font-style: italic;
    background-color: #f9fafb;
  }

/* Table styles */
table {
  font-size:14px;
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}
th,td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}
th {
  background-color: #f9fafb;
  font-weight: 600;
}
tr:nth-child(even) td {
  background-color: #f3f4f6;
}
blockquote {
  border-left: 4px solid #3b82f6; /* blue accent */
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  background-color: #f0f9ff; /* light blue background */
  border-radius: 6px;
  color: #1e3a8a; /* darker blue text */
  font-style: italic;
}
blockquote strong {
  font-style: normal; /* keep bold readable */
  font-weight: 600;
  color: #111827; /* neutral dark for emphasis */
}

`}</style>
    </div>
  );
};
