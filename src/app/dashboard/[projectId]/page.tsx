"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { dashboardApi } from "@/lib/api";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { ArrowLeft, Users, Eye, Clock, TrendingUp, Globe, LogOut, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface Summary {
  total_visits: number;
  unique_visitors: number;
  avg_session_duration: number;
  bounce_rate: number;
  top_page: string;
}

interface ChartPoint {
  date?: string;
  month?: string;
  visits: number;
  unique: number;
}

interface Endpoint {
  path: string;
  visits: number;
  avg_duration: number;
}

type ChartRange = "daily" | "monthly";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [range, setRange] = useState<ChartRange>("daily");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !projectId) return;
    setFetching(true);

    Promise.all([
      dashboardApi.summary(projectId),
      dashboardApi.daily(projectId),
      dashboardApi.endpoints(projectId),
    ])
      .then(([s, d, e]) => {
        setSummary(s);
        setChart(d);
        setEndpoints(e);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setFetching(false));
  }, [user, projectId]);

  const loadChart = async (r: ChartRange) => {
    setRange(r);
    const data = r === "daily"
      ? await dashboardApi.daily(projectId)
      : await dashboardApi.monthly(projectId);
    setChart(data);
  };

  const trackingScript = `<script src="${process.env.NEXT_PUBLIC_API_URL}/t/${projectId}.js" defer></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Nav */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Projects</span>
            </Link>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <rect x="1" y="1" width="26" height="26" rx="6" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M7 21L11 14L15 17L19 10L21 13" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="21" cy="10" r="2" fill="#06b6d4" />
              </svg>
              <span className="font-display text-sm font-semibold text-slate-100">trackr</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400 hidden sm:inline">
              {user.first_name} {user.last_name}
            </span>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="gap-1.5"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error ? (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : fetching ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">PROJECT</Badge>
                <span className="text-slate-600">/</span>
                <code className="text-xs font-mono text-slate-500">{projectId}</code>
              </div>
              <h1 className="font-display text-3xl font-bold text-slate-100">Analytics</h1>
            </div>

            {/* Embed snippet */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-base">Tracking script</CardTitle>
                <CardDescription>Add this script to your site's &lt;head&gt;</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 flex-wrap">
                  <code className="flex-1 font-mono text-xs bg-slate-900 border border-slate-700 rounded px-3 py-2 text-blue-400 overflow-x-auto">
                    {trackingScript}
                  </code>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stat cards */}
            {summary && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={<Eye size={16} />}
                  label="Total visits"
                  value={summary.total_visits.toLocaleString()}
                />
                <StatCard
                  icon={<Users size={16} />}
                  label="Unique visitors"
                  value={summary.unique_visitors.toLocaleString()}
                />
                <StatCard
                  icon={<Clock size={16} />}
                  label="Avg session"
                  value={`${Math.round(summary.avg_session_duration)}s`}
                />
                <StatCard
                  icon={<TrendingUp size={16} />}
                  label="Bounce rate"
                  value={`${Math.round(summary.bounce_rate)}%`}
                />
              </div>
            )}

            {/* Chart */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle>Page views over time</CardTitle>
                    <CardDescription>Total and unique visitor counts</CardDescription>
                  </div>
                  <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                    {(["daily", "monthly"] as ChartRange[]).map((r) => (
                      <Button
                        key={r}
                        onClick={() => loadChart(r)}
                        variant={range === r ? "default" : "ghost"}
                        size="sm"
                        className="rounded-none capitalize"
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gUnique" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey={range === "daily" ? "date" : "month"}
                      tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontFamily: "JetBrains Mono",
                        color: "#e2e8f0",
                      }}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gVisits)" name="Visits" />
                    <Area type="monotone" dataKey="unique" stroke="#06b6d4" strokeWidth={1.5} fill="url(#gUnique)" name="Unique" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top pages */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-400" />
                  <div>
                    <CardTitle>Top pages</CardTitle>
                    <CardDescription>Pages with the most traffic</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {endpoints.length === 0 ? (
                  <p className="text-sm text-slate-400">No page data yet. Install the tracking script to start collecting visits.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {/* Header */}
                    <div className="grid grid-cols-12 px-3 py-2 border-b border-slate-700">
                      <span className="col-span-7 text-xs font-medium text-slate-400">Path</span>
                      <span className="col-span-3 text-xs font-medium text-right text-slate-400">Visits</span>
                      <span className="col-span-2 text-xs font-medium text-right text-slate-400">Avg time</span>
                    </div>
                    {endpoints.map((ep, i) => {
                      const maxVisits = endpoints[0]?.visits || 1;
                      const pct = (ep.visits / maxVisits) * 100;
                      return (
                        <div
                          key={i}
                          className="grid grid-cols-12 px-3 py-3 rounded-lg relative overflow-hidden group hover:bg-slate-700/30 transition-colors"
                        >
                          {/* Bar fill */}
                          <div
                            className="absolute left-0 top-0 bottom-0 rounded-lg opacity-50 group-hover:opacity-70 transition-opacity"
                            style={{ width: `${pct}%`, background: "rgba(59,130,246,0.1)" }}
                          />
                          <span className="col-span-7 font-mono text-sm relative z-10 text-slate-200">{ep.path}</span>
                          <span className="col-span-3 font-mono text-sm text-right relative z-10 text-blue-400">{ep.visits.toLocaleString()}</span>
                          <span className="col-span-2 font-mono text-sm text-right relative z-10 text-slate-400">{ep.avg_duration}s</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-slate-400">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
      </CardHeader>
      <CardContent>
        <span className="font-display font-bold text-2xl text-slate-100">{value}</span>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
