export default function NewWordPage() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">New Word</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Add a new inside joke or expression
        </p>
      </header>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Word / Expression
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="e.g. The Incident"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Meaning
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="What does it mean?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Coined by
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Who came up with it?"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg py-3 font-medium"
        >
          Save
        </button>
      </form>
    </div>
  )
}
