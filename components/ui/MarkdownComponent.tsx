'use client'
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';

const MarkdownComponent = ({mdUrl}: {mdUrl: string}) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(mdUrl)
      .then((response) => response.text())
      .then((text) => setMarkdown(text))
      .catch((error) => console.error('Error fetching privacy policy:', error));
  }, []);

  return (
    <article className="markdown-body p-6 rounded border border-gray-500">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </article>
  );
};

export default MarkdownComponent;