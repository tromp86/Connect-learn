window.addEventListener("scroll", function() {
    const header = document.getElementById("header");
    if (window.scrollY > 20) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Додаємо обробник події для кліку по всьому екрану
    document.addEventListener('click', function(event) {
        // Перевіряємо, чи клікнув користувач поза специфічними елементами
        const ignoredElements = [];
        const clickedElementId = event.target.id;

        if (!ignoredElements.includes(clickedElementId)) {
            // Перехід на index.html
            window.location.href = 'index.html';
        }
    });
});