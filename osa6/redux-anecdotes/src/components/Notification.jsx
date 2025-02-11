import { useSelector } from 'react-redux'

const Notification = () => {
  const currentNotification = useSelector((state) => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }
  if (!currentNotification) {
    return null
  }
  return <div style={style}>{currentNotification} </div>
}

export default Notification
