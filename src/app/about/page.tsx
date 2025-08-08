export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">About Us</h1>
      <p className="text-gray-700 text-lg leading-relaxed">
        HMPF is a student organization focused on building impactful initiatives, 
        fostering collaboration, and applying physics in real-world contexts.
      </p>
      <div className="mt-8 text-gray-600">
        <ul className="list-disc pl-5 space-y-2">
          <li>Empowering members through leadership and innovation</li>
          <li>Bridging theory and practice in physics</li>
          <li>Collaborating with universities and industries</li>
        </ul>
      </div>
    </main>
  )
}
