import { useEffect, useCallback } from 'react'

export function useNotification() {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  const notify = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/pwa-icon-192.png',
        badge: '/pwa-icon-192.png',
        ...options,
      })
    }
  }, [])

  // Request permission on mount
  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  return { notify, requestPermission }
}
