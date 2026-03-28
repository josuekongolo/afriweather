"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { GraphDataPoint } from "@/lib/types";

interface WeatherGraphProps {
  data: GraphDataPoint[];
  variant: "simple" | "detailed";
}

/* Shared axis / grid config */
const grid = { strokeDasharray: "3 3", stroke: "#f0f1f4", vertical: false };
const axisTick = { fontSize: 10, fill: "#8b91a0" };
const axisLine = { stroke: "#e8eaef" };
const tooltipStyle = {
  backgroundColor: "white",
  border: "1px solid #e8eaef",
  borderRadius: 10,
  fontSize: 11,
  padding: "6px 10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

function ChartShell({
  children,
  label,
  height,
}: {
  children: React.ReactNode;
  label: string;
  height: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm p-3 sm:p-5">
      <p className="text-[12px] sm:text-[13px] font-semibold text-[var(--text-secondary)] mb-3">
        {label}
      </p>
      {/* Horizontal scroll on mobile so the chart isn't squished */}
      <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
        <div style={{ minWidth: 480, height }}>{children}</div>
      </div>
    </div>
  );
}

export function WeatherGraph({ data, variant }: WeatherGraphProps) {
  const xInterval = Math.max(Math.floor(data.length / 10), 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Temperature + Precipitation */}
      <ChartShell label="Temperature & Precipitation" height={220}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: -15, bottom: 0 }}
          >
            <CartesianGrid {...grid} />
            <XAxis
              dataKey="label"
              tick={axisTick}
              interval={xInterval}
              axisLine={axisLine}
              tickLine={false}
            />
            <YAxis
              yAxisId="temp"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
              width={35}
            />
            <YAxis
              yAxisId="precip"
              orientation="right"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
              domain={[0, "auto"]}
              width={28}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === "temp") return [`${v}°C`, "Temp"];
                if (name === "dewPoint") return [`${v}°C`, "Dew Pt"];
                if (name === "precipitation") return [`${v} mm`, "Rain"];
                return [`${v}`, String(name)];
              }}
            />
            <Bar
              yAxisId="precip"
              dataKey="precipitation"
              fill="#3b82f6"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
              barSize={5}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temp"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: "#ef4444" }}
            />
            {variant === "detailed" && (
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="dewPoint"
                stroke="#1a1d27"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                opacity={0.4}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartShell>

      {/* Wind */}
      <ChartShell label="Wind Speed" height={150}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: -15, bottom: 0 }}
          >
            <CartesianGrid {...grid} />
            <XAxis
              dataKey="label"
              tick={axisTick}
              interval={xInterval}
              axisLine={axisLine}
              tickLine={false}
            />
            <YAxis
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${Number(value)} m/s`, "Wind"]}
            />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: "#8b5cf6" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartShell>

      {/* Pressure — detailed only */}
      {variant === "detailed" && (
        <ChartShell label="Atmospheric Pressure" height={150}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 4, left: -15, bottom: 0 }}
            >
              <CartesianGrid {...grid} />
              <XAxis
                dataKey="label"
                tick={axisTick}
                interval={xInterval}
                axisLine={axisLine}
                tickLine={false}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
                width={40}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${Number(value)} hPa`, "Pressure"]}
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#10b981"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#10b981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartShell>
      )}

      {/* Humidity — detailed only */}
      {variant === "detailed" && (
        <ChartShell label="Humidity" height={150}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 4, left: -15, bottom: 0 }}
            >
              <CartesianGrid {...grid} />
              <XAxis
                dataKey="label"
                tick={axisTick}
                interval={xInterval}
                axisLine={axisLine}
                tickLine={false}
              />
              <YAxis
                tick={axisTick}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                width={35}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${Number(value)}%`, "Humidity"]}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#0ea5e9"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: "#0ea5e9" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartShell>
      )}

      {/* Legend — compact, below all charts */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[11px] text-[var(--text-tertiary)]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-500 rounded-full inline-block" />
          Temperature &deg;C
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 bg-blue-500/60 rounded-sm inline-block" />
          Precipitation mm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-violet-500 rounded-full inline-block" />
          Wind m/s
        </span>
        {variant === "detailed" && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
              Pressure hPa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-500 rounded-full inline-block" />
              Humidity %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-800/40 rounded-full inline-block border-dashed" />
              Dew Point &deg;C
            </span>
          </>
        )}
      </div>
    </div>
  );
}
