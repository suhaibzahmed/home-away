import { SubmitButton } from '@/components/form/Buttons'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import ImageInputContainer from '@/components/form/ImageInputContainer'
import {
  fetchProfile,
  updateProfileAction,
  updateProfileImageAction,
} from '@/utils/actions'

async function ProfilePage() {
  const user = await fetchProfile()

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">user profile</h1>
      <div className="border p-8 rounded-md ">
        <ImageInputContainer
          image={user.profileImage}
          action={updateProfileImageAction}
          text="update profile image"
          name={user.username}
        />
        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="firstName"
              type="text"
              label="first name"
              defaultValue={user?.firstName}
            />
            <FormInput
              name="lastName"
              type="text"
              label="last name"
              defaultValue={user.lastName}
            />
            <FormInput
              name="username"
              type="text"
              label="username"
              defaultValue={user.username}
            />
          </div>
          <SubmitButton text="update profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  )
}
export default ProfilePage
