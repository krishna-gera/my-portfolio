// Current section tracking
let currentSection = 1;
let totalSections = 10;
let visibleSections = [];

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupConditionalLogic();
    setupOtherOptions();
    updateProgress();
});

function initializeForm() {
    // Calculate visible sections based on occupation
    calculateVisibleSections();
    
    // Show first section
    showSection(1);
}

function calculateVisibleSections() {
    // Always visible sections
    visibleSections = [1, 6, 7, 8, 9, 10];
    
    // Check which occupation-specific section to add
    const occupation = document.querySelector('input[name="entry.455331503"]:checked');
    if (occupation) {
        const trigger = occupation.dataset.triggers;
        if (trigger === 'student-section') {
            visibleSections.splice(1, 0, 2);
        } else if (trigger === 'faculty-section') {
            visibleSections.splice(1, 0, 3);
        } else if (trigger === 'tech-section') {
            visibleSections.splice(1, 0, 4);
        } else if (trigger === 'nontech-section') {
            visibleSections.splice(1, 0, 5);
        }
    }
    
    totalSections = visibleSections.length;
}

function setupConditionalLogic() {
    // Listen for occupation changes
    const occupationInputs = document.querySelectorAll('input[name="entry.455331503"]');
    occupationInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Hide all conditional sections
            document.querySelectorAll('.conditional-section').forEach(section => {
                section.classList.remove('active');
                // Remove required from hidden sections
                section.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
                    el.removeAttribute('required');
                    el.dataset.wasRequired = 'true';
                });
            });
            
            // Show relevant section
            const trigger = this.dataset.triggers;
            if (trigger) {
                const targetSection = document.getElementById(trigger);
                if (targetSection) {
                    // Add back required attributes
                    targetSection.querySelectorAll('[data-was-required]').forEach(el => {
                        el.setAttribute('required', 'required');
                    });
                }
            }
            
            // Recalculate visible sections
            calculateVisibleSections();
            updateProgress();
        });
    });
}

function setupOtherOptions() {
    // Handle "Other" option for radio buttons
    document.querySelectorAll('input[type="radio"][data-other="true"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.form-group').querySelector('.other-input');
            if (otherInput) {
                otherInput.style.display = 'block';
                otherInput.focus();
            }
        });
    });
    
    // Handle "Other" option for checkboxes
    document.querySelectorAll('input[type="checkbox"][data-other="true"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const otherInput = this.closest('.form-group').querySelector('.other-input');
            if (otherInput) {
                if (this.checked) {
                    otherInput.style.display = 'block';
                    otherInput.focus();
                } else {
                    otherInput.style.display = 'none';
                    otherInput.value = '';
                }
            }
        });
    });
    
    // Hide other inputs when different option selected
    document.querySelectorAll('input[type="radio"]:not([data-other="true"])').forEach(radio => {
        radio.addEventListener('change', function() {
            const formGroup = this.closest('.form-group');
            const otherInput = formGroup.querySelector('.other-input');
            if (otherInput) {
                otherInput.style.display = 'none';
                otherInput.value = '';
            }
        });
    });
}

function showSection(sectionNumber) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show current section
    const currentSectionElement = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
    if (currentSectionElement && !currentSectionElement.classList.contains('conditional-section')) {
        currentSectionElement.classList.add('active');
    } else {
        // If it's a conditional section, find the active one
        const occupation = document.querySelector('input[name="entry.455331503"]:checked');
        if (occupation) {
            const trigger = occupation.dataset.triggers;
            if (trigger) {
                const targetSection = document.getElementById(trigger);
                if (targetSection && targetSection.dataset.section == sectionNumber) {
                    targetSection.classList.add('active');
                }
            }
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    updateProgress();
}

function validateCurrentSection() {
    const currentSectionElement = document.querySelector('.form-section.active');
    if (!currentSectionElement) return false;
    
    // Get all required inputs in current section
    const requiredInputs = currentSectionElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            const name = input.name;
            const checked = currentSectionElement.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                isValid = false;
                // Add visual feedback
                const formGroup = input.closest('.form-group');
                if (formGroup && !formGroup.querySelector('.error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = 'var(--danger-color)';
                    errorMsg.style.fontSize = '14px';
                    errorMsg.style.marginTop = '8px';
                    errorMsg.textContent = 'This field is required';
                    formGroup.appendChild(errorMsg);
                    
                    // Remove error when user interacts
                    input.addEventListener('change', function() {
                        const error = formGroup.querySelector('.error-message');
                        if (error) error.remove();
                    }, { once: true });
                }
            }
        } else if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--danger-color)';
            
            // Remove red border when user types
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    return isValid;
}

function nextSection() {
    // Validate current section
    if (!validateCurrentSection()) {
        alert('Please fill in all required fields before continuing.');
        return;
    }
    
    // Find current section index in visible sections
    const currentIndex = visibleSections.indexOf(currentSection);
    
    // Move to next visible section
    if (currentIndex < visibleSections.length - 1) {
        currentSection = visibleSections[currentIndex + 1];
        showSection(currentSection);
    }
}

function prevSection() {
    // Find current section index in visible sections
    const currentIndex = visibleSections.indexOf(currentSection);
    
    // Move to previous visible section
    if (currentIndex > 0) {
        currentSection = visibleSections[currentIndex - 1];
        showSection(currentSection);
    }
}

function updateProgress() {
    const currentIndex = visibleSections.indexOf(currentSection);
    const progress = ((currentIndex + 1) / visibleSections.length) * 100;
    
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '% Complete';
}

// Form submission handling
document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate final section
    if (!validateCurrentSection()) {
        alert('Please fill in all required fields before submitting.');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Submit form
    const formData = new FormData(this);
    
    // Use fetch to submit
    fetch(this.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(() => {
        // Hide form and show success message
        document.getElementById('surveyForm').style.display = 'none';
        document.querySelector('.progress-container').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Optional: Redirect after 3 seconds
        // setTimeout(() => {
        //     window.location.href = 'thank-you.html';
        // }, 3000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error submitting the form. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
