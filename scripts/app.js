'use strict'

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
$removeBtn.addEventListener('click', asideShow);

const asideRemove = () => {
    $aside.style.transform = 'translateX(0%)';
    $aside.style.transition = '0.2s';
    $showBtn.style.display = 'none';
    $removeBtn.style.display = 'flex';
    $gritContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    $gritContainer.style.marginLeft = '33%';
}
$showBtn.addEventListener('click', asideRemove);
//---------------------------------------------------

const $textArea = document.querySelector('#textArea');
const $postImage = document.querySelector('#postImage');
const $postPrice = document.querySelector('#postPrice');
const $postPart = document.querySelector('#postPart');
const $postTitle = document.querySelector('#postTitle');
const $formPost = document.querySelector('#formPost');

//------------------------------------------------------

const baseURL = "http://localhost:7777";

const TostifyPanel = (messeg, type) => {
    return Toastify({
        className: type === "success" ? "success" : "error",
        text: messeg,
        duration: 3000
    });
}

//---------------------------------------------
{/* <a href='../pages/single.html?info-id=${item.id}'></a> */}
//--------------------------------------------------------

const renderData = (response) => {
    $gritContainer.innerHTML = '';
    if (response.length) {
        const res = response.slice(1);
        res.forEach(item => {
            const $a = document.createElement('a');
            $a.innerHTML = `
            <div class="productCard" data-id="${item.id}">
                <div class="img">
                    
                    <img src="${item.img}" alt="${item.title}"/>
                    </a>
                </div>
                <div class="info">
                    <h3>${item.title}</h3>
                    <p style="font-weight: 700; margin-bottom:20px">Catalog: ${item.part.substring(0, 10)}</p>
                    <p style="font-weight: 500; margin-bottom:27px; font-size:10px">${item.description.substring(0, 50)}...</p>
                    <p style="color:red">$${item.price}</p>
                    <div class="functionBtn">
                        <button class="updateBtn"><i class="bi bi-pencil"></i></button>
                        <button class="deleteBtn"><i class="bi bi-trash3"></i></button>
                    </div>
                </div>
            </div>
            `;
            $gritContainer.appendChild($a);
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.productCard');
                const postId = productCard.getAttribute('data-id');
                deleteData(postId);
                console.log(button);
            });
        });

        const updateBtns = document.querySelectorAll('.updateBtn');
        updateBtns.forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.productCard');
                const postId = productCard.getAttribute('data-id');
                showModal(postId);
                console.log(postId);
            });
        });
    }
}

const resultSingle = async (id) => {
    if (!id) return;

    try {
        const request = await fetch(`${baseURL}/posts/${id}`);
        const data = await request.json();
        const $resImg = document.createElement('img');
        $resImg.src = data.img;
        document.body.appendChild($resImg);
    } catch (error) {
        console.error(error);
    }
}

window.addEventListener('load', () => {
    const URL = location.search;
    const infoId = new URLSearchParams(URL).get("info-id");
    resultSingle(infoId);
});

const showModal = (id) => {
    $modal.style.display = 'flex';
    $contentModal.style.transform = 'translateY(0%)';
    $contentModal.style.transition = '0.7s';

    const post = posts.find(post => post.id === id);
    $updateTitle.value = post.title;
    $updatePart.value = post.part;
    $updatePrice.value = post.price;
    $updateImage.value = post.img;
    $updatetextArea.value = post.description;

    $updateBtn.setAttribute('data-id', id);
}

//----------------------------------------------------

let posts = JSON.parse(localStorage.getItem('posts')) || [];

const savePostsToLocalStorage = () => {
    console.log(posts);
    localStorage.setItem('posts', JSON.stringify(posts));
}

const createData = async (URL) => {
    const newPost = {
        id: String(Date.now()),
        title: $postTitle.value,
        part: $postPart.value,
        price: $postPrice.value,
        img: $postImage.value,
        description: $textArea.value
    }
    try {
        const request = await fetch(URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });
        if (request.status === 201) {
            posts.push(newPost);
            savePostsToLocalStorage();
            TostifyPanel("Successfully saved", "success").showToast();
            renderData(posts);
        } else {
            TostifyPanel("Data not saved", "error").showToast();
        }
    } catch (error) {
        console.error(error);
    }
}

$formPost.addEventListener('submit', (e) => {
    e.preventDefault();
    createData(`${baseURL}/posts`);
});

//--------------------------------------------------

const getPosts = async (URL) => {
    try {
        const request = await fetch(URL);
        const response = await request.json();
        if (request.status === 200) {
            posts = response;
            savePostsToLocalStorage();
            renderData(response);
        } else {
            console.error('Failed to fetch posts', request.status);
        }
    } catch (error) {
        console.error(error);
    }
}

//---------------------------------------------------------------

const $modal = document.querySelector('.modal');
const $contentModal = document.querySelector('.content');
const $content = document.querySelector('#formUpdate');
const $updateBtn = document.querySelector('#updateBtn');
const $cancelBtn = document.querySelector('#cancelBtn');
const $updateTitle = document.querySelector('#updateTitle');
const $updatePart = document.querySelector('#updatePart');
const $updatePrice = document.querySelector('#updatePrice');
const $updateImage = document.querySelector('#updateImage');
const $updatetextArea = document.querySelector('#updatetextArea');

//-----------------------------------------------------

const removeModal = () => {
    $contentModal.style.transform = 'translateY(-450%)';
    $contentModal.style.transition = '0.7s';
    $modal.style.display = 'none';
}
$cancelBtn.addEventListener('click', removeModal);

const getById = async (URL, id) => {
    const updateObj = {
        title: $updateTitle.value,
        part: $updatePart.value,
        price: $updatePrice.value,
        img: $updateImage.value,
        description: $updatetextArea.value
    };

    try {
        const request = await fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateObj)
        })

        if (request.status === 200 || request.status === 204) { // 200 yoki 204 bo'lishi kerak
            posts = posts.map(post => post.id === id ? { ...post, ...updateObj } : post);
            savePostsToLocalStorage();
            TostifyPanel("Successfully changed", "success").showToast(); // Toastify nomi to'g'ri yozildi
            renderData(posts);
            removeModal();
        } else {
            console.error('Failed to update post', request.status);
        }
    } catch (error) {
        console.error(error);
    }
};

$updateBtn.addEventListener('click', (e) => { 
    e.preventDefault();
    const id = $updateBtn.getAttribute('data-id');

    getById(`${baseURL}/posts`, id);
});

getPosts(`${baseURL}/posts`);

const deleteData = async (id) => {
    try {
        const request = await fetch(`${baseURL}/posts/${id}`, {
            method: "DELETE"
        });
        console.log(request);
        if (request.status === 200) {
            console.log('deleted');
            posts = posts.filter(post => post.id !== id);
            savePostsToLocalStorage();
            Tostify("Successfully deleted", "success").showToast();
            renderData(posts);
        } else {
            console.error('Failed to delete post', request.status);
        }
    } catch (error) {
        console.error(error);
    }
}

const clearLocalStorage = (e) => {
    e.preventDefault();
    localStorage.removeItem('posts');
    posts = [];
    renderData(posts);
}

const $clearAll = document.querySelector('.btns');
const $clearBtn = document.createElement('button');
$clearBtn.textContent = 'Clear All';
$clearBtn.style.fontSize = '15px';
$clearBtn.style.fontWeight = '700';
$clearBtn.style.border = '1px solid black';
$clearAll.className = 'clearAll';
$clearBtn.addEventListener('click', clearLocalStorage);
$clearAll.appendChild($clearBtn);
