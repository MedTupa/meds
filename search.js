(function () {
    const input = document.querySelector('.med-search input');
    if (!input) return;

    const indications = document.querySelectorAll('.indication');
    const empty = document.querySelector('.med-empty');

    function normalize(s) {
        return s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
    }

    const programs = document.querySelectorAll('.program');

    function filter() {
        const q = normalize(input.value.trim());
        let anyVisible = false;

        indications.forEach(card => {
            const items = card.querySelectorAll('li');
            let visibleCount = 0;
            items.forEach(li => {
                const haystack = normalize(li.textContent + ' ' + (li.dataset.aliases || ''));
                const match = q === '' || haystack.includes(q);
                li.hidden = !match;
                if (match) visibleCount++;
            });
            card.hidden = visibleCount === 0;
            if (visibleCount > 0) anyVisible = true;
        });

        programs.forEach(p => {
            const visibleIndications = p.querySelectorAll('.indication:not([hidden])');
            p.hidden = visibleIndications.length === 0;
        });

        if (empty) {
            const show = !anyVisible && q !== '';
            empty.classList.toggle('show', show);
            if (show) {
                const raw = input.value.trim();
                const termEl = empty.querySelector('#empty-term');
                if (termEl) termEl.textContent = raw;
                const link = empty.querySelector('#medpreco-link');
                if (link) link.href = 'https://medpreco.com/?q=' + encodeURIComponent(raw);
            }
        }
    }

    const params = new URLSearchParams(window.location.search);
    const initial = params.get('q');
    if (initial) {
        input.value = initial;
        filter();
    }

    input.addEventListener('input', filter);
})();
