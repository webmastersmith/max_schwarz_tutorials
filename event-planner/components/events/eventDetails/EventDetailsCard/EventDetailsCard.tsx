import styles from './EventDetailsCard.module.scss'
import { EventImage, EventText } from 'components'

interface AppProps {
  title: string
  image: string
  location: string
  date: string
}

export const EventDetailsCard = ({
  title,
  image,
  location,
  date,
}: AppProps): JSX.Element => {
  return (
    <div className={styles.card}>
      <EventImage image={image} title={title} />
      <EventText date={date} location={location} />
    </div>
  )
}
