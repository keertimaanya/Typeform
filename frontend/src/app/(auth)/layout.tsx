export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] flex w-full">
      {/* Left side (Dark Carousel/Promo) */}
      <div className="hidden lg:flex w-1/2 bg-[#332c39] flex-col relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="w-full max-w-lg">
            <h2 className="text-white text-center font-medium mb-6">Form builder</h2>
            <h3 className="text-white text-2xl font-bold text-center mb-10">Build refreshingly different forms</h3>
            
            {/* Carousel Mock Image */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-fuchsia-200 to-purple-300 rounded-2xl shadow-2xl relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
              <div className="w-full h-full bg-[#1e4a3a] rounded-xl relative shadow-xl overflow-hidden flex flex-col p-6">
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-6 h-8 bg-[#2d5f4c] rounded-full rounded-tr-none rotate-12" />
                  <div className="w-6 h-8 bg-fuchsia-300 rounded-full rounded-bl-none -rotate-12" />
                </div>
                <div className="mt-8">
                  <div className="w-10 h-10 border-2 border-white/40 flex items-center justify-center mb-4 text-white font-serif italic text-xl rounded">
                    Aa
                  </div>
                  <h4 className="text-white font-serif text-3xl mb-4">Rate The Shampoo</h4>
                  <div className="flex gap-2 text-white/50">
                    {"★★★★☆".split("").map((star, i) => (
                      <span key={i} className="text-2xl">{star}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button className="text-white/50 hover:text-white transition-colors">&lt;</button>
              <div className="flex gap-1.5 mx-4">
                <div className="w-1.5 h-4 bg-white rounded-full" />
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-1.5" />
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-1.5" />
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full mt-1.5" />
              </div>
              <button className="text-white/50 hover:text-white transition-colors">&gt;</button>
            </div>
          </div>
        </div>

        {/* Footer Logos */}
        <div className="w-full pb-10 pt-4 flex flex-col items-center relative z-10">
          <p className="text-white/60 text-sm mb-6">Trusted by over 150,000 brands.</p>
          <div className="flex items-center gap-8 text-white/40 grayscale opacity-70">
            <span className="font-bold text-lg tracking-tight">Amplitude</span>
            <span className="font-bold text-lg tracking-tight">mailchimp</span>
            <span className="font-bold text-lg tracking-tight">HubSpot</span>
            <span className="font-bold text-lg tracking-tight">airbnb</span>
          </div>
        </div>
      </div>

      {/* Right side (Auth Forms) */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col h-full overflow-y-auto relative">
        {children}
      </div>
    </div>
  );
}
