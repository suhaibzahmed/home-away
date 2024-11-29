'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from './schemas'
import prisma from './db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { uploadImage } from './supabase'

const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) {
    throw new Error('You must be logged in to access this route')
  }
  if (!user.privateMetadata.hasProfile) redirect('/profile/create')

  return user
}

const renderError = (error: unknown): { message: string } => {
  console.log(error)
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  }
}

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await getAuthUser()

    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(profileSchema, rawData)

    await prisma.profile.create({
      data: {
        clerkId: user?.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? '',
        ...validatedFields,
      },
    })

    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    })
  } catch (error) {
    renderError(error)
  }

  redirect('/')
}

export const fetchProfileImage = async () => {
  const user = await currentUser()
  if (!user) return null

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  })

  return profile?.profileImage
}

export const fetchProfile = async () => {
  const user = await getAuthUser()

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  if (!profile) return redirect('/profile/create')

  return profile
}

export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const user = await getAuthUser()

    const rawData = Object.fromEntries(formData)
    const validatedFields = validateWithZodSchema(profileSchema, rawData)

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    })

    revalidatePath('/profile')

    return { message: 'Profile updated successfully' }
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}

export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()
  try {
    const image = formData.get('image') as File
    const validatedFields = validateWithZodSchema(imageSchema, { image })
    const fullPath = await uploadImage(validatedFields.image)
    await prisma.profile.update({
      where: { clerkId: user.id },
      data: {
        profileImage: fullPath,
      },
    })
    revalidatePath('/profile')
    return { message: 'Profile image updated' }
  } catch (error) {
    return renderError(error)
  }
}

export const createPropertyAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()
  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File

    const validatedFields = validateWithZodSchema(propertySchema, rawData)
    const validatedFile = validateWithZodSchema(imageSchema, { image: file })
    const fullPath = await uploadImage(validatedFile.image)

    // console.log(validatedFields, validatedFile)

    await prisma.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    })
  } catch (error) {
    return renderError(error)
  }

  redirect('/')
}

export const fetchProperties = async ({
  search = '',
  category,
}: {
  search?: string
  category?: string
}) => {
  const properties = await prisma.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      image: true,
      country: true,
      tagline: true,
      price: true,
    },
  })

  return properties
}

export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string
}) => {
  const user = await getAuthUser()
  const favorite = await prisma.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  })

  return favorite?.id || null
}

export const toggleFavoriteAction = async (prevState: {
  propertyId: string
  favoriteId: string | null
  pathname: string
}) => {
  const user = await getAuthUser()
  const { propertyId, favoriteId, pathname } = prevState
  try {
    if (favoriteId) {
      await prisma.favorite.delete({ where: { id: favoriteId } })
    } else {
      await prisma.favorite.create({ data: { propertyId, profileId: user.id } })
    }

    revalidatePath(pathname)
    return { message: favoriteId ? 'Removed from faves' : 'Added to faves' }
  } catch (error) {
    return renderError(error)
  }
}

export const fetchFavorites = async () => {
  const user = await getAuthUser()
  const favorites = await prisma.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          price: true,
          country: true,
          image: true,
        },
      },
    },
  })
  return favorites.map((favorite) => favorite.property)
}

export const fetchPropertyDetails = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { profile: true },
  })

  return property
}
