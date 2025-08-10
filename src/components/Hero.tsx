import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
             style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="absolute inset-0 bg-black/65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_70%,transparent,rgba(0,0,0,0))]" />

      <div className="relative z-10 max-w-5xl px-6 py-20 text-center text-white">
        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">MASTER YOUR FIGHT</h1>
        <p className="mx-auto mt-5 max-w-3xl text-white/90 md:text-lg">
          From gloves to gis, gear up with our premium martial arts kit designed for champions.
        </p>

        <Link href="/shop" className="mt-8 inline-block rounded-md bg-red-600 px-8 py-4 font-bold tracking-wide hover:bg-red-700">
          SHOP NOW
        </Link>
      </div>
    </section>
  )
}
