(function () {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const status = document.querySelector('[data-search-status]');
    const results = document.querySelector('[data-search-results]');
    const formInput = document.querySelector('.search-page-form input[name="q"]');

    if (formInput) {
        formInput.value = query;
    }

    const escapeHtml = function (value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const card = function (item) {
        const tags = item.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');

        return '<article class="movie-card">' +
            '<a class="poster-link" href="' + escapeHtml(item.url) + '" aria-label="' + escapeHtml(item.title) + '">' +
                '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                '<span class="poster-glow"></span>' +
                '<span class="poster-play">▶</span>' +
            '</a>' +
            '<div class="movie-card-body">' +
                '<div class="movie-meta-line"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>' +
                '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
                '<p>' + escapeHtml(item.text) + '</p>' +
                '<div class="tag-row">' + tags + '</div>' +
            '</div>' +
        '</article>';
    };

    if (!status || !results) {
        return;
    }

    if (!query) {
        status.textContent = '请输入关键词开始搜索';
        return;
    }

    const keys = query.toLowerCase().split(/\s+/).filter(Boolean);
    const source = window.MOVIE_SEARCH_INDEX || [];
    const matches = source.filter(function (item) {
        const text = [
            item.title,
            item.year,
            item.region,
            item.type,
            item.genre,
            item.tags.join(' '),
            item.text
        ].join(' ').toLowerCase();
        return keys.every(function (key) {
            return text.indexOf(key) !== -1;
        });
    });

    status.textContent = matches.length ? '为你找到相关影片' : '没有找到相关影片';
    results.innerHTML = matches.slice(0, 240).map(card).join('');
})();
