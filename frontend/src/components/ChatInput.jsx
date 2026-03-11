import { useState, useRef, useEffect, useCallback } from 'react'
import { FiSend, FiPaperclip, FiMic, FiMicOff, FiX, FiFile, FiImage, FiSquare } from 'react-icons/fi'
import useChatStore from '../context/chatStore'

const readFileAsText = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = e => resolve(e.target.result)
  reader.onerror = reject
  if (file.type.startsWith('image/')) {
    reader.readAsDataURL(file)
  } else {
    reader.readAsText(file)
  }
})

export default function ChatInput() {
  const [text, setText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [attachedFile, setAttachedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  const { sendMessage, isTyping } = useChatStore()

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 200) + 'px'
    }
  }, [text])

  // Setup speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      const rec = new SR()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map(r => r[0].transcript)
          .join('')
        setText(transcript)
      }

      rec.onend = () => setIsRecording(false)
      rec.onerror = () => setIsRecording(false)

      recognitionRef.current = rec
    }
  }, [])

  const handleSubmit = async () => {
    const content = text.trim()
    if (!content && !attachedFile) return
    if (isTyping) return

    setText('')
    setAttachedFile(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    await sendMessage(content || '[File attached]', attachedFile)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFileSelect = async (file) => {
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')

    try {
      if (isPdf) {
        // For PDFs we just note the filename since we can't easily read binary
        setAttachedFile({
          name: file.name,
          type: file.type,
          content: `[PDF file: ${file.name}]`,
          isImage: false
        })
      } else {
        const content = await readFileAsText(file)
        setAttachedFile({
          name: file.name,
          type: file.type,
          content: isImage ? `[Image: ${file.name}]\n${content}` : content,
          isImage
        })
      }
    } catch (err) {
      console.error('File read error:', err)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser')
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const canSend = (text.trim().length > 0 || attachedFile) && !isTyping

  return (
    <div
      className="input-container"
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drop-overlay">
          <div className="drop-overlay-text">
            <FiFile size={28} />
            Drop file here
          </div>
        </div>
      )}

      {attachedFile && (
        <div className="file-preview-bar">
          <div className="file-chip">
            {attachedFile.isImage ? <FiImage size={13} /> : <FiFile size={13} />}
            <span>{attachedFile.name}</span>
            <button
              className="file-chip-remove"
              onClick={() => setAttachedFile(null)}
            >
              <FiX size={12} />
            </button>
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="Message AI..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isTyping}
      />

      <div className="input-actions">
        <div className="input-actions-left">
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            accept="image/*,.pdf,.txt,.md,.js,.py,.java,.ts,.jsx,.tsx,.css,.html,.json,.xml,.csv"
            onChange={e => handleFileSelect(e.target.files[0])}
          />
          <button
            className="input-action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <FiPaperclip size={16} />
          </button>

          <button
            className={`input-action-btn ${isRecording ? 'active voice-btn recording' : ''}`}
            onClick={toggleRecording}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? <FiMicOff size={16} /> : <FiMic size={16} />}
          </button>
        </div>

        {isTyping ? (
          <button
            className="stop-btn"
            onClick={() => {/* TODO: implement stop */}}
          >
            <FiSquare size={12} />
            Stop
          </button>
        ) : (
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={!canSend}
            title="Send message"
          >
            <FiSend size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
