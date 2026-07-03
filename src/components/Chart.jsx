import { useState } from "react";

function Chart({ chartData }) {
  const [period, setPeriod] = useState("Tháng này");
  const yLabels = ["100%", "75%", "50%", "25%", "0%"];
  const chartHeight = 180;
  const chartWidth = 480;
  const paddingLeft = 40;
  const paddingBottom = 30;
  const paddingTop = 10;

  const plotWidth = chartWidth - paddingLeft - 20;
  const plotHeight = chartHeight - paddingBottom - paddingTop;

  const points = chartData.values.map((value, index) => {
    const x = paddingLeft + (index / (chartData.values.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight - (value / 100) * plotHeight;
    return { x, y, value };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;

  return (
    <article className="rounded-[14px] border border-slate-200 bg-white px-7 py-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-slate-800">
          {chartData.title}
        </h2>
        <select
          className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white bg-[length:12px] bg-[position:right_10px_center] bg-no-repeat py-2 pl-3.5 pr-8 text-[13px] text-slate-800"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          }}
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option>Tháng này</option>
          <option>Tháng trước</option>
          <option>Năm nay</option>
        </select>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yLabels.map((label, i) => {
          const y = paddingTop + (i / (yLabels.length - 1)) * plotHeight;
          return (
            <g key={label}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - 10}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px]"
              >
                {label}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#areaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#fff"
            stroke="#8b5cf6"
            strokeWidth="2.5"
          />
        ))}

        {chartData.weeks.map((week, i) => {
          const x =
            paddingLeft + (i / (chartData.weeks.length - 1)) * plotWidth;
          return (
            <text
              key={week}
              x={x}
              y={chartHeight - 6}
              textAnchor="middle"
              className="fill-slate-400 text-[11px]"
            >
              {week}
            </text>
          );
        })}
      </svg>
    </article>
  );
}

export default Chart;
