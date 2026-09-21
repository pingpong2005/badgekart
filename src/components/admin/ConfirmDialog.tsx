import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  busy?: boolean
}

export function ConfirmDialog({ title, message, confirmLabel = 'Yes, delete', onConfirm, onCancel, busy = false }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onCancel() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onCancel])
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}>
    <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <button className="icon-btn dialog-close" type="button" onClick={onCancel} aria-label="Close confirmation"><X size={19} /></button>
      <span className="dialog-icon"><AlertTriangle size={25} /></span>
      <h2 id="confirm-title">{title}</h2>
      <p id="confirm-message">{message}</p>
      <div className="dialog-actions"><button ref={cancelRef} className="btn btn-secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className="btn btn-danger" type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button></div>
    </section>
  </div>
}
