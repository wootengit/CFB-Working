import React from 'react'

/**
 * 🎨 Premium Dashboard Layout
 * 
 * Enterprise-grade layout component providing:
 * - Casino-style monitor housing effects
 * - Professional ambient lighting
 * - Responsive container system
 * - Accessibility-compliant structure
 */

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`dashboard-container ${className}`}>
      {/* Ambient Background Lighting */}
      <div className="premium-display">
        <div className="ambient-glow" />
      </div>
      
      {/* Main Content Area */}
      <main className="dashboard-content">
        {children}
      </main>
      
      {/* Global Styles for Dashboard */}
      <style jsx global>{`
        .dashboard-container {
          min-height: 100vh;
          background: 
            radial-gradient(ellipse at top, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-content {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .premium-display {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          pointer-events: none;
        }

        .ambient-glow {
          position: absolute;
          top: -20%;
          left: -20%;
          right: -20%;
          bottom: -20%;
          background: 
            radial-gradient(circle at 25% 25%, rgba(100, 150, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 75% 75%, rgba(255, 168, 0, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.12) 0%, transparent 30%);
          filter: blur(40px);
          animation: ambientPulse 8s ease-in-out infinite;
        }

        @keyframes ambientPulse {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1) rotate(0deg); 
          }
          33% { 
            opacity: 0.8; 
            transform: scale(1.05) rotate(1deg); 
          }
          66% { 
            opacity: 0.9; 
            transform: scale(0.95) rotate(-1deg); 
          }
        }

        /* Professional Monitor Housing */
        .sportsbook-monitor {
          border: 2px solid #222;
          background: linear-gradient(145deg, #2c2c2c, #1a1a1a);
          border-radius: 12px;
          padding: 1rem;
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 10px 25px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .sportsbook-monitor::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .premium-screen {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          position: relative;
        }

        /* Professional Sportsbook Background */
        .sportsbook-premium-bg {
          background: 
            linear-gradient(145deg, 
              rgba(255, 255, 255, 0.08) 0%,
              rgba(255, 255, 255, 0.03) 20%,
              rgba(0, 0, 0, 0.03) 60%,
              rgba(0, 0, 0, 0.15) 100%
            ),
            linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        /* Typography System */
        .main-odds-display {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.9;
          color: var(--led-white, #f8f8ff);
          text-shadow: 
            0 0 10px currentColor,
            0 0 20px currentColor,
            0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .team-names {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--led-white, #f8f8ff);
        }

        .secondary-info {
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(255, 255, 255, 0.9);
        }

        .monospace-data {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }

        .led-scoreboard-text {
          font-family: 'SF Mono', Monaco, monospace;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.1em;
          line-height: 1.2;
          text-transform: uppercase;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Professional LED Colors */
        :root {
          --led-red: #FF2D2D;
          --led-green: #00FF41;
          --led-amber: #FFB000;
          --led-blue: #2D4FFF;
          --led-white: #F8F8FF;
          --vegas-gold: #FCB131;
          --charcoal: #374151;
          --sportsbook-blue: #1E3A8A;
          --display-blue: #0066ff;
          --display-green: #00cc4d;
          --display-red: #ff3333;
        }

        .text-led-green { color: var(--led-green); }
        .text-led-red { color: var(--led-red); }
        .text-led-amber { color: var(--led-amber); }
        .text-led-blue { color: var(--led-blue); }
        .text-led-white { color: var(--led-white); }
        .text-vegas-gold { color: var(--vegas-gold); }
        .bg-charcoal { background-color: var(--charcoal); }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem 0.75rem;
          }
          
          .main-odds-display {
            font-size: 2rem;
          }
          
          .sportsbook-monitor {
            padding: 0.75rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .ambient-glow {
            animation: none;
          }
        }

        @media (prefers-contrast: high) {
          .sportsbook-monitor {
            border: 2px solid white;
          }
          
          .main-odds-display {
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        }

        /* Focus indicators for accessibility */
        *:focus {
          outline: 2px solid var(--led-blue);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}