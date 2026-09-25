import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard, ChartTooltip, axisProps, cursorProps } from './ChartKit';

// Distribution simple (une barre par catégorie). data: [{ label, value, color }]
export function CountBarChart({ title, subtitle, data, height = 220, labelWidth = 130, unit = '' }) {
  return (
    <ChartCard title={title} subtitle={subtitle} height={height} table={{ columns: ['Catégorie', 'Valeur'], rows: data.map((d) => [d.label, `${d.value}${unit}`]) }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, left: 8, bottom: 0 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis type="category" dataKey="label" {...axisProps} axisLine={false} width={labelWidth} />
          <Tooltip cursor={cursorProps} content={<ChartTooltip unit={unit} />} />
          <Bar dataKey="value" name={title} radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((d) => <Cell key={d.label} fill={d.color || 'var(--series-1)'} />)}
            <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
