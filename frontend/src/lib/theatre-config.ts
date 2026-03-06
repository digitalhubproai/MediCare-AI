/**
 * Theatre.js Studio Configuration
 * This file sets up Theatre.js for advanced animations
 */

import { getProject } from '@theatre/core'

// Create project
const project = getProject('MediCare AI Animations')

// Create sheet for different animation sequences
const uiSheet = project.sheet('UI Animations', 'main')

// Define animation objects
const heroAnimations = uiSheet.object('Hero Section', {
  title: {
    opacity: 0,
    y: 50,
    scale: 1
  },
  subtitle: {
    opacity: 0,
    y: 30
  },
  ctaButtons: {
    opacity: 0,
    y: 20
  }
})

const featureCards = uiSheet.object('Feature Cards', {
  card1: { opacity: 0, y: 40, rotationY: -10 },
  card2: { opacity: 0, y: 40, rotationY: -10 },
  card3: { opacity: 0, y: 40, rotationY: -10 },
  card4: { opacity: 0, y: 40, rotationY: -10 },
  card5: { opacity: 0, y: 40, rotationY: -10 },
  card6: { opacity: 0, y: 40, rotationY: -10 }
})

const statsSection = uiSheet.object('Stats Section', {
  stat1: { opacity: 0, scale: 0.8 },
  stat2: { opacity: 0, scale: 0.8 },
  stat3: { opacity: 0, scale: 0.8 },
  stat4: { opacity: 0, scale: 0.8 }
})

// Timeline sequences
const timeline = {
  hero: {
    duration: 2000,
    keyframes: {
      title: {
        0: { opacity: 0, y: 50 },
        100: { opacity: 1, y: 0 }
      },
      subtitle: {
        200: { opacity: 0, y: 30 },
        400: { opacity: 1, y: 0 }
      },
      ctaButtons: {
        400: { opacity: 0, y: 20 },
        600: { opacity: 1, y: 0 }
      }
    }
  },
  features: {
    duration: 3000,
    stagger: 100,
    keyframes: {
      cards: {
        0: { opacity: 0, y: 40, rotationY: -10 },
        100: { opacity: 1, y: 0, rotationY: 0 }
      }
    }
  }
}

// Export for use in components
export { project, uiSheet, heroAnimations, featureCards, statsSection, timeline }

// Helper function for smooth animations
export const animateValue = (element: HTMLElement, property: string, from: number, to: number, duration: number) => {
  const start = performance.now()
  
  const animate = (time: number) => {
    const elapsed = time - start
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    
    const value = from + (to - from) * eased
    element.style[property] = String(value)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

// Helper for stagger animations
export const staggerAnimate = (elements: NodeListOf<Element>, animation: (el: Element) => void, staggerDelay: number = 100) => {
  elements.forEach((el, index) => {
    setTimeout(() => {
      animation(el)
    }, index * staggerDelay)
  })
}
