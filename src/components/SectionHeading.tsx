export default function SectionHeading({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow?: string
  title: string
  className?: string
}) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        {title}
      </h2>
    </div>
  )
}
