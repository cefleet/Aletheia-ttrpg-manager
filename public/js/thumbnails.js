export default function renderThumbnails(parentElement, images, onClick){
    parentElement.innerHTML = ''
    images.forEach(image => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.dataset.image = image;

        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.alt = image;

        thumbnail.appendChild(imgElement);
        parentElement.appendChild(thumbnail);

        thumbnail.addEventListener('click', ()=>onClick(image));
    });
}