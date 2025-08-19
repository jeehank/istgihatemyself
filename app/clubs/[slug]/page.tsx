import { clubs } from '@/data/clubs'
import { notFound } from 'next/navigation'
import ClubDetail from '@/components/ClubDetail'

interface ClubPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return clubs.map((club) => ({
    slug: club.slug,
  }))
}

export async function generateMetadata({ params }: ClubPageProps) {
  const club = clubs.find((club) => club.slug === params.slug)
  
  if (!club) {
    return {
      title: 'Club Not Found | X-CLUBS',
    }
  }

  return {
    title: `${club.name} | X-CLUBS`,
    description: club.description,
  }
}

export default function ClubPage({ params }: ClubPageProps) {
  const club = clubs.find((club) => club.slug === params.slug)

  if (!club) {
    notFound()
  }

  return <ClubDetail club={club} />
}
