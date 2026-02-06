// ============================
// ELEMENTS
// ============================
const form = document.getElementById("customForm");
const progressBar = document.getElementById("progressBar");

const thankyou = document.getElementById("thankyou");
const restartBtn = document.getElementById("restartBtn");

const sections = Array.from(document.querySelectorAll(".section"));

// Error popup
const popupOverlay = document.getElementById("popupOverlay");
const popupCloseBtn = document.getElementById("popupCloseBtn");

// ============================
// STATE
// ============================
let current = 0;

// ============================
// POPUP
// ============================
function showPopup() {
  popupOverlay.classList.add("show");
}
function closePopup() {
  popupOverlay.classList.remove("show");
}

popupCloseBtn.addEventListener("click", closePopup);
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// ============================
// HELPERS
// ============================
function visibleSections() {
  return sections.filter((s) => s.style.display !== "none");
}

function showSection(index) {
  const vis = visibleSections();

  if (index < 0) index = 0;
  if (index >= vis.length) index = vis.length - 1;

  sections.forEach((s) => s.classList.remove("active"));
  vis[index].classList.add("active");

  const progress = Math.round(((index + 1) / vis.length) * 100);
  progressBar.style.width = progress + "%";

  window.scrollTo({ top: 0, behavior: "smooth" });
  current = index;
}

// ============================
// ROUTING (Occupation)
// ============================
function handleOccupationRouting() {
  const occupation = document.querySelector(
    'input[name="entry.455331503"]:checked'
  )?.value;

  const studentSection = document.getElementById("studentSection");
  const facultySection = document.getElementById("facultySection");
  const techSection = document.getElementById("techSection");
  const nonTechSection = document.getElementById("nonTechSection");

  // Reset all
  studentSection.style.display = "none";
  facultySection.style.display = "none";
  techSection.style.display = "none";
  nonTechSection.style.display = "none";

  if (occupation === "Student") studentSection.style.display = "";
  else if (occupation === "Faculty / Educator") facultySection.style.display = "";
  else if (occupation === "Working Professional (Tech field)") techSection.style.display = "";
  else if (occupation === "Working Professional (Non-tech)") nonTechSection.style.display = "";
  else {
    // Currently not working -> skip these occupation-specific sections
  }
}

// ============================
// REQUIRED SYNC FOR HIDDEN
// ============================
function syncRequiredForHiddenSections() {
  sections.forEach((section) => {
    const isHidden = section.style.display === "none";

    section.querySelectorAll("[required]").forEach((el) => {
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

// ============================
// VALIDATION
// ============================
function validateCurrentSection() {
  const vis = visibleSections();
  const active = vis[current];
  if (!active) return false;

  const requiredFields = active.querySelectorAll("[required]");

  for (const field of requiredFields) {
    // Radio group
    if (field.type === "radio") {
      const group = active.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);
      if (!checked) return false;
    }

    // Text/email/textarea
    if (
      field.type === "text" ||
      field.type === "email" ||
      field.tagName === "TEXTAREA"
    ) {
      if (!field.value.trim()) return false;
    }
  }

  return true;
}

function clearHighlights() {
  const vis = visibleSections();
  const active = vis[current];
  if (!active) return;
  active.querySelectorAll(".field").forEach((f) => f.classList.remove("error"));
}

function highlightMissingRequired() {
  const vis = visibleSections();
  const active = vis[current];
  if (!active) return;

  clearHighlights();

  let firstBad = null;

  const requiredFields = active.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    // Radio group
    if (field.type === "radio") {
      const group = active.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);

      if (!checked) {
        const wrapper = field.closest(".field");
        if (wrapper) {
          wrapper.classList.add("error");
          if (!firstBad) firstBad = wrapper;
        }
      }
    }

    // Text/email/textarea
    if (
      field.type === "text" ||
      field.type === "email" ||
      field.tagName === "TEXTAREA"
    ) {
      if (!field.value.trim()) {
        const wrapper = field.closest(".field");
        if (wrapper) {
          wrapper.classList.add("error");
          if (!firstBad) firstBad = wrapper;
        }
      }
    }
  });

  if (firstBad) {
    setTimeout(() => {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }
}

// ============================
// NAVIGATION
// ============================
function goNext() {
  if (!validateCurrentSection()) {
    showPopup();
    highlightMissingRequired();
    return;
  }

  const vis = visibleSections();
  if (current < vis.length - 1) {
    showSection(current + 1);
  }
}

function goBack() {
  if (current > 0) showSection(current - 1);
}

// ============================
// BUTTON EVENTS
// ============================

// Section 1 next
document.getElementById("nextBtn1").addEventListener("click", () => {
  handleOccupationRouting();
  syncRequiredForHiddenSections();
  goNext();
});

// Student section
document.getElementById("nextBtn2")?.addEventListener("click", goNext);
document.getElementById("backBtn2")?.addEventListener("click", goBack);

// Faculty section
document.getElementById("nextBtn3")?.addEventListener("click", goNext);
document.getElementById("backBtn3")?.addEventListener("click", goBack);

// Tech section
document.getElementById("nextBtnTech")?.addEventListener("click", goNext);
document.getElementById("backBtnTech")?.addEventListener("click", goBack);

// Non-tech section
document.getElementById("nextBtnNonTech")?.addEventListener("click", goNext);
document.getElementById("backBtnNonTech")?.addEventListener("click", goBack);

// AI section
document.getElementById("nextBtnAI")?.addEventListener("click", goNext);
document.getElementById("backBtnAI")?.addEventListener("click", goBack);

// Time section
document.getElementById("nextBtnTime")?.addEventListener("click", goNext);
document.getElementById("backBtnTime")?.addEventListener("click", goBack);

// Tech ecosystem section
document.getElementById("nextBtnEco")?.addEventListener("click", goNext);
document.getElementById("backBtnEco")?.addEventListener("click", goBack);

// Privacy section
document.getElementById("nextBtnPrivacy")?.addEventListener("click", goNext);
document.getElementById("backBtnPrivacy")?.addEventListener("click", goBack);

// Final section
document.getElementById("backBtnFinal")?.addEventListener("click", goBack);

// ============================
// SUBMIT
// ============================
form.addEventListener("submit", function (e) {
  if (!validateCurrentSection()) {
    e.preventDefault();
    showPopup();
    highlightMissingRequired();
    return;
  }

  // allow submission into iframe
  setTimeout(() => {
    form.style.display = "none";
    thankyou.style.display = "block";
    progressBar.style.width = "100%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

// ============================
// RESTART
// ============================
restartBtn.addEventListener("click", () => {
  form.reset();
  form.style.display = "block";
  thankyou.style.display = "none";

  // Reset occupation sections
  document.getElementById("studentSection").style.display = "";
  document.getElementById("facultySection").style.display = "";
  document.getElementById("techSection").style.display = "";
  document.getElementById("nonTechSection").style.display = "";

  // Hide them again until occupation selected
  document.getElementById("studentSection").style.display = "none";
  document.getElementById("facultySection").style.display = "none";
  document.getElementById("techSection").style.display = "none";
  document.getElementById("nonTechSection").style.display = "none";

  syncRequiredForHiddenSections();
  showSection(0);
});

// ============================
// INIT
// ============================

// hide occupation-specific sections initially
document.getElementById("studentSection").style.display = "none";
document.getElementById("facultySection").style.display = "none";
document.getElementById("techSection").style.display = "none";
document.getElementById("nonTechSection").style.display = "none";

showSection(0);
progressBar.style.width = "10%";
