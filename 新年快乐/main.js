document.addEventListener('DOMContentLoaded', () => {
    const wishes = document.querySelectorAll('.wish');
    const qrcode = document.querySelector('.qrcode');
    let currentWishIndex = 0;
    let isLastWish = false;

    function showNextWish() {
        if (isLastWish) return;

        wishes[currentWishIndex].classList.remove('active');
        currentWishIndex = (currentWishIndex + 1) % wishes.length;
        wishes[currentWishIndex].classList.add('active');

        if (currentWishIndex === wishes.length - 1) {
            isLastWish = true;
            setTimeout(() => {
                qrcode.style.display = 'block';
            }, 1000);
        }
    }

    const interval = setInterval(showNextWish, 3000);

    function checkAndStopInterval() {
        if (isLastWish) {
            clearInterval(interval);
        }
    }

    setInterval(checkAndStopInterval, 1000);
}); 