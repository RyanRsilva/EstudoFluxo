"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, BarChart3, Timer } from "lucide-react"
import { DashboardTab } from "@/components/dashboard-tab"
import { AnalysisTab } from "@/components/analysis-tab"
import { StopwatchTab } from "@/components/stopwatch-tab"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <Timer className="size-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            EstudoFluxo
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="overview" className="flex flex-col gap-6">
          <TabsList className="h-11 w-full bg-secondary sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Visao Geral</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Analise Detalhada</span>
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="gap-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Timer className="size-4" />
              <span className="hidden sm:inline">Cronometro</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="analysis">
            <AnalysisTab />
          </TabsContent>
          <TabsContent value="stopwatch">
            <StopwatchTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
