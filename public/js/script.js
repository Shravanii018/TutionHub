// ===== Bootstrap form validation (same as your Airbnb project) =====
(function () {
    'use strict'

    var forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})();


// ===== Flashcard flip interaction =====
// clicking a flashcard toggles between question and answer
document.querySelectorAll(".flashcard-box").forEach(function (card) {
    card.addEventListener("click", function () {
        card.classList.toggle("flipped");
    });
});


// ===== Auto-hide flash messages after 3 seconds =====
setTimeout(function () {
    let alerts = document.querySelectorAll(".alert");
    alerts.forEach(function (alert) {
        alert.style.transition = "opacity 0.5s ease";
        alert.style.opacity = "0";
        setTimeout(function () {
            alert.remove();
        }, 500);
    });
}, 3000);
