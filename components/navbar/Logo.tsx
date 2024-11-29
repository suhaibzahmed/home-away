import Link from 'next/link'
import { Button } from '../ui/button'
import { LuTent } from 'react-icons/lu'

function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <LuTent className="h-6 w-6" />
      </Link>
    </Button>
  )
}
export default Logo
