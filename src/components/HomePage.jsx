import { Link } from "react-router-dom"; // if you're using React Router
// If you're using Next.js, replace with `import Link from "next/link"`

function HomePage() {
  return (
    <div className="min-h-screen bg-[#1E1B2E] flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md bg-[#2A2438] border-b border-[#9D4EDD]/20">
        <h1 className="text-2xl font-bold text-[#FFB703]">Job Atlas</h1>
        <nav className="flex space-x-6 text-[#E9ECEF] font-medium">
          <Link to="/" className="hover:text-[#FFB703] transition">Home</Link>
          <Link to="/graph" className="hover:text-[#FFB703] transition">Graph</Link>
          <a href="#about" className="hover:text-[#FFB703] transition">About</a>
          <a href="#contact" className="hover:text-[#FFB703] transition">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-extrabold text-[#E9ECEF] mb-6">
          Explore Relationships Through Data
        </h2>
        <p className="max-w-2xl text-lg text-[#E9ECEF]/80 mb-8">
          Welcome to Job Atlas visualization platform. Discover how 
          occupations, skills, and communities connect using interactive graphs.
        </p>
        <Link
          to="/graph"
          className="px-6 py-3 bg-[#FFB703] text-[#1E1B2E] font-semibold rounded-lg shadow hover:bg-[#FFB703]/90 transition"
        >
          Launch Graph Viewer
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#2A2438] py-16 px-6 text-center">
        <h3 className="text-3xl font-bold text-[#E9ECEF] mb-4">About Tabiya</h3>
        <p className="max-w-3xl mx-auto text-[#E9ECEF]/80">
          Job Atlas is about building meaningful connections. Our
          platform helps visualize and analyze how occupations and skills are
          interlinked, empowering communities with data-driven insights.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#1E1B2E] text-center">
        <h3 className="text-3xl font-bold text-[#E9ECEF] mb-8">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl shadow bg-[#2A2438] border border-[#9D4EDD]/20">
            <h4 className="text-xl font-semibold mb-2 text-[#9D4EDD]">Interactive Graphs</h4>
            <p className="text-[#E9ECEF]/80">
              Explore connections with a responsive graph viewer powered by
              Cytoscape & Sigma.js.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow bg-[#2A2438] border border-[#9D4EDD]/20">
            <h4 className="text-xl font-semibold mb-2 text-[#9D4EDD]">Data Insights</h4>
            <p className="text-[#E9ECEF]/80">
              Gain insights into occupations, skills, and relationships that
              matter most.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow bg-[#2A2438] border border-[#9D4EDD]/20">
            <h4 className="text-xl font-semibold mb-2 text-[#9D4EDD]">Community Impact</h4>
            <p className="text-[#E9ECEF]/80">
              Contribute to solving real challenges by understanding complex
              networks.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#9D4EDD] py-16 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
        <p className="mb-6">
          Have questions or ideas? Reach out to us and join the movement.
        </p>
        <a
          href="mailto:tabiya@challenge.com"
          className="px-6 py-3 bg-[#FFB703] text-[#1E1B2E] font-semibold rounded-lg shadow hover:bg-[#FFB703]/90 transition"
        >
          Contact Us
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1B2E] text-[#E9ECEF]/60 py-6 text-center border-t border-[#9D4EDD]/20">
        <p>© {new Date().getFullYear()} Powered by Tabiya. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
