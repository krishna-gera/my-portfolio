// ============================
// ELEMENTS
// ============================
const form = document.getElementById("customForm");
const progressBar = document.getElementById("progressBar");

const thankyou = document.getElementById("thankyou");
const restartBtn = document.getElementById("restartBtn");

const sections = Array.from(document.querySelectorAll(".section"));

// Error popup elements
const popupOverlay = document.getElementById("popupOverlay");
const popupCloseBtn = document.getElementById("popupCloseBtn");

// ============================
// STATE
// ============================
let current = 0;

// ============================
// HELPERS
// ============================

// Get only visible sections (important when we hide student/faculty)
function visibleSections() {
  return sections.filter((s) => s.style.display !== "none");
}

function showSection(index) {
  const vis = visibleSections();

  // safety clamp
  if (index < 0) index = 0;
  if (index >= vis.length) index = vis.length - 1;

  // hide all
  sections.forEach((s) => s.classList.remove("active"));

  // show current
  vis[index].classList.add("active");

  // update progress
  const progress = Math.round(((index + 1) / vis.length) * 100);
  progressBar.style.width = progress + "%";

  // scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  current = index;
}

function showPopup() {
  popupOverlay.classList.add("show");
}

function closePopup() {
  popupOverlay.classList.remove("show");
}

popupCloseBtn?.addEventListener("click", closePopup);

popupOverlay?.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// ============================
// VALIDATION
// ============================

function validateCurrentSection() {
  const vis = visibleSections();
  const active = vis[current];

  if (!active) return false;

  const requiredFields = active.querySelectorAll("[required]");

  for (const field of requiredFields) {
    // RADIO GROUP VALIDATION
    if (field.type === "radio") {
      const group = active.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);
      if (!checked) return false;
    }

    // TEXT / EMAIL / TEXTAREA VALIDATION
    if (
      field.type === "text" ||
      field.type === "email" ||
      field.tagName === "TEXTAREA"
    ) {
      if (!field.value.trim()) return false;
    }
  }

  // EXTRA RULE: Required checkboxes group must have at least 1 checked
  // (Google Forms usually treats checkbox question required like this)
  // We detect checkbox groups by checking if multiple inputs share same name.
  const requiredCheckboxes = active.querySelectorAll(
    'input[type="checkbox"][name][required]'
  );

  if (requiredCheckboxes.length > 0) {
    const checkboxNames = [...new Set(Array.from(requiredCheckboxes).map((c) => c.name))];

    for (const nm of checkboxNames) {
      const group = active.querySelectorAll(`input[type="checkbox"][name="${nm}"]`);
      const checked = Array.from(group).some((c) => c.checked);
      if (!checked) return false;
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

  let firstBadField = null;

  const requiredFields = active.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    // RADIO GROUP
    if (field.type === "radio") {
      const group = active.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);

      if (!checked) {
        const wrapper = field.closest(".field");
        if (wrapper) {
          wrapper.classList.add("error");
          if (!firstBadField) firstBadField = wrapper;
        }
      }
    }

    // TEXT / EMAIL / TEXTAREA
    if (
      field.type === "text" ||
      field.type === "email" ||
      field.tagName === "TEXTAREA"
    ) {
      if (!field.value.trim()) {
        const wrapper = field.closest(".field");
        if (wrapper) {
          wrapper.classList.add("error");
          if (!firstBadField) firstBadField = wrapper;
        }
      }
    }
  });

  // Scroll to first missing field
  if (firstBadField) {
    setTimeout(() => {
      firstBadField.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  }
}

// ============================
// ROUTING LOGIC (Occupation)
// ============================

function handleOccupationRouting() {
  const occupation = document.querySelector(
    'input[name="entry.455331503"]:checked'
  )?.value;

  const studentSection = document.getElementById("studentSection");
  const facultySection = document.getElementById("facultySection");

  // Reset first
  if (studentSection) studentSection.style.display = "";
  if (facultySection) facultySection.style.display = "";

  // Apply logic
  if (occupation === "Student") {
    if (facultySection) facultySection.style.display = "none";
  } else if (occupation === "Faculty / Educator") {
    if (studentSection) studentSection.style.display = "none";
  } else {
    // Working professionals skip both
    if (studentSection) studentSection.style.display = "none";
    if (facultySection) facultySection.style.display = "none";
  }
}

/**
 * IMPORTANT:
 * Hidden sections must NOT have required fields.
 * Otherwise browser will block submit.
 */
function syncRequiredForHiddenSections() {
  sections.forEach((section) => {
    const isHidden = section.style.display === "none";

    const requiredInputs = section.querySelectorAll("[required]");

    requiredInputs.forEach((el) => {
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
// NAVIGATION
// ============================

function goNext() {
  // validate
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
  if (current > 0) {
    showSection(current - 1);
  }
}

// ============================
// BUTTON HOOKS
// ============================

// Next buttons
document.getElementById("nextBtn1")?.addEventListener("click", () => {
  // routing decision is made after occupation is selected
  handleOccupationRouting();
  syncRequiredForHiddenSections();

  goNext();
});

document.getElementById("nextBtn2")?.addEventListener("click", goNext);
document.getElementById("nextBtn3")?.addEventListener("click", goNext);
document.getElementById("nextBtn4")?.addEventListener("click", goNext);

// Back buttons
document.getElementById("backBtn2")?.addEventListener("click", goBack);
document.getElementById("backBtn3")?.addEventListener("click", goBack);
document.getElementById("backBtn4")?.addEventListener("click", goBack);
document.getElementById("backBtn5")?.addEventListener("click", goBack);

// ============================
// FORM SUBMIT
// ============================

form?.addEventListener("submit", function (e) {
  // validate last visible section
  if (!validateCurrentSection()) {
    e.preventDefault();
    showPopup();
    highlightMissingRequired();
    return;
  }

  // Allow form to submit into hidden iframe
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

restartBtn?.addEventListener("click", () => {
  // reset form
  form.reset();

  // show form again
  form.style.display = "block";
  thankyou.style.display = "none";

  // reset section visibility
  const studentSection = document.getElementById("studentSection");
  const facultySection = document.getElementById("facultySection");

  if (studentSection) studentSection.style.display = "";
  if (facultySection) facultySection.style.display = "";

  // reset required sync
  syncRequiredForHiddenSections();

  // go to first
  showSection(0);
});

// ============================
// INIT
// ============================

showSection(0);
progressBar.style.width = "10%";
