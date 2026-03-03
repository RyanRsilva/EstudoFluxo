"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { hourlyFocusData, heatmapData } from "@/lib/mock-data"
import { useMemo } from "react"

function FocusTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary">{`${payload[0].value} min focados`}</p>
      </div>
    )
  }
  return null
}

function HeatmapGrid({ data }: { data: { date: string; count: number }[] }) {
  const weeks = useMemo(() => {
    const result: { date: string; count: number }[][] = []
    if (data.length === 0) return result

    const firstDate = new Date(data[0].date)
    const startDay = firstDate.getDay()

    // Pad with empty cells at the start
    const paddedData = [
      ...Array.from({ length: startDay }, () => ({ date: "", count: -1 })),
      ...data,
    ]

    for (let i = 0; i < paddedData.length; i += 7) {
      result.push(paddedData.slice(i, i + 7))
    }
    return result
  }, [data])

  const months = useMemo(() => {
    const labels: { label: string; col: number }[] = []
    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ]
    let lastMonth = -1

    weeks.forEach((week, weekIndex) => {
      for (const day of week) {
        if (day.date) {
          const month = new Date(day.date).getMonth()
          if (month !== lastMonth) {
            labels.push({ label: monthNames[month], col: weekIndex })
            lastMonth = month
          }
          break
        }
      }
    })

    return labels
  }, [weeks])

  function getColor(count: number) {
    if (count < 0) return "transparent"
    if (count === 0) return "#1a1a2e"
    if (count === 1) return "#1e3a5f"
    if (count === 2) return "#2563EB"
    if (count === 3) return "#3B82F6"
    if (count === 4) return "#60A5FA"
    return "#93C5FD"
  }

  const dayLabels = ["", "Seg", "", "Qua", "", "Sex", ""]

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Month labels */}
        <div className="mb-1 flex" style={{ paddingLeft: "32px" }}>
          {months.map((m, i) => (
            <span
              key={i}
              className="text-xs text-muted-foreground"
              style={{
                position: "relative",
                left: `${m.col * 14}px`,
                marginRight: i < months.length - 1 ? "0" : undefined,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels column */}
          <div className="flex flex-col gap-0.5 pr-1">
            {dayLabels.map((label, i) => (
              <div
                key={i}
                className="flex h-[12px] w-[24px] items-center justify-end text-[10px] text-muted-foreground"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="size-[12px] rounded-[2px] transition-colors"
                    style={{ backgroundColor: getColor(day.count) }}
                    title={
                      day.date
                        ? `${day.date}: ${day.count}h estudadas`
                        : undefined
                    }
                  />
                ))}
                {/* Fill remaining cells if week is short */}
                {Array.from({ length: Math.max(0, 7 - week.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="size-[12px] rounded-[2px]"
                    style={{ backgroundColor: "transparent" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-end gap-1">
          <span className="mr-1 text-xs text-muted-foreground">Menos</span>
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="size-[12px] rounded-[2px]"
              style={{ backgroundColor: getColor(level) }}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">Mais</span>
        </div>
      </div>
    </div>
  )
}

export function AnalysisTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hourly Focus Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tempo Focado por Hora do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyFocusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis
                  dataKey="hour"
                  stroke="#a0a0a0"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  stroke="#a0a0a0"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}m`}
                />
                <Tooltip content={<FocusTooltip />} />
                <Bar
                  dataKey="minutes"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapa de Atividades do Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <HeatmapGrid data={heatmapData} />
        </CardContent>
      </Card>
    </div>
  )
}
