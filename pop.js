document.addEventListener('DOMContentLoaded', function() {
    // Перемикання видимості елемента myDIV
    document.getElementById("toggleBtn").addEventListener("click", function() {
        this.classList.toggle("rotate");
        document.getElementById("myDIV").classList.toggle("hidden");
    });

    // Копіювання тексту в буфер обміну
    document.getElementById("copyIcon").addEventListener("click", function() {
        var text = document.getElementById("copyText").innerText;

        navigator.clipboard.writeText(text).then(function() {
            // Створюємо кастомне повідомлення
            var alertBox = document.createElement("div");
            alertBox.classList.add("custom-alert");
            alertBox.innerText = "Address copied: " + text;
            document.body.appendChild(alertBox);

            // Автоматичне закриття сповіщення через 3 секунди
            setTimeout(function() {
                alertBox.remove();
            }, 3000);
        }).catch(function(err) {
            console.error("Error copying text: ", err);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Додаємо обробник події для кліку по всьому екрану
    document.addEventListener('click', function(event) {
        // Перевіряємо, чи клікнув користувач поза специфічними елементами
        const ignoredElements = ['toggleBtn', 'coffee', 'myDIV', 'copyText', 'copyIcon'];
        const clickedElementId = event.target.id;

        if (!ignoredElements.includes(clickedElementId)) {
            // Перехід на index.html
            window.location.href = 'index.html';
        }
    });
});
