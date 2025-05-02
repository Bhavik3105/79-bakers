export default function Contact() {
  return (
    <>

      <main className="min-h-screen p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <form className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md text-left space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              rows="5"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition"
          >
            Send Message
          </button>
        </form>
      </main>

    </>
  );
}
