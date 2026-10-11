// ==========================================
// MOBILE NAVIGATION
// ==========================================

const menu = document.getElementById("menu");
const links = document.getElementById("links");

if (menu && links) {
    menu.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");

        menu.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            links.classList.remove("open");
            menu.setAttribute("aria-expanded", "false");
        });
    });
}


// ==========================================
// SCROLL PROGRESS BAR
// ==========================================

const progress = document.getElementById("progress");

function updateProgress() {
    if (!progress) return;

    const max =
        document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
        max > 0 ? (window.scrollY / max) * 100 : 0;

    progress.style.width = `${percentage}%`;
}

window.addEventListener("scroll", updateProgress, {
    passive: true
});

updateProgress();


// ==========================================
// REVEAL ANIMATIONS
// ==========================================

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
        observer.observe(element);
    });
} else {
    // Fallback for browsers without IntersectionObserver.
    document.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("visible");
    });
}


// ==========================================
// AUTOMATIC COPYRIGHT YEAR
// ==========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ==========================================
// WEB3FORMS CONTACT FORM
// ==========================================

const form = document.getElementById("contactForm");

if (form) {
    const submitButton = form.querySelector(".submit");
    const buttonText = submitButton?.querySelector("span");
    const formStatus = document.getElementById("formStatus");

    const originalButtonText = buttonText
        ? buttonText.textContent
        : "Send message";

    form.addEventListener("submit", async (event) => {
        // Prevent the browser's normal form submission.
        event.preventDefault();

        // Prevent duplicate submissions.
        if (submitButton && submitButton.disabled) {
            return;
        }

        // Check built-in HTML form validation.
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Update the interface while sending.
        if (submitButton) {
            submitButton.disabled = true;
        }

        if (buttonText) {
            buttonText.textContent = "Sending...";
        }

        if (formStatus) {
            formStatus.textContent = "Sending your message...";
        }

        try {
            // Submit the form directly to Web3Forms.
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: new FormData(form),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            // Read the server response.
            const result = await response.json();

            // Check whether Web3Forms accepted the submission.
            if (response.ok && result.success) {
                if (formStatus) {
                    formStatus.textContent =
                        "Thank you! Your message was submitted successfully.";
                }

                form.reset();
            } else {
                if (formStatus) {
                    formStatus.textContent =
                        result.message ||
                        "Unable to send your message. Please try again.";
                }

                console.error(
                    "Web3Forms submission failed:",
                    result
                );
            }
        } catch (error) {
            // Handle network or connection errors.
            if (formStatus) {
                formStatus.textContent =
                    "A connection error occurred. Please check your internet connection and try again.";
            }

            console.error(
                "Contact form network error:",
                error
            );
        } finally {
            // Restore the submit button.
            if (submitButton) {
                submitButton.disabled = false;
            }

            if (buttonText) {
                buttonText.textContent = originalButtonText;
            }
        }
    });
}