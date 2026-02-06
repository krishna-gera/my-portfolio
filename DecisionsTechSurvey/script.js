const sections = Array.from(document.querySelectorAll(".section"));
const progressBar = document.getElementById("progressBar");
const form = document.getElementById("customForm");

const thankyou = document.getElementById("thankyou");
const restartBtn = document.getElementById("restartBtn");

// Buttons
const nextBtn1 = document.getElementById("nextBtn1");
const nextBtn2 = document.getElementById("nextBtn2");
const nextBtn3 = document.getElementById("nextBtn3");
const nextBtn4 = document.getElementById("nextBtn4");

const backBtn2 = document.getElementById("backBtn2");
const backBtn3 = document.getElementById("backBtn3");
const backBtn4 = document.getElementById("backBtn4");
const backBtn5 = document.getElementById("backBtn5");

let current = 0;

function showSection(index) {
  sections.forEach((s) => s.classList.remove("active"));
  sections[index].classList.add("active");

  const progress = Math.round(((index + 1) / sections.length) * 100);
  progressBar.style.width = progress + "%";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validateSection(index) {
  const activeSection = sections[index];
  const requiredFields = activeSection.querySelectorAll("[required]");

  for (const field of requiredFields) {
    // For radio groups
    if (field.type === "radio") {
      const group = activeSection.querySelectorAll(`input[name="${field.name}"]`);
      const checked = Array.from(group).some((r) => r.checked);
      if (!checked) return false;
    }

    // For text/email/textarea
    if ((field.type === "text" || field.type === "email" || field.tagName === "TEXTAREA") && !field.value.trim()) {
      return false;
    }
  }

  return true;
}

/**
 * This is the logic part:
 * Occupation decides which section to show:
 * - Student -> Student section
 * - Faculty -> Faculty section
 * - Working professional -> skip both
 */
function handleOccupationRouting() {
  const occupation = document.querySelector('input[name="entry.455331503"]:checked')?.value;

  // By default we include all sections in the UI flow:
  // [Basic] [Student] [Faculty] [AI Tools] [Final]
  // But we hide irrelevant section dynamically.

  const studentSection = document.getElementById("studentSection");
  const facultySection = document.getElementById("facultySection");

  // Show both initially
  studentSection.style.display = "";
  facultySection.style.display = "";

  if (occupation === "Student") {
    // show student, hide faculty
    facultySection.style.display = "none";
  } else if (occupation === "Faculty / Educator") {
    // show faculty, hide student
    studentSection.style.display = "none";
  } else {
    // working professional -> hide both
    studentSection.style.display = "none";
    facultySection.style.display = "none";
  }
}

/**
 * IMPORTANT:
 * Google Forms still expects all fields.
 * But if a section is hidden, user won't fill those required fields.
 *
 * So we must remove required from hidden sections.
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

function goNext() {
  if (!validateSection(current)) {
    alert("Please fill all required fields in this section.");
    return;
  }

  current++;
  while (current < sections.length && sections[current].style.display === "none") {
    current++;
  }

  if (current >= sections.length) current = sections.length - 1;
  showSection(current);
}

function goBack() {
  current--;
  while (current >= 0 && sections[current].style.display === "none") {
    current--;
  }

  if (current < 0) current = 0;
  showSection(current);
}

// Navigation listeners
nextBtn1.addEventListener("click", () => {
  handleOccupationRouting();
  syncRequiredForHiddenSections();
  goNext();
});

nextBtn2.addEventListener("click", () => goNext());
nextBtn3.addEventListener("click", () => goNext());
nextBtn4.addEventListener("click", () => goNext());

backBtn2.addEventListener("click", () => goBack());
backBtn3.addEventListener("click", () => goBack());
backBtn4.addEventListener("click", () => goBack());
backBtn5.addEventListener("click", () => goBack());

// Submit handling
form.addEventListener("submit", function (e) {
  // validate last section
  if (!validateSection(current)) {
    e.preventDefault();
    alert("Please fill all required fields.");
    return;
  }

  // Allow the form to submit into hidden iframe
  setTimeout(() => {
    form.style.display = "none";
    thankyou.style.display = "block";
    progressBar.style.width = "100%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 700);
});

restartBtn.addEventListener("click", () => {
  // reset
  form.reset();
  form.style.display = "block";
  thankyou.style.display = "none";

  // reset section visibility
  document.getElementById("studentSection").style.display = "";
  document.getElementById("facultySection").style.display = "";

  current = 0;
  showSection(current);
});

// Init
showSection(0);
progressBar.style.width = "20%";
