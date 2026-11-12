
// МОБИЛЬНОЕ МЕНЮ

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navigation.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Закрыть меню" : "Открыть меню"
        );

    });

    // Закрытие меню после выбора раздела

    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navigation.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Открыть меню");

        });

    });

}

// =========================================
// ДОПОЛНЕНИЯ — подключать ПОСЛЕ script.js
// =========================================

// ---------- ПОИСК ПО УСЛУГАМ ----------
(function () {
    const input = document.getElementById("service-search");
    const list = document.getElementById("service-list") || document.querySelector(".service-cards");
    if (!input || !list) return;

    const clearBtn = document.getElementById("service-search-clear");
    const status = document.getElementById("service-search-status");
    const empty = document.getElementById("service-empty");
    const cards = [...list.querySelectorAll(".service-card")];

    // ё = е, регистр не важен
    const norm = s => s.toLowerCase().replace(/ё/g, "е").trim();

    // Совпадение по началу слов запроса (находит «масл» → «масла»)
    const matches = (text, words) => words.every(w => text.includes(w));

    function runSearch() {
        const query = norm(input.value);
        const words = query.split(/\s+/).filter(Boolean);
        clearBtn.hidden = !query;

        let found = 0;
                cards.forEach(card => {
            if (card.dataset.group === undefined) card.dataset.group = card.getAttribute("name") || "";
            if (words.length) card.removeAttribute("name");
            else if (card.dataset.group) card.setAttribute("name", card.dataset.group);

            const items = [...card.querySelectorAll("li")];

            items.forEach(li => {
                li.classList.remove("is-match", "is-hidden");
                if (!words.length) return;
                const ok = matches(norm(li.textContent) + " " + title, words);
                li.classList.toggle("is-match", ok && matches(norm(li.textContent), words));
                if (ok) cardHits++;
            });

            if (!words.length) { card.hidden = false; return; }

            // Если совпало название категории — показываем её целиком
            const titleHit = matches(title, words);
            const visible = cardHits > 0 || titleHit;
            card.hidden = !visible;
            if (visible) {
                card.open = true;
                found += titleHit && !cardHits ? items.length : items.filter(l => l.classList.contains("is-match")).length || cardHits;
            }
        });

        empty.hidden = !(words.length && cards.every(c => c.hidden));
        status.textContent = !words.length ? "" :
            cards.every(c => c.hidden) ? "Ничего не найдено" : "Найдено услуг: " + found;
        if (!words.length) cards.forEach(c => (c.open = false));
    }

    input.addEventListener("input", runSearch);
    clearBtn.addEventListener("click", () => { input.value = ""; runSearch(); input.focus(); });
})();


// ---------- КНОПКА ЗВОНКА (мобильные) ----------
(function () {
    const btn = document.getElementById("call-fab-button");
    const panel = document.getElementById("call-fab-panel");
    if (!btn || !panel) return;

    const toggle = open => {
        panel.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
    };

    btn.addEventListener("click", e => { e.stopPropagation(); toggle(panel.hidden); });
    document.addEventListener("click", e => { if (!panel.contains(e.target)) toggle(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });
})();


// ---------- ЗАКРЫТИЕ МОБИЛЬНОГО МЕНЮ ПО КЛИКУ ВНЕ И ПО ESC ----------
(function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");
    if (!menuToggle || !navigation) return;

    const close = () => {
        navigation.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
    };
    document.addEventListener("click", e => {
        if (!navigation.contains(e.target) && !menuToggle.contains(e.target)) close();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();
