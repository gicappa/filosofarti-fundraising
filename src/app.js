import {
  calculateCampaignMetrics,
  resolveMilestones,
} from "./donationMetrics.js";

const euroFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

loadCampaign();

async function loadCampaign() {
  try {
    const response = await fetch("data/donations.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Errore nel caricamento dei dati: ${response.status}`);
    }

    renderCampaign(await response.json());
  } catch (error) {
    document.body.classList.add("data-error");
    document.querySelector("main").insertAdjacentHTML(
      "afterbegin",
      `<p class="error-message">Non riesco a leggere data/donations.json. Controlla che il file sia pubblicato correttamente.</p>`,
    );
    console.error(error);
  }
}

function renderCampaign(data) {
  const metrics = calculateCampaignMetrics(data);
  const milestones = resolveMilestones(data.raised, data.milestones);

  setText("campaign-subtitle", data.campaign.subtitle);
  setText("updated-at", `Aggiornato al ${formatDate(data.updatedAt)}`);
  setText("raised-amount", euroFormatter.format(data.raised));
  setText("goal-amount", euroFormatter.format(data.goal));
  setText("supporters-count", data.supporters);
  setText("progress-summary", `${metrics.progressPercent}% dell'obiettivo raggiunto. Mancano ${euroFormatter.format(metrics.remaining)}.`);
  setText("symbolic-seats", `${metrics.symbolicSeats}/${metrics.totalSeats}`);
  setText("supporter-number", `#${data.supporters}`);

  const cta = document.getElementById("campaign-cta");
  cta.textContent = data.campaign.ctaLabel;
  cta.href = data.campaign.ctaUrl;

  document.getElementById("progress-fill").style.width = `${metrics.progressPercent}%`;

  renderAuditorium(metrics);
  renderWordWall(data.words);
  renderList("questions-list", data.questions, (item) => item);
  renderList("latest-supporters", data.latestSupporters, (item) => item);
  renderList("business-supporters", data.businessSupporters, (item) => item);
  renderMilestones(milestones);
}

function renderAuditorium(metrics) {
  const auditorium = document.getElementById("auditorium");
  auditorium.innerHTML = "";
  auditorium.style.setProperty("--seat-count", metrics.totalSeats);

  for (let index = 0; index < metrics.totalSeats; index += 1) {
    const seat = document.createElement("span");
    seat.className = index < metrics.symbolicSeats ? "seat is-lit" : "seat";
    seat.setAttribute(
      "aria-label",
      index < metrics.symbolicSeats
        ? `Posto simbolico ${index + 1} acceso`
        : `Posto simbolico ${index + 1} non ancora acceso`,
    );
    auditorium.appendChild(seat);
  }
}

function renderWordWall(words = []) {
  const wall = document.getElementById("word-wall");
  wall.innerHTML = "";

  words.forEach((word, index) => {
    const chip = document.createElement("span");
    chip.textContent = word;
    chip.className = `word-chip tone-${(index % 4) + 1}`;
    wall.appendChild(chip);
  });
}

function renderList(id, items = [], formatItem) {
  const list = document.getElementById(id);
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = formatItem(item);
    list.appendChild(li);
  });
}

function renderMilestones(milestones) {
  const list = document.getElementById("milestones");
  list.innerHTML = "";

  milestones.forEach((milestone) => {
    const item = document.createElement("li");
    item.className = milestone.reached ? "reached" : "";
    item.innerHTML = `
      <span>${euroFormatter.format(milestone.amount)}</span>
      <strong>${milestone.label}</strong>
      <p>${milestone.description}</p>
    `;
    list.appendChild(item);
  });
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
