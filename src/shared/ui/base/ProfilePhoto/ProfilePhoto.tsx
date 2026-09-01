import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
} from 'react'
import { Icon } from '@iconify/react'
import style from './profilephoto.module.scss'
import './variables.css'

interface ProfilePhotoProps {
  photo?: string
  size?: number
  onUpload?: (file: File) => Promise<void> | void
}

const ProfilePhoto = ({
                        photo,
                        size = 160,
                        onUpload,
                      }: ProfilePhotoProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(photo)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const fakeUpload = async (file: File) => {
    await new Promise(r => setTimeout(r, 1000))
    console.log(file.name)
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreview(url)

    if (onUpload) await onUpload(file)
    else await fakeUpload(file)
  }

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const iconSize = size * 0.42

  return (
    <div
      className={style.profilePhoto}
      style={{
        width: size,
        height: size,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE STATE */}
      <div
        className={[
          style.state,
          style.stateImage,
          isHovered ? style.hidden : '',
        ].join(' ')}
      >
        {preview ? (
          <img
            src={preview}
            className={style.image}
            alt="profile"
          />
        ) : (
          <Icon
            icon="ic:sharp-face-2"
            style={{ fontSize: iconSize }}
          />
        )}
      </div>

      <div
        className={[
          style.state,
          style.stateHover,
          isHovered ? '' : style.hidden,
        ].join(' ')}
      >
        <Icon
          icon="ic:round-photo-camera"
          style={{ fontSize: iconSize }}
        />
        <span className={style.text}>
          Добавить фото
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={style.input}
        onChange={handleChange}
      />
    </div>
  )
}

export default ProfilePhoto