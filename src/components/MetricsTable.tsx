import type { MetricRow } from '../content/portfolio';

export function MetricsTable({ metrics }: { metrics: { caption: string; rows: MetricRow[] } }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <caption className="label">{metrics.caption}</caption>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Before</th>
            <th scope="col">After</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody>
          {metrics.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.before}</td>
              <td>{r.after}</td>
              <td className="delta">{r.change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
