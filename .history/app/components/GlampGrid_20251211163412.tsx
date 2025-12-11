import GlampCard from './GlampCard'

interface Glamp {
  id: string
  name: string
  image: string
  description: string
  capacity: number
  price: string | number
  amenities: string[]
}

interface GlampGridProps {
  glamps: Glamp[]
}

export default function GlampGrid({ glamps }: GlampGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {glamps.map((glamp) => (
        <GlampCard key={glamp.id} {...glamp} />
      ))}
    </div>
  )
}
