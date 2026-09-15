import style from './modalbutton.module.scss'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from '@/assets/icons/loader.svg'

interface ModalButtonProps {
  text: string
  isLoading: boolean
  isActive: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

const ModalButton = ({ text, isLoading, isActive, onClick, type = 'submit' }: ModalButtonProps) => {
  return (
    <button
      type={type}
      className={`${style.submitButton} ${isActive ? style.submitActive : ''}`}
      onClick={onClick}
      disabled={!isActive}
    >
      <div className={style.submitButton__content}>
        <AnimatePresence initial={false}>
          {isLoading ? (
            <motion.img
              key="loader"
              style={{ position: 'absolute' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              src={Loader}
              alt="Загрузка"
              className={style.loader}
            />
          ) : (
            <motion.span
              key="text"
              style={{ position: 'absolute' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </button>
  )
}

export default ModalButton
