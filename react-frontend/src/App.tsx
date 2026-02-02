import { WeatherCard } from './components/WeatherCard';

function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] bg-[#0a0e27]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚡</div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-cyan">WeatherPro</h1>
              <p className="text-xs text-[var(--text-secondary)]">Real-time weather insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] hidden sm:block">Powered by Open-Meteo</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <WeatherCard />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Built with React, TypeScript, Go & Open-Meteo API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
