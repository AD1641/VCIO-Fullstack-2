import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Search,
  ShieldCheck,
  Lock,
  BarChart3,
  Download,
  Info,
} from "lucide-react";
import "../styles/dashboard.css";

// --- MOCK DATA ---
const threatData = [
  { name: "Malware", value: 65 },
  { name: "Phishing", value: 50 },
  { name: "Ransomware", value: 40 },
  { name: "DDoS", value: 30 },
  { name: "Insider", value: 20 },
];

const complianceData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 35 },
  { name: "Apr", value: 50 },
  { name: "May", value: 70 },
  { name: "Jun", value: 60 },
  { name: "Jul", value: 80 },
];

const mfaData = [
  { name: "Adopted", value: 75 },
  { name: "Pending", value: 25 },
];

const licenseData = [
  { name: "Used", value: 65 },
  { name: "Unused", value: 35 },
];

// Colors from the design
const COLORS = {
  primary: "#D32F2F", // The Red color
  secondary: "#2C3E50", // Dark Blue/Black
  gray: "#E0E0E0",
  yellow: "#F1C40F",
  purple: "#8E44AD",
};

export default function Dashboard(): React.ReactElement {

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Analytics</h2>
        <button className="btn-outline">
          PDF report <Download size={16} />
        </button>
      </header>

      {/* KPI Metrics Row */}
      <div className="metrics-grid">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="metric-value">90</div>
            <div className="metric-label">Open threats</div>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="analytics-grid">
        
        {/* Card 1: Threat Detection (Horizontal Bar) */}
        <div className="analytics-card">
          <div className="card-header">
            <Search size={20} />
            <h3>Threat detection analysis</h3>
            <Info size={16} className="info-icon" />
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={threatData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} />
                <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <InsightBox />
        </div>

        {/* Card 2: Device Compliance (Vertical Bar) */}
        <div className="analytics-card">
          <div className="card-header">
            <ShieldCheck size={20} />
            <h3>Device compliance overview</h3>
            <Info size={16} className="info-icon" />
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <InsightBox />
        </div>

        {/* Card 3: MFA Adoption (Donut) */}
        <div className="analytics-card">
          <div className="card-header">
            <Lock size={20} />
            <h3>MFA adoption status</h3>
            <Info size={16} className="info-icon" />
          </div>
          <div className="chart-area center-content">
            <div className="donut-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                    data={mfaData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    >
                    <Cell fill={COLORS.secondary} />
                    <Cell fill={COLORS.yellow} />
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
                <div className="donut-label">
                    <span>Label</span>
                    <strong>Text</strong>
                </div>
            </div>
          </div>
          <InsightBox showInput={true} />
        </div>

        {/* Card 4: Licence Utilization (Donut/Gauge) */}
        <div className="analytics-card">
          <div className="card-header">
            <BarChart3 size={20} />
            <h3>Licence utilization</h3>
            <Info size={16} className="info-icon" />
          </div>
          <div className="chart-area center-content">
            <div className="donut-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                    data={licenseData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    >
                    <Cell fill={COLORS.secondary} />
                    <Cell fill={COLORS.gray} />
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
                <div className="donut-label semi-circle">
                    <span>Label</span>
                    <strong>Text</strong>
                </div>
            </div>
          </div>
          <InsightBox />
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h3>Summary</h3>
        <div className="summary-tables">
             {/* Table 1 */}
            <div className="table-card">
                <div className="table-header secure">Security Summary</div>
                <table>
                    <thead>
                        <tr>
                            <th>Area</th>
                            <th>Current Status</th>
                            <th>Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Threat Detection</td>
                            <td>90 open</td>
                            <td><span className="badge high">High</span></td>
                        </tr>
                        <tr>
                            <td>Device Compliance</td>
                            <td>45.6%</td>
                            <td><span className="badge medium">Medium</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Table 2 */}
            <div className="table-card">
                <div className="table-header cost">Cost Optimization Overview</div>
                 <table>
                    <thead>
                        <tr>
                            <th>Cost Area</th>
                            <th>Current Value</th>
                            <th>Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Licence Utilization</td>
                            <td>12.1%</td>
                            <td><span className="badge high">High</span></td>
                        </tr>
                        <tr>
                            <td>Waste Percentage</td>
                            <td>45.6%</td>
                            <td><span className="badge high">High</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component for the Red Insight Box ---
function InsightBox({ showInput = false }: { showInput?: boolean }) {
  return (
    <div className="insight-container">
      <div className="insight-box">
        <div className="insight-header">Vcio insight</div>
        <div className="insight-content">
          The detection of 56 high-risk threats among 284 total threats is
          concerning, indicating significant vulnerabilities.
        </div>
      </div>
      
      <div className="insight-actions">
        {showInput ? (
            <div className="chat-input-row">
                 <input type="text" placeholder="Type your message" />
                 <button className="send-btn">Send</button>
            </div>
        ) : (
            <button className="follow-up-btn">Ask follow-up question</button>
        )}
      </div>
    </div>
  );
}
