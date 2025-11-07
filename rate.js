// rate.js 🌾 — Dynamic Daily Mandi Rate Fetcher

const API_KEY = "579b464db66ec23bdd000001ffae73b51c6f4a526e7261bc5d4f51fd";
const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=100`;

const stateSelect = document.getElementById("stateSelect");
const marketSelect = document.getElementById("marketSelect");
const commoditySelect = document.getElementById("commoditySelect");
const rateResult = document.getElementById("rateResult");
const topTable = document.getElementById("topTable").querySelector("tbody");
const trendChartCanvas = document.getElementById("trendChart");

let trendChart;

// Fetch rates based on filters
async function fetchRates() {
  const state = stateSelect.value;
  const commodity = commoditySelect.value;

  if (!state && !commodity) {
    rateResult.innerHTML = "<p>⚠️ Please select at least State or Commodity.</p>";
    return;
  }

  rateResult.innerHTML = "<p>⏳ Fetching latest mandi rates...</p>";

  try {
    const response = await fetch(`${API_URL}&filters[state]=${state}&filters[commodity]=${commodity}`);
    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      rateResult.innerHTML = "<p>No records found for your selection.</p>";
      return;
    }

    displayRates(data.records);
    displayTopCommodities(data.records);
    showPriceTrend(data.records, commodity);
  } catch (error) {
    console.error("Error fetching data:", error);
    rateResult.innerHTML = "<p>⚠️ Failed to fetch data. Try again later.</p>";
  }
}

// Display mandi rate table
function displayRates(records) {
  const tableHTML = `
    <table class="rate-table">
      <thead>
        <tr>
          <th>Commodity</th>
          <th>Variety</th>
          <th>Market</th>
          <th>District</th>
          <th>State</th>
          <th>Min Price (₹/q)</th>
          <th>Max Price (₹/q)</th>
          <th>Modal Price (₹/q)</th>
          <th>Arrival Date</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .map(
            (item) => `
          <tr>
            <td>${item.commodity || "-"}</td>
            <td>${item.variety || "-"}</td>
            <td>${item.market || "-"}</td>
            <td>${item.district || "-"}</td>
            <td>${item.state || "-"}</td>
            <td>${item.min_price || "-"}</td>
            <td>${item.max_price || "-"}</td>
            <td>${item.modal_price || "-"}</td>
            <td>${item.arrival_date || "-"}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
  rateResult.innerHTML = tableHTML;
}

// Show top 10 commodities by modal price
function displayTopCommodities(records) {
  const topCommodities = [...records]
    .sort((a, b) => b.modal_price - a.modal_price)
    .slice(0, 10);

  topTable.innerHTML = topCommodities
    .map(
      (item) => `
      <tr>
        <td>${item.commodity}</td>
        <td>${item.modal_price}</td>
      </tr>`
    )
    .join("");
}

// Show price trend using Chart.js
function showPriceTrend(records, commodity) {
  if (!commodity) return;

  const recent = records.slice(0, 7).reverse();
  const labels = recent.map((r) => r.arrival_date || "N/A");
  const prices = recent.map((r) => parseInt(r.modal_price) || 0);

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(trendChartCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${commodity} Modal Price (₹/q)`,
          data: prices,
          borderColor: "#2e7d32",
          backgroundColor: "rgba(46,125,50,0.1)",
          tension: 0.3,
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true, position: "top" } },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: "Price (₹)" } },
        x: { title: { display: true, text: "Date" } },
      },
    },
  });
}

// Populate Market options dynamically (basic demo)
stateSelect.addEventListener("change", async () => {
  const state = stateSelect.value;
  marketSelect.innerHTML = `<option>Loading...</option>`;

  try {
    const response = await fetch(`${API_URL}&filters[state]=${state}`);
    const data = await response.json();

    const markets = [...new Set(data.records.map((r) => r.market))];
    marketSelect.innerHTML = `<option value="">Select Market</option>` + markets
      .map((m) => `<option value="${m}">${m}</option>`)
      .join("");
  } catch (error) {
    console.error("Error fetching markets:", error);
  }
});
setInterval(fetchRates, 300000); // Refresh every 5 minutes
