"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function ContentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fill: "#112D4E", fontSize: 12 }}
          axisLine={{ stroke: "#112D4E" }}
          tickLine={{ stroke: "#112D4E" }}
        />
        <YAxis
          type="category"
          dataKey="type"
          tick={{ fill: "#112D4E", fontSize: 14 }}
          axisLine={{ stroke: "#112D4E" }}
          tickLine={{ stroke: "#112D4E" }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#112D4E", borderRadius: "8px", border: "none" }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#fff" }}
        />
        <Bar dataKey="count" fill="#112D4E" radius={[6, 6, 6, 6]}>
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: "#FACC15", fontWeight: "bold" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
