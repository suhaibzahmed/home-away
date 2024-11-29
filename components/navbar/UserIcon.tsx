import { fetchProfileImage } from '@/utils/actions'
import Image from 'next/image'
import { LuUser2 } from 'react-icons/lu'

async function UserIcon() {
  const profileImg = await fetchProfileImage()

  if (profileImg) {
    return (
      <Image
        src={profileImg}
        alt="user"
        width={24}
        height={24}
        className="h-6 w-6 rounded-full object-cover"
      />
    )
  }
  return <LuUser2 className="w-6 h-6 bg-primary rounded-full text-white" />
}

export default UserIcon
