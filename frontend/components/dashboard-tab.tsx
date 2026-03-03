"use client"

import { Plus, MoreHorizontal } from "lucide-react"
import { recentSessions } from "@/lib/mock-data"

const statsCards = [
  { title: "Pomo de hoje", value: "0", suffix: "" },
  { title: "Foco de hoje", value: "0", suffix: "m" },
  { title: "Pomo Total", value: "82", suffix: "" },
  { title: "Duracao Total Focada", value: "65h 24", suffix: "m" },
]

export function DashboardTab() {
  const groupedSessions: Record<string, typeof recentSessions> = {}
  for (const session of recentSessions) {
    if (!groupedSessions[session.date]) {
      groupedSessions[session.date] = []
    }
    groupedSessions[session.date].push(session)
  }
  const dateGroups = Object.entries(groupedSessions)

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-[#1E1E1E] px-5 py-4"
          >
            <p className="text-xs text-muted-foreground">{card.title}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {card.value}
              {card.suffix && (
                <span className="text-base font-normal text-muted-foreground">
                  {card.suffix}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Focus Log Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Foco em registro.
          </h2>
          <div className="flex items-center gap-1">
            <button className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Plus className="size-4" />
            </button>
            <button className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {dateGroups.map(([date, sessions], groupIndex) => (
            <div key={date} className="flex flex-col">
              {/* Date Label */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex w-8 justify-center">
                  <div className="size-2.5 rounded-full bg-muted-foreground/40" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {date}
                </span>
              </div>

              {/* Sessions for this date */}
              {sessions.map((session, sessionIndex) => {
                const isLastInGroup = sessionIndex === sessions.length - 1
                const isLastGroup = groupIndex === dateGroups.length - 1
                const showLine = !(isLastInGroup && isLastGroup)

                return (
                  <div key={session.id} className="flex">
                    {/* Timeline column */}
                    <div className="flex w-8 flex-col items-center">
                      <div
                        className="size-3 shrink-0 rounded-full border-2"
                        style={{
                          borderColor: session.color,
                          backgroundColor: `${session.color}33`,
                        }}
                      />
                      {showLine && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>

                    {/* Session Content */}
                    <div className="flex flex-1 items-center justify-between pb-4 pl-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{session.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {session.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {session.duration}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
