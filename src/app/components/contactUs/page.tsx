import React from "react";

const ContactUs = () => {
  return (
    <div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-white">
        <h2 className="text-4xl font-bold text-center mb-10">Contact Us</h2>

        <div className="bg-white/80 rounded-2xl p-8 text-gray-800 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Lead captured! Email sent to Shreya.");
              // You can integrate email logic here using form backend or services like Formspree, Resend, etc.
            }}
            className="space-y-6"
          >
            <div>
              <label className="block mb-2 font-medium">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
            >
              Send Message
            </button>
          </form>

          <div className="mt-10 text-sm">
            <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
            <p><strong>Email:</strong> contact@example.com</p>
            <p><strong>Address:</strong> 123, Your Street, Your City, Country</p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="hover:underline text-blue-700">Facebook</a>
              <a href="#" className="hover:underline text-blue-700">Instagram</a>
              <a href="#" className="hover:underline text-blue-700">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
