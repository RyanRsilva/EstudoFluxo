export const subjects = [
  { id: "1", name: "Matematica", emoji: "📐", color: "#3B82F6", totalTime: "32h 10m" },
  { id: "2", name: "Fisica", emoji: "⚡", color: "#60A5FA", totalTime: "18h 45m" },
  { id: "3", name: "Quimica", emoji: "🧪", color: "#2563EB", totalTime: "22h 30m" },
  { id: "4", name: "Portugues", emoji: "📖", color: "#93C5FD", totalTime: "16h 00m" },
  { id: "5", name: "Historia", emoji: "🏛️", color: "#1D4ED8", totalTime: "15h 59m" },
]

export const weeklyData = [
  { day: "Dom", hours: 1.5 },
  { day: "Seg", hours: 3.2 },
  { day: "Ter", hours: 2.8 },
  { day: "Qua", hours: 4.1 },
  { day: "Qui", hours: 3.5 },
  { day: "Sex", hours: 2.0 },
  { day: "Sab", hours: 1.0 },
]

export const subjectDistribution = [
  { name: "Matematica", value: 35, fill: "#3B82F6" },
  { name: "Fisica", value: 25, fill: "#60A5FA" },
  { name: "Quimica", value: 15, fill: "#2563EB" },
  { name: "Portugues", value: 15, fill: "#93C5FD" },
  { name: "Historia", value: 10, fill: "#1D4ED8" },
]

export const hourlyFocusData = Array.from({ length: 24 }, (_, i) => {
  let minutes = 0
  if (i >= 6 && i <= 11) minutes = Math.floor(Math.random() * 30) + 20
  else if (i >= 14 && i <= 18) minutes = Math.floor(Math.random() * 40) + 25
  else if (i >= 19 && i <= 22) minutes = Math.floor(Math.random() * 35) + 15
  else minutes = Math.floor(Math.random() * 10)
  return { hour: `${String(i).padStart(2, "0")}h`, minutes }
})

function generateHeatmapData() {
  const data: { date: string; count: number }[] = []
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  for (let d = new Date(startOfYear); d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    let count = 0
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count = Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0
    } else {
      count = Math.random() > 0.5 ? Math.floor(Math.random() * 3) : 0
    }
    data.push({
      date: d.toISOString().split("T")[0],
      count,
    })
  }
  return data
}

export const heatmapData = generateHeatmapData()

export interface SessionRecord {
  id: string
  subject: string
  emoji: string
  startTime: string
  endTime: string
  duration: string
  color: string
  date: string
}

export const recentSessions: SessionRecord[] = [
  {
    id: "1",
    subject: "Matematica",
    emoji: "📐",
    startTime: "14:00",
    endTime: "14:50",
    duration: "50 min",
    color: "#3B82F6",
    date: "Hoje",
  },
  {
    id: "2",
    subject: "Fisica",
    emoji: "⚡",
    startTime: "15:10",
    endTime: "16:00",
    duration: "50 min",
    color: "#60A5FA",
    date: "Hoje",
  },
  {
    id: "3",
    subject: "Quimica",
    emoji: "🧪",
    startTime: "16:30",
    endTime: "17:05",
    duration: "35 min",
    color: "#2563EB",
    date: "Hoje",
  },
  {
    id: "4",
    subject: "Portugues",
    emoji: "📖",
    startTime: "09:00",
    endTime: "09:45",
    duration: "45 min",
    color: "#93C5FD",
    date: "Ontem",
  },
  {
    id: "5",
    subject: "Historia",
    emoji: "🏛️",
    startTime: "10:00",
    endTime: "10:30",
    duration: "30 min",
    color: "#1D4ED8",
    date: "Ontem",
  },
  {
    id: "6",
    subject: "Matematica",
    emoji: "📐",
    startTime: "14:00",
    endTime: "14:25",
    duration: "25 min",
    color: "#3B82F6",
    date: "28 Fev",
  },
]
