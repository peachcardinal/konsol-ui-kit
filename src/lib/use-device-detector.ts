export function useDeviceDetector(): 'mobile' | 'desktop' {
  return window.innerWidth < 768 ? 'mobile' : 'desktop'
}
