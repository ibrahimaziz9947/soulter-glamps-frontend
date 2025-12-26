/*'use client'

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
  console.log('[GlampGrid] Received', glamps.length, 'glamps')
  console.log('[GlampGrid] First glamp ID:', glamps[0]?.id)
  
  // ❌ REJECT DUMMY DATA: Strict UUID validation
  const validGlamps = glamps.filter(glamp => {
    const hasValidId = glamp.id && glamp.id !== 'undefined' && glamp.id !== 'null'
    const isUUID = glamp.id && glamp.id.includes('-') && glamp.id.length > 10
    const isNumericId = /^[0-9]+$/.test(glamp.id || '')
    
    if (!hasValidId) {
      console.error('[GlampGrid] ❌ Invalid glamp detected:', {
        id: glamp.id,
        name: glamp.name,
        hasId: !!glamp.id
      })
      return false
    }
    
    if (isNumericId) {
      console.error('[GlampGrid] ❌ DUMMY GLAMP DETECTED:', {
        id: glamp.id,
        name: glamp.name
      })
      return false
    }
    
    if (!isUUID) {
      console.error('[GlampGrid] ❌ Not a valid UUID:', {
        id: glamp.id,
        name: glamp.name,
        hasHyphen: glamp.id?.includes('-')
      })
      return false
    }
    
    return true
  })
  
  console.log('[GlampGrid] ✅ Rendering', validGlamps.length, 'valid UUID glamps')
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {validGlamps.map((glamp) => (
        <GlampCard key={glamp.id} {...glamp} />
      ))}
    </div>
  )
} */







'use client'

import GlampCard from './GlampCard'

interface Glamp {
  id: string
  name: string
  image: string
  description: string
  capacity: number
  price: string | number
  features: string[]
}

interface GlampGridProps {
  glamps: Glamp[]
}

export default function GlampGrid({ glamps }: GlampGridProps) {
  const validGlamps = glamps.filter(glamp => {
    const isUUID = glamp.id?.includes('-') && glamp.id.length > 10
    const isNumeric = /^[0-9]+$/.test(glamp.id || '')
    return glamp.id && isUUID && !isNumeric
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {validGlamps.map(glamp => (
        <GlampCard key={glamp.id} {...glamp} />
      ))}
    </div>
  )
}
