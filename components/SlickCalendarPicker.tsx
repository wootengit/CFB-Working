'use client'

import React, { useState, useEffect } from 'react'

export interface CalendarDate {
  date: Date
  day: number
  month: number
  year: number
  isToday: boolean
  isSelected: boolean
  hasGames: boolean
  gameCount: number
  isWeekend: boolean
}

interface SlickCalendarPickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  gamesData?: Record<string, number> // Date string -> game count
  minDate?: Date
  maxDate?: Date
}

export const SlickCalendarPicker: React.FC<SlickCalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  gamesData = {},
  minDate = new Date(2025, 7, 1), // August 1, 2025
  maxDate = new Date(2026, 0, 31)  // January 31, 2026
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear())
  const [isAnimating, setIsAnimating] = useState(false)

  const today = new Date()
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Generate calendar days
  const generateCalendarDays = (): CalendarDate[] => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)
    
    // Start from Sunday of the week containing the first day
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    // End on Saturday of the week containing the last day
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
    
    const days: CalendarDate[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const gameCount = gamesData[dateStr] || 0
      
      days.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isToday: currentDate.toDateString() === today.toDateString(),
        isSelected: currentDate.toDateString() === selectedDate.toDateString(),
        hasGames: gameCount > 0,
        gameCount,
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setIsAnimating(true)
    
    setTimeout(() => {
      if (direction === 'next') {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setCurrentYear(currentYear + 1)
        } else {
          setCurrentMonth(currentMonth + 1)
        }
      } else {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setCurrentYear(currentYear - 1)
        } else {
          setCurrentMonth(currentMonth - 1)
        }
      }
      setIsAnimating(false)
    }, 150)
  }

  const handleDateClick = (calendarDate: CalendarDate) => {
    if (calendarDate.date >= minDate && calendarDate.date <= maxDate) {
      onDateSelect(calendarDate.date)
    }
  }

  const calendarDays = generateCalendarDays()
  const canGoPrev = new Date(currentYear, currentMonth - 1) >= new Date(minDate.getFullYear(), minDate.getMonth())
  const canGoNext = new Date(currentYear, currentMonth + 1) <= new Date(maxDate.getFullYear(), maxDate.getMonth())

  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: scale(0.95) translateY(-10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes pulseGame {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: `
          0 20px 40px rgba(0,0,0,0.08),
          0 8px 16px rgba(0,0,0,0.04),
          0 1px 0 rgba(255,255,255,0.9) inset,
          0 -1px 0 rgba(0,0,0,0.04) inset
        `,
        border: '1px solid rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        maxWidth: '480px',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '0 8px'
        }}>
          
          {/* Previous Month Button */}
          <button
            onClick={() => canGoPrev && handleMonthChange('prev')}
            disabled={!canGoPrev}
            style={{
              background: canGoPrev 
                ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                : 'transparent',
              border: canGoPrev ? '1px solid #cbd5e1' : '1px solid transparent',
              borderRadius: '12px',
              padding: '12px',
              cursor: canGoPrev ? 'pointer' : 'not-allowed',
              opacity: canGoPrev ? 1 : 0.3,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: canGoPrev ? '#475569' : '#94a3b8'
            }}
            onMouseEnter={(e) => {
              if (canGoPrev) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (canGoPrev) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            ←
          </button>
          
          {/* Month/Year Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: isAnimating ? 0.6 : 1,
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.15s ease'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b',
              background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {months[currentMonth]}
            </h2>
            <div style={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: '500'
            }}>
              {currentYear}
            </div>
          </div>
          
          {/* Next Month Button */}
          <button
            onClick={() => canGoNext && handleMonthChange('next')}
            disabled={!canGoNext}
            style={{
              background: canGoNext 
                ? 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' 
                : 'transparent',
              border: canGoNext ? '1px solid #cbd5e1' : '1px solid transparent',
              borderRadius: '12px',
              padding: '12px',
              cursor: canGoNext ? 'pointer' : 'not-allowed',
              opacity: canGoNext ? 1 : 0.3,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: canGoNext ? '#475569' : '#94a3b8'
            }}
            onMouseEnter={(e) => {
              if (canGoNext) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (canGoNext) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            →
          </button>
        </div>
        
        {/* Weekday Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '12px',
          padding: '0 4px'
        }}>
          {weekdays.map((weekday) => (
            <div
              key={weekday}
              style={{
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                padding: '8px 4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {weekday}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          animation: isAnimating ? 'none' : 'slideIn 0.3s ease'
        }}>
          {calendarDays.map((calendarDate, index) => {
            const isCurrentMonth = calendarDate.month === currentMonth
            const isDisabled = calendarDate.date < minDate || calendarDate.date > maxDate
            const isClickable = isCurrentMonth && !isDisabled
            
            return (
              <button
                key={index}
                onClick={() => isClickable && handleDateClick(calendarDate)}
                disabled={!isClickable}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: calendarDate.isToday || calendarDate.isSelected ? '700' : '500',
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  
                  // Background styling
                  background: calendarDate.isSelected
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : calendarDate.isToday
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : calendarDate.hasGames
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : isCurrentMonth
                    ? 'transparent'
                    : 'transparent',
                  
                  // Text color
                  color: calendarDate.isSelected || calendarDate.isToday || calendarDate.hasGames
                    ? 'white'
                    : isCurrentMonth
                    ? '#1e293b'
                    : '#94a3b8',
                  
                  // Opacity
                  opacity: isCurrentMonth ? 1 : 0.4,
                  
                  // Box shadow
                  boxShadow: calendarDate.isSelected
                    ? '0 6px 16px rgba(59,130,246,0.3), 0 2px 4px rgba(0,0,0,0.1)'
                    : calendarDate.isToday
                    ? '0 6px 16px rgba(245,158,11,0.3), 0 2px 4px rgba(0,0,0,0.1)'
                    : calendarDate.hasGames
                    ? '0 4px 12px rgba(16,185,129,0.2)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  if (isClickable && !calendarDate.isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                    e.currentTarget.style.background = calendarDate.hasGames
                      ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                      : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'
                    e.currentTarget.style.color = calendarDate.hasGames ? 'white' : '#1e293b'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isClickable && !calendarDate.isSelected) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.background = calendarDate.hasGames
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'transparent'
                    e.currentTarget.style.boxShadow = calendarDate.hasGames
                      ? '0 4px 12px rgba(16,185,129,0.2)'
                      : 'none'
                    e.currentTarget.style.color = calendarDate.hasGames
                      ? 'white'
                      : isCurrentMonth
                      ? '#1e293b'
                      : '#94a3b8'
                  }
                }}
              >
                {calendarDate.day}
                
                {/* Game Count Indicator */}
                {calendarDate.hasGames && calendarDate.gameCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#059669',
                    borderRadius: '6px',
                    fontSize: '9px',
                    fontWeight: '700',
                    padding: '1px 4px',
                    minWidth: '12px',
                    height: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    animation: calendarDate.gameCount > 5 ? 'pulseGame 2s ease-in-out infinite' : 'none'
                  }}>
                    {calendarDate.gameCount > 99 ? '99+' : calendarDate.gameCount}
                  </div>
                )}
                
                {/* Today Indicator */}
                {calendarDate.isToday && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    animation: 'pulseGame 1.5s ease-in-out infinite'
                  }} />
                )}
              </button>
            )
          })}
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(248,250,252,0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(226,232,240,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
            }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              Has Games
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(245,158,11,0.2)'
            }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              Today
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(59,130,246,0.2)'
            }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              Selected
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default SlickCalendarPicker