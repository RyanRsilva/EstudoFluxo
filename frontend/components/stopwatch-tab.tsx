"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Plus,
  Settings,
  X,
  Crown,
} from "lucide-react"
import { subjects, recentSessions, type SessionRecord } from "@/lib/mock-data"

interface PomodoroSettings {
  pomoDuration: number
  shortBreak: number
  longBreak: number
  pomosForLong: number
  autoNextPomo: boolean
  autoBreak: boolean
}

const defaultSettings: PomodoroSettings = {
  pomoDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  pomosForLong: 4,
  autoNextPomo: false,
  autoBreak: false,
}

const timelineHours = [20, 21, 22, 23, 0]

export function StopwatchTab() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [sessions, setSessions] = useState<SessionRecord[]>(recentSessions)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  const totalSeconds = settings.pomoDuration * 60
  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0)

  const formatTime = useCallback((totalSec: number) => {
    const minutes = Math.floor(totalSec / 60)
    const seconds = totalSec % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isRunning && remainingSeconds <= 0) {
      handlePause()
    }
  }, [remainingSeconds, isRunning])

  function handleStart() {
    if (!selectedSubject) return
    if (!startTimeRef.current) {
      startTimeRef.current = new Date()
    }
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
  }

  function handlePause() {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function handleFinish() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)

    if (selectedSubject && elapsedSeconds > 0 && startTimeRef.current) {
      const subjectData = subjects.find((s) => s.id === selectedSubject)
      const endTime = new Date()
      const durationMin = Math.round(elapsedSeconds / 60)

      const newSession: SessionRecord = {
        id: Date.now().toString(),
        subject: subjectData?.name ?? "Desconhecido",
        emoji: subjectData?.emoji ?? "📚",
        startTime: startTimeRef.current.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endTime.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: `${durationMin} min`,
        color: subjectData?.color ?? "#3B82F6",
        date: "Hoje",
      }
      setSessions((prev) => [newSession, ...prev])
    }

    setElapsedSeconds(0)
    startTimeRef.current = null
  }

  function handleSelectSubject(id: string) {
    if (isRunning) return
    setSelectedSubject(id)
    setElapsedSeconds(0)
    startTimeRef.current = null
  }

  const selectedData = subjects.find((s) => s.id === selectedSubject)

  const currentHour = new Date().getHours()
  const currentMinute = new Date().getMinutes()

  return (
    <>
      <div className="flex flex-col gap-0 lg:grid lg:grid-cols-[260px_1fr_200px] lg:gap-0">
        {/* Column 1 - Task List */}
        <div className="rounded-l-xl bg-[#1E1E1E] p-4 lg:min-h-[600px]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Pomodoro</h2>
            <div className="flex items-center gap-1">
              <button className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Plus className="size-4" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Settings className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject.id)}
                disabled={isRunning}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                  selectedSubject === subject.id
                    ? "bg-primary/15 ring-1 ring-primary/30"
                    : "hover:bg-[#2a2a2a]"
                } ${isRunning && selectedSubject !== subject.id ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{subject.emoji}</span>
                  <span className="text-sm font-medium text-foreground">
                    {subject.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">0m</span>
                  <Play className="size-3.5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2 - Timer */}
        <div className="flex flex-col items-center bg-[#181818] px-6 py-6 lg:min-h-[600px]">
          {/* Selected Task Details */}
          {selectedData && (
            <div className="mb-6 w-full">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{selectedData.emoji}</span>
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedData.name}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-[#1E1E1E] px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Dias focados</p>
                  <p className="text-lg font-bold text-foreground">13</p>
                </div>
                <div className="rounded-lg bg-[#1E1E1E] px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Foco de hoje</p>
                  <p className="text-lg font-bold text-foreground">
                    0<span className="text-xs font-normal text-muted-foreground">m</span>
                  </p>
                </div>
                <div className="rounded-lg bg-[#1E1E1E] px-3 py-2">
                  <p className="text-[10px] text-muted-foreground">Foco Total</p>
                  <p className="text-lg font-bold text-foreground">
                    104h 12<span className="text-xs font-normal text-muted-foreground">m</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timer Circle */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            {!selectedData && (
              <p className="text-sm text-muted-foreground">
                Selecione uma tarefa para comecar
              </p>
            )}
            <div className="relative flex size-56 items-center justify-center rounded-full border-[6px] border-[#2a2a2a] lg:size-64">
              {isRunning && (
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 256 256"
                >
                  <circle
                    cx="128"
                    cy="128"
                    r="122"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    strokeDasharray={`${(2 * Math.PI * 122 * (elapsedSeconds / totalSeconds))} ${2 * Math.PI * 122}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
              )}
              <span className="font-mono text-5xl font-bold tracking-wider text-foreground lg:text-6xl">
                {formatTime(remainingSeconds)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  disabled={!selectedSubject}
                  size="lg"
                  className="rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                >
                  Comecar
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePause}
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-8"
                  >
                    Pausar
                  </Button>
                  <Button
                    onClick={handleFinish}
                    size="lg"
                    variant="outline"
                    className="rounded-full border-border px-6 text-foreground"
                  >
                    Finalizar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Column 3 - Timeline */}
        <div className="rounded-r-xl bg-[#1E1E1E] p-4 lg:min-h-[600px]">
          <div className="mb-4 flex items-center gap-2">
            <Crown className="size-4 text-yellow-500" />
            <h2 className="text-sm font-semibold text-foreground">Pomo</h2>
          </div>

          <div className="relative flex flex-col">
            {timelineHours.map((hour, index) => {
              const isCurrentHour = hour === currentHour
              return (
                <div key={`hour-${hour}`} className="relative">
                  <div className="flex items-center gap-3 border-b border-[#2a2a2a] py-4">
                    <span
                      className={`w-6 text-right text-xs font-medium ${
                        isCurrentHour
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {hour}
                    </span>
                    <div className="h-px flex-1 bg-[#2a2a2a]" />
                  </div>
                  {/* Current time indicator */}
                  {isCurrentHour && (
                    <div
                      className="absolute left-0 right-0 flex items-center"
                      style={{
                        top: `${(currentMinute / 60) * 100}%`,
                      }}
                    >
                      <div className="size-2 rounded-full bg-red-500" />
                      <div className="h-px flex-1 bg-red-500" />
                    </div>
                  )}

                  {/* Show sessions in this hour */}
                  {sessions
                    .filter((s) => {
                      const sessionHour = parseInt(s.startTime.split(":")[0])
                      return sessionHour === hour && s.date === "Hoje"
                    })
                    .map((s) => (
                      <div
                        key={s.id}
                        className="mx-1 my-0.5 rounded px-2 py-1 text-[10px] font-medium text-foreground"
                        style={{ backgroundColor: `${s.color}33` }}
                      >
                        {s.emoji} {s.duration}
                      </div>
                    ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-[#1E1E1E] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Configuracoes de foco
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Duration Inputs */}
              <div className="flex flex-col gap-3">
                <SettingsInput
                  label="Duracao do Pomo"
                  value={settings.pomoDuration}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, pomoDuration: v }))
                  }
                  suffix="min"
                />
                <SettingsInput
                  label="Duracao da Pausa Curta"
                  value={settings.shortBreak}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, shortBreak: v }))
                  }
                  suffix="min"
                />
                <SettingsInput
                  label="Duracao da Pausa Longa"
                  value={settings.longBreak}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, longBreak: v }))
                  }
                  suffix="min"
                />
                <SettingsInput
                  label="Pomos para intervalo longo"
                  value={settings.pomosForLong}
                  onChange={(v) =>
                    setSettings((s) => ({ ...s, pomosForLong: v }))
                  }
                />
              </div>

              {/* Auto Start */}
              <div className="mt-2 border-t border-border pt-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Inicio automatico
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Proximo Pomo</span>
                    <Switch
                      checked={settings.autoNextPomo}
                      onCheckedChange={(checked) =>
                        setSettings((s) => ({
                          ...s,
                          autoNextPomo: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Pausa</span>
                    <Switch
                      checked={settings.autoBreak}
                      onCheckedChange={(checked) =>
                        setSettings((s) => ({
                          ...s,
                          autoBreak: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Salvar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

function SettingsInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={1}
          max={120}
          className="w-16 rounded-lg border border-border bg-background px-2.5 py-1.5 text-center text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-primary"
        />
        {suffix && (
          <span className="text-xs text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  )
}
