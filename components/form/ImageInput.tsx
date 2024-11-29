import { Input } from '../ui/input'
import { Label } from '../ui/label'

function ImageInput() {
  const name = 'image'

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        image
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        required
        accept="image/*"
        className="max-w-xs"
      />
    </div>
  )
}
export default ImageInput
