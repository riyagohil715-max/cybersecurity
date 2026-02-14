document.addEventListener('DOMContentLoaded', () => {
    const startQuizBtn = document.getElementById('start-quiz');
    const quizContainer = document.getElementById('quiz-container');

    const quizQuestions = [
        {
            question: "What is the most common way phishing attacks are delivered?",
            options: ["Phone calls", "Email", "Text messages", "Social media messages"],
            answer: 1
        },
        {
            question: "Which of these makes a password strong?",
            options: ["Your pet's name", "A sequence like 123456", "A long passphrase with mixed characters", "Your birth date"],
            answer: 2
        },
        {
            question: "What does 2FA stand for?",
            options: ["Two-Factor Authentication", "To-Finish Authorization", "Total-File Access", "Two-Fold Application"],
            answer: 0
        },
        {
            question: "Which of these is a sign of a secure website?",
            options: ["A green background", "The use of 'http://'", "The use of 'https://' and a padlock icon", "The website has many images"],
            answer: 2
        },
        {
            question: "What is 'Social Engineering' in cybersecurity?",
            options: ["Building a social media platform", "Manipulating people into giving up confidential information", "Fixing a computer's hardware", "Coding a new social app"],
            answer: 1
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
        showQuestion(quizQuestions[currentQuestionIndex]);
    }

    function showQuestion(questionData) {
        quizContainer.innerHTML = `
            <div class="question-box" style="text-align: left; max-width: 600px; margin: 0 auto;">
                <h3 style="margin-bottom: var(--spacing-sm);">${questionData.question}</h3>
                <div class="options-list" style="display: flex; flex-direction: column; gap: 10px;">
                    ${questionData.options.map((option, index) => `
                        <button class="btn option-btn" style="text-align: left; border: 1px solid var(--border-glass); background: var(--bg-surface);" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.target.getAttribute('data-index'));
                checkAnswer(selectedIndex, questionData.answer);
            });
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            score++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion(quizQuestions[currentQuestionIndex]);
        } else {
            showResult();
        }
    }

    function showResult() {
        quizContainer.innerHTML = `
            <div class="result-box">
                <h3 style="margin-bottom: var(--spacing-sm);">Quiz Completed!</h3>
                <p style="font-size: 1.5rem; margin-bottom: var(--spacing-md);">Your Score: ${score} / ${quizQuestions.length}</p>
                <button id="restart-quiz" class="btn btn-primary">Try Again</button>
            </div>
        `;

        document.getElementById('restart-quiz').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            startQuiz();
        });
    }

    startQuizBtn.addEventListener('click', startQuiz);

    // Password Strength Checker logic
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const feedbackList = document.getElementById('feedback-list');

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const result = checkPasswordStrength(password);
            updateStrengthUI(result);
        });
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) {
            strength += 25;
        } else if (password.length > 0) {
            feedback.push("At least 8 characters");
        }

        if (/[A-Z]/.test(password)) {
            strength += 25;
        } else if (password.length > 0) {
            feedback.push("Include uppercase letters");
        }

        if (/[0-9]/.test(password)) {
            strength += 25;
        } else if (password.length > 0) {
            feedback.push("Include numbers");
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 25;
        } else if (password.length > 0) {
            feedback.push("Include symbols");
        }

        return { strength, feedback };
    }

    function updateStrengthUI({ strength, feedback }) {
        strengthBar.style.width = `${strength}%`;

        if (strength <= 25) {
            strengthBar.style.backgroundColor = 'var(--danger)';
            strengthText.innerText = 'Weak';
        } else if (strength <= 50) {
            strengthBar.style.backgroundColor = 'var(--warning)';
            strengthText.innerText = 'Fair';
        } else if (strength <= 75) {
            strengthBar.style.backgroundColor = 'var(--primary)';
            strengthText.innerText = 'Good';
        } else {
            strengthBar.style.backgroundColor = 'var(--success)';
            strengthText.innerText = 'Strong';
        }

        feedbackList.innerHTML = feedback.map(f => `<li>${f}</li>`).join('');
    }

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // AJAX Form Handling
    const handleFormSubmit = (formId, endpoint, responseId) => {
        const form = document.getElementById(formId);
        const responseDiv = document.getElementById(responseId);

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                responseDiv.innerText = 'Processing...';
                responseDiv.style.color = 'var(--text-dim)';

                const formData = new FormData(form);
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: formData
                    });

                    const text = await response.text();
                    try {
                        const result = JSON.parse(text);
                        responseDiv.innerText = result.message;
                        responseDiv.style.color = result.status === 'success' ? 'var(--success)' : 'var(--danger)';
                        if (result.status === 'success') form.reset();
                    } catch (e) {
                        // If it's not JSON, show the actual response text (helps debug PHP errors)
                        responseDiv.innerText = 'Server Error: ' + text;
                        responseDiv.style.color = 'var(--danger)';
                    }
                } catch (error) {
                    responseDiv.innerText = 'Connection error. Is your server running?';
                    responseDiv.style.color = 'var(--danger)';
                }
            });
        }
    };

    handleFormSubmit('newsletter-form', 'subscribe.php', 'newsletter-response');
    handleFormSubmit('contact-form', 'contact.php', 'contact-response');

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // AI Advisor Logic
    const aiInput = document.getElementById('ai-input');
    const aiBtn = document.getElementById('ai-btn');
    const aiResponse = document.getElementById('ai-response');

    const aiKnowledge = {
        "phishing": "Phishing is a method where attackers use deceptive emails or sites to steal your data. Always check the sender's email address and hover over links.",
        "password": "A strong password should be at least 12 characters long, including uppercase, lowercase, numbers, and symbols. Using a password manager is highly recommended.",
        "2fa": "Two-Factor Authentication adds a second layer of security. Even if someone knows your password, they can't access your account without the second factor.",
        "vpn": "A VPN encrypts your internet traffic, protecting your data from hackers on public Wi-Fi networks.",
        "malware": "Malware is malicious software designed to harm or exploit your device. Keep your antivirus updated and avoid suspicious downloads."
    };

    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            const query = aiInput.value.toLowerCase();
            let response = "I'm still learning about that! Try asking about Phishing, Passwords, 2FA, VPN, or Malware.";

            for (let key in aiKnowledge) {
                if (query.includes(key)) {
                    response = aiKnowledge[key];
                    break;
                }
            }

            aiResponse.style.opacity = 0;
            setTimeout(() => {
                aiResponse.innerText = response;
                aiResponse.style.opacity = 1;
            }, 300);
        });
    }
});
