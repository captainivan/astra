import Image from "next/image";

const Footer = () => {
  const exploreLinks = ["Movies", "Series", "Trending", "Genres"];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-[#09090F] px-3 pt-12 text-[#F9FAFB] md:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-140px] bottom-[-140px] h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Top CTA */}
        <div className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-[#111827]/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8 lg:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#A855F7]">
                  Premium Streaming
                </span>

                <span className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#3B82F6]">
                  Movies & TV
                </span>
              </div>

              <h2 className="font-heading max-w-3xl text-4xl leading-none tracking-wide text-[#F9FAFB] sm:text-5xl lg:text-6xl">
                Find Your Next Watch Faster
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
                Browse trending movies, top rated TV series, genre collections,
                and fresh releases with a clean cinematic experience.
              </p>
            </div>

            <a href="#Home" className="w-full cursor-pointer rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-8 py-4 font-bold text-[#F9FAFB] shadow-lg shadow-[#7C3AED]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#3B82F6]/30 active:scale-95 sm:w-fit">
              Start Exploring
            </a>
          </div>
        </div>

        {/* Brand + Explore */}
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Brand Card */}
          <div className="rounded-[28px] border border-white/10 bg-[#111827]/60 p-6 backdrop-blur-xl md:p-7">
            <div className="mb-5 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Astra"
                width={90}
                height={90}
                draggable={false}
                className="h-auto w-[74px] select-none"
              />

              <div>
                <h3 className="font-heading text-4xl leading-none tracking-wide text-[#F9FAFB]">
                  ASTRA
                </h3>

                <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
                  Movie & TV Discovery
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
              Astra is built for discovering what to watch next. Explore
              trending titles, popular movies, top rated shows, and genre-based
              collections in one modern streaming-style interface.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 p-4">
                <p className="font-heading text-3xl leading-none text-[#A855F7]">
                  10K+
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  Movies
                </p>
              </div>

              <div className="rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/10 p-4">
                <p className="font-heading text-3xl leading-none text-[#3B82F6]">
                  5K+
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  TV Series
                </p>
              </div>

              <div className="rounded-2xl border border-[#A855F7]/20 bg-[#A855F7]/10 p-4">
                <p className="font-heading text-3xl leading-none text-[#A855F7]">
                  HD
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  Quality
                </p>
              </div>
            </div>
          </div>

          {/* Explore Card */}
          <div className="rounded-[28px] border border-white/10 bg-[#111827]/60 p-6 backdrop-blur-xl md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-heading text-3xl tracking-wide text-[#F9FAFB]">
                  Explore
                </h4>
                <p className="text-sm text-[#9CA3AF]">
                  Jump into your favorite section.
                </p>
              </div>

              <span className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold text-[#A855F7]">
                Browse
              </span>
            </div>

            <div className="grid gap-2">
              {exploreLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-[#09090F]/70 px-4 py-3 text-left text-sm font-semibold text-[#9CA3AF] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 hover:text-[#F9FAFB] active:scale-[0.98]"
                >
                  <span>{link}</span>
                  <span className="text-[#7C3AED] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-8 rounded-[28px] border border-white/10 bg-[#111827]/70 p-5 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="text-lg font-bold text-[#F9FAFB]">
                Get weekly movie picks
              </h4>

              <p className="mt-1 text-sm text-[#9CA3AF]">
                New releases, trending titles, hidden gems, and genre picks.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-full border border-white/10 bg-[#09090F] px-5 text-sm text-[#F9FAFB] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#7C3AED]/70"
              />

              <button className="h-12 cursor-pointer rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-6 text-sm font-bold text-[#F9FAFB] transition-all duration-300 hover:scale-[1.03] active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-[#9CA3AF] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Astra. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#10B981]">Safe browsing</span>

            <button className="cursor-pointer transition hover:text-[#F9FAFB]">
              Privacy
            </button>

            <button className="cursor-pointer transition hover:text-[#F9FAFB]">
              Terms
            </button>

            <button className="cursor-pointer transition hover:text-[#F9FAFB]">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;