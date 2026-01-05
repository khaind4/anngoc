/**
 * Local Search Script for Thang Máy An Ngọc
 * Tìm kiếm nội bộ trong các file HTML local
 */

(function () {
    'use strict';

    // Dữ liệu tìm kiếm
    let searchData = [];
    let isDataLoaded = false;

    // Xác định đường dẫn base dựa vào vị trí file hiện tại
    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '../';
        }
        return './';
    }

    // Load dữ liệu tìm kiếm từ JSON
    async function loadSearchData() {
        if (isDataLoaded) return searchData;

        const basePath = getBasePath();
        try {
            const response = await fetch(basePath + 'assets/js/search-data.json');
            if (response.ok) {
                searchData = await response.json();
                isDataLoaded = true;
            }
        } catch (error) {
            console.error('Không thể tải dữ liệu tìm kiếm:', error);
        }
        return searchData;
    }

    // Chuẩn hóa text tiếng Việt (bỏ dấu để tìm kiếm dễ hơn)
    function removeVietnameseTones(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    }

    // Tìm kiếm trong dữ liệu
    function search(query) {
        if (!query || query.length < 2) return [];

        const normalizedQuery = removeVietnameseTones(query.trim());
        const queryLower = query.toLowerCase().trim();

        return searchData.filter(item => {
            const titleNorm = removeVietnameseTones(item.title);
            const contentNorm = removeVietnameseTones(item.content);
            const categoryNorm = removeVietnameseTones(item.category);

            const titleLower = item.title.toLowerCase();
            const contentLower = item.content.toLowerCase();

            // Tìm cả có dấu và không dấu
            return titleNorm.includes(normalizedQuery) ||
                contentNorm.includes(normalizedQuery) ||
                categoryNorm.includes(normalizedQuery) ||
                titleLower.includes(queryLower) ||
                contentLower.includes(queryLower);
        }).slice(0, 10); // Giới hạn 10 kết quả
    }

    // Highlight từ khóa trong text
    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Tạo HTML kết quả tìm kiếm
    function renderResults(results, query) {
        if (results.length === 0) {
            return `
                <div class="search-no-results" style="padding: 20px; text-align: center; color: #666;">
                    <i class="ri-search-line" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                    Không tìm thấy kết quả cho "<strong>${escapeHtml(query)}</strong>"
                </div>
            `;
        }

        const basePath = getBasePath();
        let html = '<ul class="search-results-list" style="list-style: none; margin: 0; padding: 0; max-height: 400px; overflow-y: auto;">';

        results.forEach(item => {
            // Điều chỉnh đường dẫn dựa vào vị trí file
            let url = item.url;
            if (window.location.pathname.includes('/pages/')) {
                // Đang ở trong thư mục pages
                if (url.startsWith('pages/')) {
                    url = url.replace('pages/', '');
                } else if (url === 'index.html') {
                    url = '../index.html';
                }
            } else {
                // Đang ở root
                if (!url.startsWith('pages/') && url !== 'index.html') {
                    url = 'pages/' + url;
                }
            }

            const snippet = item.content.length > 120
                ? item.content.substring(0, 120) + '...'
                : item.content;

            html += `
                <li style="border-bottom: 1px solid #eee;">
                    <a href="${url}" style="display: block; padding: 15px; text-decoration: none; color: inherit; transition: background 0.2s;" 
                       onmouseover="this.style.background='#f5f5f5'" 
                       onmouseout="this.style.background='transparent'">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                            ${highlightText(escapeHtml(item.title), query)}
                        </div>
                        <div style="font-size: 12px; color: #E6B333; margin-bottom: 5px;">
                            <i class="ri-folder-line"></i> ${escapeHtml(item.category)}
                        </div>
                        <div style="font-size: 13px; color: #666; line-height: 1.4;">
                            ${highlightText(escapeHtml(snippet), query)}
                        </div>
                    </a>
                </li>
            `;
        });

        html += '</ul>';
        return html;
    }

    // Escape HTML để tránh XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Khởi tạo tìm kiếm
    async function initSearch() {
        await loadSearchData();

        // Tìm tất cả các form tìm kiếm
        const searchForms = document.querySelectorAll('.searchform');

        searchForms.forEach(form => {
            const input = form.querySelector('input[type="search"], input[name="s"]');
            const resultsContainer = form.querySelector('.live-search-results');

            if (!input || !resultsContainer) return;

            // Ngăn form submit đến server
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const query = input.value.trim();
                if (query) {
                    const results = search(query);
                    if (results.length > 0) {
                        // Chuyển đến kết quả đầu tiên
                        const basePath = getBasePath();
                        let url = results[0].url;
                        if (window.location.pathname.includes('/pages/')) {
                            if (url.startsWith('pages/')) {
                                url = url.replace('pages/', '');
                            } else if (url === 'index.html') {
                                url = '../index.html';
                            }
                        }
                        window.location.href = url;
                    }
                }
            });

            // Tìm kiếm real-time khi gõ
            let debounceTimer;
            input.addEventListener('input', function () {
                clearTimeout(debounceTimer);
                const query = this.value.trim();

                debounceTimer = setTimeout(() => {
                    if (query.length >= 2) {
                        const results = search(query);
                        resultsContainer.innerHTML = renderResults(results, query);
                        resultsContainer.style.display = 'block';
                    } else {
                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'none';
                    }
                }, 300);
            });

            // Ẩn kết quả khi click ra ngoài
            document.addEventListener('click', function (e) {
                if (!form.contains(e.target)) {
                    resultsContainer.innerHTML = '';
                    resultsContainer.style.display = 'none';
                }
            });

            // Focus lại thì hiện kết quả
            input.addEventListener('focus', function () {
                if (this.value.trim().length >= 2) {
                    const results = search(this.value.trim());
                    resultsContainer.innerHTML = renderResults(results, this.value.trim());
                    resultsContainer.style.display = 'block';
                }
            });
        });
    }

    // Thêm CSS cho kết quả tìm kiếm
    function addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .live-search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 9999;
                margin-top: 10px;
            }
            .live-search-results mark {
                background: #FFE066;
                color: #333;
                padding: 0 2px;
                border-radius: 2px;
            }
            .search-results-list::-webkit-scrollbar {
                width: 6px;
            }
            .search-results-list::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            .search-results-list::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 3px;
            }
            .search-results-list::-webkit-scrollbar-thumb:hover {
                background: #999;
            }
        `;
        document.head.appendChild(style);
    }

    // Khởi chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addSearchStyles();
            initSearch();
        });
    } else {
        addSearchStyles();
        initSearch();
    }
})();
