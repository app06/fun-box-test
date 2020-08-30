import './polyfills';

function selectedHover(event) {
    const el = event.target;

    if (el.classList.contains('selected')) {
        el.closest('.card').classList.add('selected-hover');
        el.removeEventListener('mouseleave', selectedHover);
    }
}

function buy(event) {
    const el = event.target;
    const card = el.closest('.card');

    if (el.classList.contains('card__info') ||
        el.classList.contains('card__info-text') ||
        !card ||
        card.classList.contains('disabled')) return;

    if (!card.classList.contains('selected')) {
        card.classList.add('selected');
        card.addEventListener('mouseleave', selectedHover);
        return;
    }

    card.className = 'card';
    card.removeEventListener('mouseleave', selectedHover);
}

window.addEventListener('load', () => {
    const row = document.querySelector('.row');

    row.addEventListener('click', buy);
});