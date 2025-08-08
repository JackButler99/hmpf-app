export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Contact Us</h1>
      <p className="text-gray-700 text-lg mb-6">
        We'd love to hear from you! Whether you have a question, idea, or want to collaborate, feel free to reach out.
      </p>

      <form className="space-y-6 bg-white shadow-md p-6 rounded">
        <div>
          <label className="block text-gray-600 mb-2">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-4 py-2" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-4 py-2" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-gray-600 mb-2">Message</label>
          <textarea className="w-full border border-gray-300 rounded px-4 py-2" rows={5} placeholder="Write your message..." />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Send Message
        </button>
      </form>
    </main>
  )
}
