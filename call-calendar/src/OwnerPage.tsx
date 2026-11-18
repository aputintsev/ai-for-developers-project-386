import MeetingTypeList from './MeetingTypeList'
import OwnerBookingList from './OwnerBookingList'

function OwnerPage() {
  return (
    <>
      <OwnerBookingList />
      <MeetingTypeList allowCreation />
    </>
  )
}

export default OwnerPage
