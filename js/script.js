
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
    const list = document.getElementById("service-list");
    const clearBtn = document.getElementById("service-search-clear");
    const status = document.getElementById("service-search-status");
    const empty = document.getElementById("service-empty");

    if (!input || !list) return;

    const cards = Array.from(list.querySelectorAll(".service-card"));

    // Нормализация текста: регистр не важен, ё = е
    const normalize = text =>
        text.toLocaleLowerCase("ru-RU")
            .replace(/ё/g, "е")
            .trim();

    function runSearch() {
        const query = normalize(input.value);
        const words = query.split(/\s+/).filter(Boolean);

        let totalFound = 0;
        let visibleCards = 0;

        if (clearBtn) {
            clearBtn.hidden = !query;
        }

        cards.forEach(card => {
            const titleElement = card.querySelector(".service-card-title");
            const title = normalize(titleElement?.textContent || "");

            const items = Array.from(card.querySelectorAll("li"));

            // Совпадение по названию категории
            const titleMatch = words.length > 0 &&
                words.every(word => title.includes(word));

            let cardFound = 0;

            items.forEach(item => {
                const text = normalize(item.textContent);

                const itemMatch = words.length > 0 &&
                    words.every(word =>
                        text.includes(word) || titleMatch
                    );

                item.classList.toggle("is-match", itemMatch);
                item.classList.toggle("is-hidden", words.length > 0 && !itemMatch);

                if (itemMatch) cardFound++;
            });

            if (!words.length) {
                card.hidden = false;
                card.open = false;

                items.forEach(item => {
                    item.classList.remove("is-match", "is-hidden");
                });

                return;
            }

            const isVisible = titleMatch || cardFound > 0;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCards++;
                card.open = true;

                if (titleMatch) {
                    totalFound += items.length;
                } else {
                    totalFound += cardFound;
                }

                // Если совпало название категории,
                // показываем все услуги этой категории
                if (titleMatch) {
                    items.forEach(item => {
                        item.classList.remove("is-hidden");
                        item.classList.add("is-match");
                    });
                }
            } else {
                card.open = false;
            }
        });

        if (empty) {
            empty.hidden = !(words.length && visibleCards === 0);
        }

        if (status) {
            status.textContent = !words.length
                ? ""
                : visibleCards === 0
                    ? "Ничего не найдено"
                    : "Найдено услуг: " + totalFound;
        }
    }

    input.addEventListener("input", runSearch);

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            input.value = "";
            runSearch();
            input.focus();
        });
    }

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
