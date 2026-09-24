let scrollLocks = 0
let previousOverflow = ''

export function lockBodyScroll() {
  if (scrollLocks === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLocks += 1

  return () => {
    scrollLocks -= 1
    if (scrollLocks === 0) document.body.style.overflow = previousOverflow
  }
}
