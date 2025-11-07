// Load Schemes from JSON
fetch("scheme.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("schemeList");
    container.innerHTML = ""; // Clear loading text

    data.forEach(scheme => {
      const card = document.createElement("div");
      card.className = "scheme-card";
      card.innerHTML = `
        <h3>${scheme.title}</h3>
        <p>${scheme.description}</p>
        <a href="${scheme.link}" target="_blank">View Details</a>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    document.getElementById("schemeList").innerHTML = "<p>⚠️ Failed to load schemes.</p>";
    console.error("Error loading schemes:", error);
  });

// Filter function
function filterSchemes() {
  const input = document.getElementById("searchBox").value.toLowerCase();
  const cards = document.getElementsByClassName("scheme-card");

  Array.from(cards).forEach(card => {
    const title = card.getElementsByTagName("h3")[0].innerText.toLowerCase();
    card.style.display = title.includes(input) ? "block" : "none";
  });
}
