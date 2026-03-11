import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FiCopy, FiCheck } from 'react-icons/fi'
import useThemeStore from '../context/themeStore'

export default function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)
  const { theme } = useThemeStore()

  const code = String(children).replace(/\n$/, '')

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-language">{language || 'code'}</span>
        <button
          className={`copy-code-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={theme === 'dark' ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'var(--bg-code)',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          borderRadius: 0,
        }}
        wrapLongLines={false}
        showLineNumbers={code.split('\n').length > 5}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
