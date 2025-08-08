export default function Hero() {
  return (
    <section className="pt-24 bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 text-center py-20">
        <h1 className="text-5xl font-bold text-blue-700 mb-6">
          Welcome to HMPF
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Empowering physics postgraduates to lead, create, and inspire.
        </p>
        <a
          href="#about"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Learn More
        </a>
      </div>
    </section>
  )
}
