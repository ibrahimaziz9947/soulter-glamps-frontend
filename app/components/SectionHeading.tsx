interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeading({ title, subtitle, centered = false }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-green mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-light max-w-2xl ${centered ? 'mx-auto' : ''}">
          {subtitle}
        </p>
      )}
    </div>
  )
}
