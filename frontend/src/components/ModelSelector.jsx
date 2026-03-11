import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiCheck, FiZap } from 'react-icons/fi'
import useChatStore from '../context/chatStore'

const MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    desc: 'Fast & efficient',
    icon: '⚡'
  },
  {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    desc: 'Most capable',
    icon: '🧠'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 1.0 Pro',
    desc: 'Stable version',
    icon: '✨'
  }
]

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedModel, setModel } = useChatStore()
  const ref = useRef(null)

  const current = MODELS.find(m => m.id === selectedModel) || MODELS[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="model-selector" ref={ref}>
      <button
        className="model-selector-btn"
        onClick={() => setIsOpen(p => !p)}
      >
        <span>{current.icon}</span>
        <span>{current.name}</span>
        <FiChevronDown size={14} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {isOpen && (
        <div className="model-dropdown">
          {MODELS.map(model => (
            <button
              key={model.id}
              className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
              onClick={() => { setModel(model.id); setIsOpen(false) }}
            >
              <span style={{ fontSize: '1.1rem' }}>{model.icon}</span>
              <div>
                <div className="model-option-name">{model.name}</div>
                <div className="model-option-desc">{model.desc}</div>
              </div>
              {selectedModel === model.id && <FiCheck size={14} className="model-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
