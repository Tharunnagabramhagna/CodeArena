# update_hub_and_bookmarks.py

def update_practice_hub():
    with open('frontend/js/practice_hub.js', 'r', encoding='utf-8') as f:
        content = f.read()

    safe_desc_func = '''    /**
     * Safely renders problem descriptions for practice cards.
     * Prevents raw HTML tag leakage, strips dangerous scripts/constructs,
     * preserves safe semantic tags (p, code, strong, em, span, br),
     * and provides a clean, concise card preview.
     */
    function renderSafeDescription(rawDesc) {
        if (!rawDesc) return '<p>No description provided for this challenge.</p>';

        let clean = '';
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.sanitizeHtml === 'function') {
            clean = window.CodeArenaAPI.problemService.sanitizeHtml(rawDesc);
        } else {
            clean = String(rawDesc)
                .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')
                .replace(/<iframe\\b[^<]*(?:(?!<\\/iframe>)<[^<]*)*<\\/iframe>/gi, '')
                .replace(/\\son\\w+="[^"]*"/gi, '')
                .replace(/\\son\\w+='[^']*'/gi, '');
        }

        clean = clean.replace(/<\\/?([a-z0-9]+)\\b([^>]*)>/gi, function (match, tag) {
            const allowed = ['p', 'code', 'strong', 'em', 'span', 'br', 'b', 'i'];
            const lower = tag.toLowerCase();
            if (!allowed.includes(lower)) return '';
            if (match.startsWith('</')) return '</' + lower + '>';
            if (lower === 'br') return '<br>';
            return '<' + lower + '>';
        });

        const pMatch = clean.match(/<p>([\\s\\S]*?)<\\/p>/i);
        if (pMatch && pMatch[0]) {
            return pMatch[0];
        }
        return '<p>' + clean + '</p>';
    }
'''

    # Replace in renderRecommendedSection
    old_rec = '<p class="prob-card-desc">${escapeHtml(p.description || \'\')}</p>'
    new_rec = '<div class="prob-card-desc">${renderSafeDescription(p.description || \'\')}</div>'
    
    assert old_rec in content, "old_rec not found in practice_hub.js"
    content = content.replace(old_rec, new_rec)

    # Insert function before escapeHtml
    assert 'function escapeHtml(str) {' in content
    content = content.replace('function escapeHtml(str) {', safe_desc_func + '\n    function escapeHtml(str) {')

    with open('frontend/js/practice_hub.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("practice_hub.js updated successfully")

def update_bookmarks():
    with open('frontend/js/bookmarks.js', 'r', encoding='utf-8') as f:
        content = f.read()

    safe_desc_func = '''    /**
     * Safely renders problem descriptions for bookmark cards.
     */
    function renderSafeDescription(rawDesc) {
        if (!rawDesc) return '<p>No description provided for this challenge.</p>';

        let clean = '';
        if (window.CodeArenaAPI && window.CodeArenaAPI.problemService && typeof window.CodeArenaAPI.problemService.sanitizeHtml === 'function') {
            clean = window.CodeArenaAPI.problemService.sanitizeHtml(rawDesc);
        } else {
            clean = String(rawDesc)
                .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '')
                .replace(/<iframe\\b[^<]*(?:(?!<\\/iframe>)<[^<]*)*<\\/iframe>/gi, '')
                .replace(/\\son\\w+="[^"]*"/gi, '')
                .replace(/\\son\\w+='[^']*'/gi, '');
        }

        clean = clean.replace(/<\\/?([a-z0-9]+)\\b([^>]*)>/gi, function (match, tag) {
            const allowed = ['p', 'code', 'strong', 'em', 'span', 'br', 'b', 'i'];
            const lower = tag.toLowerCase();
            if (!allowed.includes(lower)) return '';
            if (match.startsWith('</')) return '</' + lower + '>';
            if (lower === 'br') return '<br>';
            return '<' + lower + '>';
        });

        const pMatch = clean.match(/<p>([\\s\\S]*?)<\\/p>/i);
        if (pMatch && pMatch[0]) {
            return pMatch[0];
        }
        return '<p>' + clean + '</p>';
    }
'''

    old_card_desc = '<p class="prob-card-desc">${escapeHtml(p.description || \'\')}</p>'
    new_card_desc = '<div class="prob-card-desc">${renderSafeDescription(p.description || \'\')}</div>'
    
    assert old_card_desc in content, "old_card_desc not found in bookmarks.js"
    content = content.replace(old_card_desc, new_card_desc)

    assert 'function escapeHtml(str) {' in content
    content = content.replace('function escapeHtml(str) {', safe_desc_func + '\n    function escapeHtml(str) {')

    with open('frontend/js/bookmarks.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("bookmarks.js updated successfully")

update_practice_hub()
update_bookmarks()

