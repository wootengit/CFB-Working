'use client'

import React from 'react'
import { LavaGameCard } from '../../components/lava/LavaGameCard'

export default function LavaDemo() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Page Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🌋 Lava Sports Cards
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          margin: '0',
          fontWeight: '500'
        }}>
          Airbnb-inspired 3D match cards with organic animations and tactile depth
        </p>
      </div>
      
      {/* Demo Cards Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '40px',
        width: '100%',
        maxWidth: '1200px',
        justifyItems: 'center'
      }}>
        
        {/* Templates grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', width: '100%', justifyItems: 'center' }}>
          <LavaGameCard
            venue="Mercedes-Benz Stadium, Atlanta"
            weather="sunny-cold"
            watermark={false}
            home={{ name: 'Alabama', abbr: 'ALA', record: '0-0', ats: '0-0', last5: ['W','W','W','L','W'], spread: -3.5 }}
            away={{ name: 'Georgia', abbr: 'UGA', record: '0-0', ats: '0-0', last5: ['W','L','W','W','W'], spread: 3.5 }}
            totalOU={52.5}
          />
          <LavaGameCard
            venue="Generic Beach City"
            weather="sunny-beach"
            showTeams={true}
            watermark={false}
            home={{ name: 'Alabama', abbr: 'ALA', record: '0-0', ats: '0-0', last5: ['W','W','W','L','W'], spread: -3.5 }}
            away={{ name: 'Georgia', abbr: 'UGA', record: '0-0', ats: '0-0', last5: ['W','L','W','W','W'], spread: 3.5 }}
            totalOU={52.5}
            aiNoteOverride="Beach day is expected"
          />
          {/* Same Lava card, but with white icon override and background/shine off to match spec */}
          <LavaGameCard
            venue="Michigan Stadium, Ann Arbor"
            weather="partial-rain"
            showTeams={true}
            watermark={false}
            disableBackground={true}
            disableShineOverlay={true}
            iconOverride="/partial-rain-white.png?v=2"
          />
        </div>
        
        {/* Optional: Second card for comparison */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#374151',
            margin: '0'
          }}>
            Reference vs Lava Style
          </h3>
          
          {/* Reference card placeholder */}
          <div style={{
            width: '380px',
            height: '200px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Original Reference Design
          </div>
        </div>
        
      </div>
      
      {/* Design Notes */}
      <div style={{
        marginTop: '60px',
        maxWidth: '800px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '16px'
        }}>
          🎨 Lava Design Features
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          fontSize: '14px',
          color: '#475569'
        }}>
          <div>
            <strong>🌊 Organic Morphing:</strong> Border-radius animates continuously creating living, breathing feel
          </div>
          <div>
            <strong>☀️ 3D Weather:</strong> Layered sun/cloud with realistic shadows and rotating rays
          </div>
          <div>
            <strong>🏈 Team Logos:</strong> Dynamic shapes with hover effects and morphing animations  
          </div>
          <div>
            <strong>✨ Shine Effect:</strong> Periodic light sweep across surface like lava flow
          </div>
          <div>
            <strong>🎯 3D Transforms:</strong> Mouse-responsive perspective and depth on hover
          </div>
          <div>
            <strong>🌈 Gradient Layers:</strong> Multiple background layers for realistic lighting
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <div style={{ marginTop: '40px' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            padding: '12px 24px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)'
          }}
        >
          ← Back to Home
        </button>
      </div>
      
    </div>
  )
}