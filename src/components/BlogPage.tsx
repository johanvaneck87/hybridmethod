export function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-orange">Blog</h1>
        <div className="space-y-6">
          <p className="text-lg md:text-xl text-gray-300">
            Insights, tips, and stories about fitness and training.
          </p>
          {/* Add blog content here */}
        </div>
      </div>
    </div>
  )
}
