# update_learn_phase6.py

# 1. Update secondary.css
toc_css = """

/* ==========================================================================
   Phase 6: Lesson Table of Contents & Interactive Quiz Enhancements
   ========================================================================== */

.lesson-toc-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 14px;
  background-color: var(--color-bg-surface, #0f172a);
  border: 1px solid var(--color-border, #334155);
  border-radius: var(--radius-md, 8px);
  margin-bottom: 24px;
  font-size: 0.8rem;
}

.toc-title {
  color: var(--color-text-muted, #94a3b8);
  font-weight: 600;
  margin-right: 4px;
}

.toc-link {
  color: var(--color-primary, #6366f1);
  text-decoration: none;
  padding: 3px 8px;
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: 4px;
  transition: all 0.15s ease;
  font-size: 0.78rem;
}

.toc-link:hover {
  background-color: rgba(99, 102, 241, 0.2);
  text-decoration: underline;
}

.btn-retry-quiz {
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  color: inherit;
  font-size: 0.75rem;
  padding: 4px 10px;
  cursor: pointer;
  margin-top: 8px;
  display: inline-block;
  font-weight: 500;
}

.btn-retry-quiz:hover {
  background-color: rgba(239, 68, 68, 0.15);
}
"""

with open('frontend/css/secondary.css', 'r', encoding='utf-8') as f:
    sec_css = f.read()

if 'Phase 6: Lesson Table of Contents' not in sec_css:
    with open('frontend/css/secondary.css', 'a', encoding='utf-8') as f:
        f.write(toc_css)
    print("Appended TOC CSS to secondary.css")

# 2. Update learn.html to add toast.js
with open('frontend/pages/learn.html', 'r', encoding='utf-8') as f:
    learn_html = f.read()

if '<script src="../js/toast.js"></script>' not in learn_html:
    learn_html = learn_html.replace('<script src="../js/learn.js"></script>', '<script src="../js/toast.js"></script>\n    <script src="../js/learn.js"></script>')
    with open('frontend/pages/learn.html', 'w', encoding='utf-8') as f:
        f.write(learn_html)
    print("Added toast.js to learn.html")

# 3. Update learn.js
with open('frontend/js/learn.js', 'r', encoding='utf-8') as f:
    learn_js = f.read()

# Inspect how renderCurrentLesson is defined
idx_start = learn_js.find('function renderCurrentLesson() {')
idx_end = learn_js.find('function escapeHtml(', idx_start)

if idx_start != -1 and idx_end != -1:
    old_render = learn_js[idx_start:idx_end]
    
    new_render = """function renderCurrentLesson() {
        const lesson = LESSONS[state.currentIndex];
        if (!lesson || !dom.lessonCard) return;

        const completedList = getCompletedLessons();
        const isCompleted = completedList.includes(lesson.id);

        if (dom.progressText) {
            dom.progressText.textContent = `Module ${state.currentIndex + 1} of ${LESSONS.length} • ${completedList.length} Completed`;
        }

        if (dom.prevBtn) dom.prevBtn.disabled = state.currentIndex === 0;
        if (dom.nextBtn) dom.nextBtn.disabled = state.currentIndex === LESSONS.length - 1;

        dom.lessonCard.innerHTML = `
            <div class="lesson-meta-bar">
                <span class="preview-badge-pill">${escapeHtml(lesson.category)}</span>
                <span class="diff-badge ${lesson.level === 'Beginner' ? 'diff-easy' : (lesson.level === 'Intermediate' ? 'diff-medium' : 'diff-hard')}">${escapeHtml(lesson.level)}</span>
                <span style="font-size: 0.78rem; color: var(--color-text-muted);">⏱ ${escapeHtml(lesson.readTime)} read</span>
                ${isCompleted ? '<span style="font-size: 0.76rem; color: #22c55e; font-weight: 600; margin-left: auto;">✓ Completed</span>' : ''}
            </div>

            <h1 class="lesson-title">${escapeHtml(lesson.title)}</h1>
            <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 20px; line-height: 1.5;">${escapeHtml(lesson.summary)}</p>

            <!-- Table of Contents Navigation (Phase 6) -->
            <nav class="lesson-toc-nav" aria-label="Lesson sections">
                <span class="toc-title">Jump to:</span>
                <a href="#lessonOverview" class="toc-link">1. Concepts</a>
                <a href="#lessonCodeBlock" class="toc-link">2. Code Example</a>
                <a href="#lessonQuizBlock" class="toc-link">3. Knowledge Check</a>
            </nav>

            <div class="lesson-content-body" id="lessonOverview">
                ${lesson.content}
            </div>

            <div class="msg-code-block" id="lessonCodeBlock" style="margin-top: 24px;">
                <div class="code-block-header">
                    <span>Java 17 Code Demonstration</span>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="code-copy-btn" id="btnCopyLessonCode">Copy Code</button>
                        <a href="compiler.html" class="code-copy-btn" style="text-decoration: none;">Try in Compiler &rarr;</a>
                    </div>
                </div>
                <pre><code id="lessonCodeSnippet">${escapeHtml(lesson.code)}</code></pre>
            </div>

            <!-- Interactive Knowledge Check Quiz (Phase 6 Enhanced) -->
            <div class="quiz-card" id="lessonQuizBlock">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); letter-spacing: 0.04em;">Knowledge Check</span>
                    <span style="font-size: 0.72rem; color: var(--color-text-muted);">Self-Assessment</span>
                </div>
                <h3 class="quiz-question-title">${escapeHtml(lesson.quiz.question)}</h3>
                <div class="quiz-options-list" id="quizOptionsList">
                    ${lesson.quiz.options.map((opt, optIdx) => `
                        <label class="quiz-option-label" data-idx="${optIdx}">
                            <input type="radio" name="quizOpt" value="${optIdx}">
                            <span>${escapeHtml(opt)}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="quiz-feedback-box" id="quizFeedbackBox"></div>
            </div>

            <!-- Lesson Completion Toggle Bar (Phase 6) -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: rgba(99, 102, 241, 0.06); border: 1px solid var(--color-border); border-radius: 8px; margin-top: 28px;">
                <div>
                    <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-text-primary);">Lesson Progress</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Preview status stored locally in browser storage</div>
                </div>
                <button type="button" class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline'}" id="btnToggleLessonComplete">
                    ${isCompleted ? '✓ Completed' : 'Mark as Complete'}
                </button>
            </div>
        `;

        // Bind copy button
        const copyBtn = document.getElementById('btnCopyLessonCode');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(lesson.code).then(() => {
                    this.textContent = 'Copied!';
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.success('Java snippet copied to clipboard');
                    }
                    setTimeout(() => { this.textContent = 'Copy Code'; }, 1800);
                }).catch(() => {
                    if (window.CodeArenaToast) {
                        window.CodeArenaToast.error('Failed to copy to clipboard');
                    }
                });
            });
        }

        // Bind quiz option radios with interactive feedback & retry
        const optLabels = dom.lessonCard.querySelectorAll('.quiz-option-label');
        const feedbackBox = document.getElementById('quizFeedbackBox');

        function bindQuizOptions() {
            optLabels.forEach(label => {
                label.addEventListener('click', function () {
                    const chosenIdx = parseInt(this.getAttribute('data-idx'), 10);
                    const isCorrect = chosenIdx === lesson.quiz.answer;

                    optLabels.forEach(l => l.style.borderColor = 'var(--color-border)');
                    this.style.borderColor = isCorrect ? '#22C55E' : '#EF4444';

                    if (feedbackBox) {
                        feedbackBox.className = 'quiz-feedback-box ' + (isCorrect ? 'correct' : 'incorrect');
                        feedbackBox.innerHTML = `
                            <strong>${isCorrect ? '✓ Correct Answer!' : '✗ Not quite right.'}</strong>
                            <div style="margin-top: 6px; line-height: 1.5;">${escapeHtml(lesson.quiz.explanation)}</div>
                            ${!isCorrect ? '<button type="button" class="btn-retry-quiz" id="btnRetryQuiz">Try Again</button>' : ''}
                        `;

                        const retryBtn = document.getElementById('btnRetryQuiz');
                        if (retryBtn) {
                            retryBtn.addEventListener('click', function (e) {
                                e.stopPropagation();
                                optLabels.forEach(l => {
                                    l.style.borderColor = 'var(--color-border)';
                                    const radio = l.querySelector('input[type="radio"]');
                                    if (radio) radio.checked = false;
                                });
                                feedbackBox.style.display = 'none';
                                feedbackBox.className = 'quiz-feedback-box';
                            });
                        }
                    }
                });
            });
        }
        bindQuizOptions();

        // Bind Lesson Completion Toggle
        const toggleBtn = document.getElementById('btnToggleLessonComplete');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                const nowCompleted = toggleLessonCompletion(lesson.id);
                renderTopicsSidebar();
                renderCurrentLesson();
                if (window.CodeArenaToast) {
                    window.CodeArenaToast.info(nowCompleted ? 'Lesson marked as complete' : 'Lesson marked as incomplete');
                }
            });
        }
    }

    function getCompletedLessons() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem(PROGRESS_KEY);
                if (raw) return JSON.parse(raw);
            }
        } catch (e) {}
        return [];
    }

    function toggleLessonCompletion(lessonId) {
        let list = getCompletedLessons();
        const idx = list.indexOf(lessonId);
        let completed = false;
        if (idx !== -1) {
            list.splice(idx, 1);
        } else {
            list.push(lessonId);
            completed = true;
        }
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
            }
        } catch (e) {}
        return completed;
    }

    """

    learn_js = learn_js[:idx_start] + new_render + learn_js[idx_end:]
    with open('frontend/js/learn.js', 'w', encoding='utf-8') as f:
        f.write(learn_js)
    print("Updated renderCurrentLesson in learn.js successfully")
else:
    print("Error: Could not find function boundaries in learn.js")

