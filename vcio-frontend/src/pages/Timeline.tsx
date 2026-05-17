import React, { useState,useEffect, useMemo } from "react";
import "../styles/timeline.css";



type Licence = {
  id: string;
  name: string;
  date: string;
  provider: string;
  cost: string;
  status: "Expired" | "Renew" | "Active" | "Expires Soon";
};

export default function Timeline() {

  const [filter, setFilter] = useState("all");
  
  const [expandedMonths, setExpandedMonths] = useState<string[]>(["May 2026"]);

  const [data, setData] = useState<{ licences: Licence[] } | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchLicences = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/licences"
        );

        const result = await response.json();

        setData({ licences: result });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLicences();
  }, []);


  const allData = useMemo(() => {
    if (!data?.licences) return [];

    const grouped: Record<string, Licence[]> = {};

    data.licences.forEach((l: any) => {
      const month = new Date(l.expiryDate).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push({
        id: l.id,
        name: l.name,
        provider: l.provider,
        cost: l.cost,
        date: l.expiryDate,
        status: l.status,
      });
    });

    return Object.entries(grouped).map(([month, licences]) => ({
      month,
      licences,
    }));
  }, [data]);



  // Filter Logic
  const filteredLicences = useMemo(() => {
    if (filter === "all") return allData;

    return allData
      .map(monthBlock => ({
        ...monthBlock,
        licences: monthBlock.licences.filter(l => {
          if (filter === "expired") return l.status === "Expired";
          if (filter === "renew") return l.status === "Renew";
          if (filter === "soon") return l.status === "Expires Soon";
          return true;
        })
      }))
      .filter(month => month.licences.length > 0);
  }, [filter, allData]);

  // Toggle Logic
  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) =>
      prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month]
    );
  };

  const isExpanded = (month: string) => expandedMonths.includes(month);

  // Counts Logic
  const counts = useMemo(() => {
    if (!data?.licences) {
      return { all: 0, expired: 0, soon: 0, renew: 0 };
    }

    const now = new Date();
    const soonThreshold = new Date();
    soonThreshold.setDate(now.getDate() + 30);

    let expired = 0;
    let renew = 0;
    let soon = 0;

    data.licences.forEach((l: any) => {
      const expiry = new Date(l.expiryDate);

      if (l.status === "Expired") expired++;
      if (l.status === "Renew") renew++;

      if (l.status === "Expires Soon") soon++;
    });

    return {
      all: data.licences.length,
      expired,
      renew,
      soon
    };
  }, [data]);
  if (loading) return <div>Loading licences...</div>;
  if (error) return <div>Error loading licences</div>;


  return (
    <div className="timeline-container">
      <h2>Licence details</h2>

      {/* Filter Section */}
      <div className="filters">
        <button
          className={`filter-box ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          <span className="filter-label">All licences</span>
          <span className="filter-count">{counts.all}</span>
        </button>
        <button
          className={`filter-box ${filter === "expired" ? "active" : ""}`}
          onClick={() => setFilter("expired")}
        >
          <span className="filter-label">Expired</span>
          <span className="filter-count expired">{counts.expired}</span>
        </button>
        <button
          className={`filter-box ${filter === "soon" ? "active" : ""}`}
          onClick={() => setFilter("soon")}
        >
          <span className="filter-label">Expires soon</span>
          <span className="filter-count soon">{counts.soon}</span>
        </button>
        <button
          className={`filter-box ${filter === "renew" ? "active" : ""}`}
          onClick={() => setFilter("renew")}
        >
          <span className="filter-label">Renew</span>
          <span className="filter-count renew">{counts.renew}</span>
        </button>
      </div>

      {/* Timeline List Section */}
      {filteredLicences.map((monthBlock) => (
        <div key={monthBlock.month} className="month-block">
          {/* Header */}
          <div
            className="month-header"
            onClick={() => toggleMonth(monthBlock.month)}
          >
            <div className="month-info">
              <strong>{monthBlock.month}</strong>
              <span>
                {monthBlock.licences.length} licence
                {monthBlock.licences.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className={`chevron ${isExpanded(monthBlock.month) ? "open" : ""}`}>
              {/* SVG Chevron */}
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L13 1" stroke="#E60000" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Content (Only if expanded) */}
          {isExpanded(monthBlock.month) && (
            <div className="licence-list">
              {monthBlock.licences.map((l) => (
                <div key={l.id} className="licence-item">
                  <div className="licence-name">{l.name}</div>

                  {/* CSS Grid Layout for Multi-colored headers */}
                  <div className="licence-grid">
                    {/* Headers */}
                    <div className="grid-header header-date">Exact date</div>
                    <div className="grid-header header-provider">Provider</div>
                    <div className="grid-header header-cost">Cost</div>
                    <div className="grid-header header-status">Status</div>

                    {/* Data Cells */}
                    <div className="grid-cell">{l.date}</div>
                    <div className="grid-cell">{l.provider}</div>
                    <div className="grid-cell">{l.cost}</div>
                    <div className="grid-cell">
                      <span className={`status-badge ${l.status.toLowerCase().replace(" ", "-")}`}>
                        {l.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
