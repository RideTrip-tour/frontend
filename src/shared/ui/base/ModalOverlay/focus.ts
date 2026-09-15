const FOCUSABLE_SELECTOR = [
  'a[href]', 'area[href]', 'button', 'input', 'select', 'textarea',
  'summary', '[tabindex]', '[contenteditable="true"]',
].join(',')

function canTabTo(element: HTMLElement) {
  const tabIndex = element.isContentEditable && !element.hasAttribute('tabindex')
    ? 0
    : element.tabIndex
  return tabIndex >= 0 &&
    !element.matches(':disabled, input[type="hidden"], [data-modal-backdrop]') &&
    !element.closest('[inert], [hidden]') &&
    getComputedStyle(element).visibility === 'visible' &&
    element.getClientRects().length > 0
}

function isRadioTabStop(element: HTMLElement, candidates: HTMLElement[]) {
  if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name) return true
  const group = candidates.filter((candidate): candidate is HTMLInputElement =>
    candidate instanceof HTMLInputElement && candidate.type === 'radio' &&
    candidate.name === element.name && candidate.form === element.form,
  )
  return element === (group.find(radio => radio.checked) ?? group[0])
}

export function getTabStops(dialog: HTMLDialogElement) {
  const candidates = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(canTabTo)
  return candidates.filter(element => isRadioTabStop(element, candidates)).sort((a, b) => {
    const aOrder = a.tabIndex > 0 ? a.tabIndex : Number.MAX_SAFE_INTEGER
    const bOrder = b.tabIndex > 0 ? b.tabIndex : Number.MAX_SAFE_INTEGER
    return aOrder - bOrder
  })
}

export function focusInitialElement(dialog: HTMLDialogElement, preferred?: HTMLElement | null) {
  if (preferred && dialog.contains(preferred)) preferred.focus({ preventScroll: true })
  if (preferred && dialog.ownerDocument.activeElement === preferred) return
  const target = getTabStops(dialog)[0] ?? dialog
  target.focus({ preventScroll: true })
}

export function trapTabKey(dialog: HTMLDialogElement, shiftKey: boolean) {
  const stops = getTabStops(dialog)
  const first = stops[0]
  const last = stops.at(-1)
  const active = dialog.ownerDocument.activeElement
  if (!first || !last) {
    dialog.focus({ preventScroll: true })
    return true
  }
  if (!stops.some(element => element === active)) {
    ;(shiftKey ? last : first).focus({ preventScroll: true })
    return true
  }
  if (shiftKey && active === first) {
    last.focus({ preventScroll: true })
    return true
  }
  if (!shiftKey && active === last) {
    first.focus({ preventScroll: true })
    return true
  }
  return false
}
