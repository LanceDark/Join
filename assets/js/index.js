/**
 * Initializes the login page animation.
 */
function initAnimation() {
    setTimeout(function () {
        let animateImgContainer = document.getElementById('animateImgContainer');
        animateImgContainer.classList.add('animateImgContainer'); 
        animateImgContainer.addEventListener('animationend', function () {
            window.location.href = 'login.html';
        });
    }, 500);
}