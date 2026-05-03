import {
  BarChart, Bar, Cell, CartesianGrid, Legend, PieChart, Pie, ResponsiveContainer,
  Tooltip, XAxis, YAxis, ScatterChart, Scatter
} from 'recharts';

const riskColors = ['#ff5d8f', '#ffb449', '#4fd1a5'];

export default function ChartsPanel({ chartData }) {
  return (
    <section className="charts-grid">
      <div className="panel">
        <div className="panel-header"><h2>Risk Distribution</h2></div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={chartData.riskDistribution} dataKey="value" nameKey="name" outerRadius={110} innerRadius={55}>
                {chartData.riskDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={riskColors[index % riskColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2>Weakness Frequency</h2></div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.weaknessFrequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28375d" />
              <XAxis dataKey="name" stroke="#d7ddf5" />
              <YAxis stroke="#d7ddf5" />
              <Tooltip />
              <Bar dataKey="count" fill="#7d74ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2>Course Risk Breakdown</h2></div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.courseBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#28375d" />
              <XAxis dataKey="course" stroke="#d7ddf5" />
              <YAxis stroke="#d7ddf5" />
              <Tooltip />
              <Legend />
              <Bar dataKey="High" fill="#ff5d8f" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Medium" fill="#ffb449" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Low" fill="#4fd1a5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2>Attendance vs Quiz Score</h2></div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid stroke="#28375d" />
              <XAxis type="number" dataKey="attendance" name="Attendance" unit="%" stroke="#d7ddf5" />
              <YAxis type="number" dataKey="quizzes" name="Quizzes" unit="%" stroke="#d7ddf5" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Students" data={chartData.scatterData} fill="#00d4ff" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
