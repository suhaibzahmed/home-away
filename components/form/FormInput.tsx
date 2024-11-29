import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormInputProps = {
  name: string
  type: string
  label?: string
  placeholder?: string
  defaultValue?: string
}

function FormInput(props: FormInputProps) {
  const { name, type, label, placeholder, defaultValue } = props

  return (
    <div className="mb-2">
      <Label htmlFor={name} className=" capitalize">
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required
      />
    </div>
  )
}
export default FormInput
