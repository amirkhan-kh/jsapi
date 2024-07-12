const $aside = document.querySelector('.aside');
const $showBtn = document.querySelector('#btnBlock');
const $removeBtn = document.querySelector('#btnRemove');
const $gritContainer = document.querySelector('#gritContainer');

//------------------------------------------------------

const asideShow = () => {
    $aside.style.transform = 'translateX(-1550%)';
    $aside.style.transition = '1s';
    $removeBtn.style.display = 'none';
    $showBtn.style.display = 'flex';
    $gritContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    $gritContainer.style.marginLeft = '0%';
}
$removeBtn.addEventListener('submit', asideShow);

const asideRemove = () => {
    $aside.style.transform = 'translateX(0%)';
    $aside.style.transition = '0.2s';
    $showBtn.style.display = 'none';
    $removeBtn.style.display = 'flex';
    $gritContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    $gritContainer.style.marginLeft = '33%';
}
$showBtn.addEventListener('submit', asideRemove);