import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { focusInitialElement, trapTabKey } from './focus'
import { lockBodyScroll } from './scrollLock'
import styles from './modaloverlay.module.scss'

interface ModalOverlayProps {
  readonly children: ReactNode
  readonly className?: string
  readonly variant?: 'default' | 'dimmed'
  readonly onClose?: () => void
  readonly lockScroll?: boolean
  readonly ariaLabel?: string
  readonly ariaLabelledBy?: string
  readonly ariaDescribedBy?: string
  readonly initialFocusRef?: RefObject<HTMLElement | null>
  readonly returnFocusRef?: RefObject<HTMLElement | null>
  readonly portalTarget?: HTMLElement
}

export default function ModalOverlay({
  children,
  className,
  variant = 'default',
  onClose,
  lockScroll = true,
  ariaLabel = 'Модальное окно',
  ariaLabelledBy,
  ariaDescribedBy,
  initialFocusRef,
  returnFocusRef,
  portalTarget,
}: ModalOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const focusOptions = useRef({ initialFocusRef, returnFocusRef })
  const target = portalTarget ?? (typeof document === 'undefined' ? null :
    document.getElementById('modal-root') ?? document.body)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = dialog.ownerDocument.activeElement
    const options = focusOptions.current
    dialog.showModal()
    focusInitialElement(dialog, options.initialFocusRef?.current)

    return () => {
      const hadFocus = dialog.contains(dialog.ownerDocument.activeElement)
      dialog.close()
      const restoreTarget = options.returnFocusRef?.current ?? previousFocus
      if (hadFocus && restoreTarget instanceof HTMLElement && restoreTarget.isConnected) {
        restoreTarget.focus({ preventScroll: true })
      }
    }
  }, [target])

  useEffect(() => {
    if (lockScroll && target) return lockBodyScroll()
  }, [lockScroll, target])

  if (!target) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className={[styles.overlay, variant === 'dimmed' ? styles.dimmed : '', className].filter(Boolean).join(' ')}
      aria-modal="true"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onCancel={event => {
        if (event.target !== event.currentTarget) return
        event.preventDefault()
        onClose?.()
      }}
      onKeyDown={event => {
        if (event.key !== 'Tab' || !event.currentTarget.contains(event.target as Node)) return
        if (trapTabKey(event.currentTarget, event.shiftKey)) event.preventDefault()
      }}
    >
      <button
        type="button"
        className={styles.backdrop}
        data-modal-backdrop
        aria-label="Закрыть модальное окно"
        tabIndex={-1}
        disabled={!onClose}
        onClick={onClose}
      />
      {children}
    </dialog>,
    target,
  )
}
