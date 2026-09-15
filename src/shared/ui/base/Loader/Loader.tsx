import './variables.css'

interface LoaderProps {
  size?: number
  color?: string
  borderWidth?: number
  invisibleColor?: string
}

const Loader = ({
                  size = 40,
                  color = '#007bff',
                  borderWidth = 4,
                  invisibleColor = 'transparent'
                }: LoaderProps) => {
  return (
    <div className="loader">
      <div
        className="loader__spinner"
        style={{
          width: size,
          height: size,
          border: `${borderWidth}px solid ${color}`,
          borderTopColor: invisibleColor
        }}
      />
    </div>
  )
}

export default Loader
