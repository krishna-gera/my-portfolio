const form = document.getElementById("customForm");
const sections = Array.from(document.querySelectorAll(".section"));

const progressBar = document.getElementById("progressBar");
const metaTitle = document.getElementById("metaTitle");
const metaSub = document.getElementById("metaSub");

const thankyou = document.getElementById("thankyou");
const restartBtn = document.getElementById("restartBtn");

let current = 0;

function getOccupation() {
  return document.querySelector('input[name="entry.455331503"]:checked')?.value || "";
}

/**
 * Occupation Routing:
 * - Student -> show student section only
 * - Faculty -> show faculty section only
 * - Working Tech -> show tech section only
 * - Working Non-tech -> show non-tech section only
 * - Not working -> hide all occupation-specific sections
 */
function applyOccupationRouting() {
  const occupation = getOccupation();

  const student = document.getElementById("studentSection");
  const faculty = document.getElementById("facultySection");
  const tech = document.getElementById("techSection");
  const nonTech = document.getElementById("nonTechSection");

  // reset
  student.style.display = "";
  faculty.style.display = "";
  tech.style.display = "";
  nonTech.style.display = "";

  if (occupation === "Student") {
    faculty.style.display = "none";
    tech.style.display = "none";
    nonTech.style.display = "none";
  }
  else if (occupation === "Faculty / Educator") {
    student.style.display = "none";
    tech.style.display = "none";
    nonTech.style.display = "none";
  }
  else if (occupation === "Working Professional (Tech field)") {
    student.style.display = "none";
    faculty.style.display = "none";
    nonTech.style.display = "none";
  }
  else if (occupation === "Working Professional (Non-tech)") {
    student.style.display = "none";
    faculty.style.display = "none";
    tech.style.display = "none";
  }
  else {
    // currently not working
    student.style.display = "none";
    faculty.style.display = "none";
    tech.style.display = "none";
    nonTech.style.display = "none";
  }
}

/**
 * If a section is hidden, remove required attributes
 * so submission doesn't get blocked.
 */
function syncRequiredForHiddenSections() {
  sections.forEach((section) => {
    const isHidden = section.style.display === "none";
    const req = section.querySelectorAll("[required]");

    req.forEach((el) => {
      if (isHidden) {
        el.dataset.wasRequired = "true";
        el.removeAttribute("required");
      } else {
        if (el.dataset.wasRequired === "true") {
          el.setAttribute("required", "");
        }
      }
    });
  });
}

function visibleSections() {
  return sections.filter((s) => s.style.display !== "none");
}

function updateMeta() {
  const vis = visibleSections();
  const activeSection = vis[current];

  const title = activeSection.dataset.title || "Survey";
  const sub = activeSection.dataset.sub || "";

  metaTitle.textContent = `Section ${current + 1} of ${vis.length}`;
  metaSub.textContent = title;

  const progress = Math.round(((current + 1) / vis.length) * 100);
  progressBar.style.width = progress + "%";
}

function showCurrent() {
  sections.forEach((s) => s.classList.remove("active"));

  const vis = visibleSections();
  if (!vis[current]) current = 0;

  vis[current].classList.add("active");
  updateMeta();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateCurrentSection() {
  const vis = visibleSections();
  const active = vis[current];

  const requiredInputs = active.querySelectorAll("[required]");

  // check required groups properly
  for (const field of requiredInputs) {
    if (field.type === "radio") {
      const group = active.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);
      if (!checked) return false;
    }

    if (field.type === "text" || field.type === "email" || field.tagName === "TEXTAREA") {
      if (!field.value.trim()) return false;
    }
  }

  return true;
}

function goNext() {
  if (!validateCurrentSection()) {
    alert("Please fill all required fields in this section.");
    return;
  }

  current++;
  showCurrent();
}

function goBack() {
  current--;
  if (current < 0) current = 0;
  showCurrent();
}

// Handle nav buttons
document.addEventListener("click", (e) => {
  const next = e.target.closest("[data-next]");
  const back = e.target.closest("[data-back]");

  if (next) {
    // Apply routing only when leaving first section (occupation selected)
    const vis = visibleSections();
    const active = vis[current];

    // If leaving Basic Details, apply routing
    if (active && active.querySelector('input[name="entry.455331503"]')) {
      applyOccupationRouting();
      syncRequiredForHiddenSections();

      // Reset current so flow is consistent
      current = 0;
      showCurrent();

      // Now move forward
      goNext();
      return;
    }

    goNext();
  }

  if (back) goBack();
});

// Submit handling
form.addEventListener("submit", function (e) {
  if (!validateCurrentSection()) {
    e.preventDefault();
    alert("Please fill all required fields.");
    return;
  }

  // allow iframe submission, show thank you
  setTimeout(() => {
    form.style.display = "none";
    thankyou.style.display = "block";
    progressBar.style.width = "100%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

// Restart
restartBtn.addEventListener("click", () => {
  form.reset();
  form.style.display = "block";
  thankyou.style.display = "none";

  // reset routing
  document.getElementById("studentSection").style.display = "";
  document.getElementById("facultySection").style.display = "";
  document.getElementById("techSection").style.display = "";
  document.getElementById("nonTechSection").style.display = "";

  // reset required
  sections.forEach((section) => {
    section.querySelectorAll("[data-was-required]").forEach((el) => {
      el.setAttribute("required", "");
    });
  });

  current = 0;
  showCurrent();
});

// Init
showCurrent();

