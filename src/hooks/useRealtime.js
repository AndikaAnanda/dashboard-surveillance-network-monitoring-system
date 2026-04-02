import { useState, useEffect, useCallback } from 'react'

export function useRealtimeNetwork(initialData, intervalMs = 3000) {
  const [data, setData] = useState(initialData)
  const [lastSync, setLastSync] = useState(new Date())
  const [tickCount, setTickCount] = useState(0)

  const mutate = useCallback((items) => {
    return items.map((item) => {
      // 70% skip update → biar tidak semua item berubah tiap tick (lebih realistis)
      if (Math.random() > 0.3) return item

      // Membuat perubahan acak naik/turun berdasarkan persentase dari nilai awal
      const delta = (base, pct) => {
        // Math.random() * 2 - 1 → menghasilkan range -1 sampai +1
        const change = base * pct * (Math.random() * 2 - 1)
        return Math.round(base + change)
      }

      const deltaFloat = (base, pct) => {
        const change = base * pct * (Math.random() * 2 - 1)
        return Math.max(0, parseFloat((base + change).toFixed(2)))
      }

      // ~5% kemungkinan status berubah (simulate device down/up)
      const statusFlip = Math.random() < 0.05
      const newStatus = statusFlip
        ? item.status === 'up' ? 'down' : 'up'
        : item.status

      return {
        ...item,
        status: newStatus,

        // Nilai dibatasi agar tetap masuk akal (clamping)
        bandwidth: Math.max(1, Math.min(1000, delta(item.bandwidth, 0.08))),
        latency: Math.max(1, Math.min(200, delta(item.latency, 0.1))),
        packetLoss: Math.max(0, Math.min(10, deltaFloat(item.packetLoss, 0.12))),

        // Format timestamp biar rapi (YYYY-MM-DD HH:mm:ss.xxx)
        lastUpdate: new Date().toISOString().replace('T', ' ').slice(0, 23),
      }
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      // Selalu pakai prev state → aman untuk async update
      setData((prev) => mutate(prev))
      setLastSync(new Date())
      setTickCount((c) => c + 1)
    }, intervalMs)

    // Cleanup interval biar tidak memory leak saat unmount
    return () => clearInterval(timer)
  }, [mutate, intervalMs])

  return { data, lastSync, tickCount }
}

export function useRealtimeSurveillance(initialData, intervalMs = 4000) {
  const [data, setData] = useState(initialData)
  const [lastSync, setLastSync] = useState(new Date())
  const [tickCount, setTickCount] = useState(0)

  const mutate = useCallback((items) => {
    return items.map((item) => {
      // 75% skip update → perubahan tidak terlalu sering
      if (Math.random() > 0.25) return item

      // ~4% kemungkinan status berubah
      const statusFlip = Math.random() < 0.04
      const newStatus = statusFlip
        ? item.status === 'active' ? 'inactive' : 'active'
        : item.status

      // Alert hanya berubah kecil (-1, 0, +1) → biar smooth, tidak loncat jauh
      const alertDelta = Math.floor(Math.random() * 3) - 1
      const newAlerts = Math.max(0, Math.min(5, item.alerts + alertDelta))

      return {
        ...item,
        status: newStatus,
        alerts: newAlerts,
        lastUpdate: new Date().toISOString().replace('T', ' ').slice(0, 23),
      }
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => mutate(prev))
      setLastSync(new Date())
      setTickCount((c) => c + 1)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [mutate, intervalMs])

  return { data, lastSync, tickCount }
}