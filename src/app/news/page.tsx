export default function NewsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Latest News</h1>
      <p className="text-gray-700 text-lg">
        Stay informed with the latest updates and announcements from HMPF. We publish news about events,
        research, and organizational activities here.
      </p>
      {/* Placeholder for future articles */}
      <div className="mt-10 space-y-4">
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-2xl font-semibold">Example News Title</h2>
          <p className="text-gray-600 mt-2">Short summary of the news article goes here.</p>
        </div>
      </div>
    </main>
  )
}
