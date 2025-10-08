document.addEventListener('DOMContentLoaded', function() {
    
    // Global Element Tanımları
    const postInput = document.getElementById('post-input');
    const postButton = document.getElementById('post-button');
    const charCount = document.getElementById('char-count');
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    const userDisplayName = document.getElementById('user-display-name'); 
    const userHandleDisplay = document.getElementById('user-handle-display'); 
    const profileAvatarImg = document.getElementById('profile-avatar'); 
    const postAvatarPreview = document.getElementById('post-avatar-preview');

    const MAX_CHAR_LIMIT = 280; 
    const DEFAULT_AVATAR = "https://i.ibb.co/L9H8bXJ/default-avatar.png";

    const USER_PROFILE = {
        name: "Anonim", 
        handle: "@anonim", 
        avatarUrl: DEFAULT_AVATAR
    };

    let posts = [];

    /* ===================================================
       BÖLÜM 1: VERİ KALICILIĞI (Local Storage)
    =================================================== */

    function updateAvatarDisplay() {
        if (profileAvatarImg) profileAvatarImg.src = USER_PROFILE.avatarUrl;
        if (postAvatarPreview) postAvatarPreview.src = USER_PROFILE.avatarUrl;
    }

    function loadUserProfile() {
        const storedProfile = localStorage.getItem('microblogUserProfile');
        if (storedProfile) { Object.assign(USER_PROFILE, JSON.parse(storedProfile)); }
        updateAvatarDisplay();
    }

    function saveUserProfile() {
        localStorage.setItem('microblogUserProfile', JSON.stringify(USER_PROFILE));
        if (userDisplayName) userDisplayName.textContent = USER_PROFILE.name; 
        if (userHandleDisplay) userHandleDisplay.textContent = USER_PROFILE.handle;
        updateAvatarDisplay();
    }

    function loadPosts() {
        const storedPosts = localStorage.getItem('microblogPosts');
        if (storedPosts) {
            posts = JSON.parse(storedPosts);
        } else {
            posts = [
                { id: 1, content: "Bu, nihai Frontend sürümümüz. Sunucu kurduğunuzda bu mesajlar silinecek ve gerçek verileriniz görünecek.", timestamp: new Date().toLocaleString('tr-TR'), likes: 5, comments: 0, isLiked: false },
                { id: 2, content: "Şimdi Backend için hazırlık yapıyoruz!", timestamp: new Date().toLocaleString('tr-TR'), likes: 12, comments: 0, isLiked: true }
            ];
        }
    }

    function savePosts() {
        localStorage.setItem('microblogPosts', JSON.stringify(posts));
    }

    /* ===================================================
       BÖLÜM 2: GÖNDERİ GÖSTERİMİ VE ETKİLEŞİM
    =================================================== */

    function createPostHtml(post) {
        const likeIcon = post.isLiked ? 'fas fa-heart text-danger' : 'far fa-heart text-secondary';
        
        return `
            <div class="card bg-dark border-top border-secondary rounded-0 p-3 post-item" data-post-id="${post.id}">
                <div class="d-flex align-items-start">
                    <img src="${USER_PROFILE.avatarUrl}" alt="Avatar" class="rounded-circle me-3" width="40" height="40" style="object-fit: cover;">
                    <div class="flex-grow-1">
                        
                        <h6 class="mb-1 fw-bold">${USER_PROFILE.name} <span class="text-secondary fw-normal me-1">${USER_PROFILE.handle}</span> · ${post.timestamp}</h6>
                        <p class="mb-3">${post.content}</p>

                        <div class="d-flex justify-content-between align-items-center text-secondary mt-3 pt-2 border-top border-secondary">
                            <div class="d-flex">
                                <div class="me-4"><i class="far fa-comment me-1"></i><span>${post.comments}</span></div>
                                <div class="post-like-btn" data-id="${post.id}" style="cursor: pointer;"><i class="${likeIcon} me-1"></i><span>${post.likes}</span></div>
                            </div>
                            <div class="text-end">
                                <a href="#" class="text-danger fw-bold" onclick="window.deletePost(${post.id}); return false;">SİL</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderPosts() {
        saveUserProfile(); 
        if (postsContainer) {
            const postsHtml = posts.map(createPostHtml).join('');
            postsContainer.innerHTML = postsHtml;
        }
    }

    function handlePostInteraction(event) {
        const likeBtn = event.target.closest('.post-like-btn');
        
        if (likeBtn) {
            const postId = parseInt(likeBtn.dataset.id); 
            const postToUpdate = posts.find(post => post.id === postId);

            if (postToUpdate) {
                postToUpdate.isLiked = !postToUpdate.isLiked;
                postToUpdate.isLiked ? postToUpdate.likes++ : postToUpdate.likes--;
                savePosts(); 
                renderPosts(); 
            }
        } 
    }
    if (postsContainer) { postsContainer.addEventListener('click', handlePostInteraction); }

    /* ===================================================
       BÖLÜM 3: GÖNDERİ VE PROFİL YÖNETİMİ
    =================================================== */

    function updatePostInput() {
        if (!postInput || !charCount || !postButton) return;
        const currentLength = postInput.value.length;
        charCount.textContent = `${currentLength}/${MAX_CHAR_LIMIT}`;

        const isValid = currentLength > 0 && currentLength <= MAX_CHAR_LIMIT;
        postButton.disabled = !isValid;

        charCount.classList.toggle('text-danger', currentLength > MAX_CHAR_LIMIT);
        charCount.classList.toggle('text-secondary', currentLength <= MAX_CHAR_LIMIT);
    }
    if (postInput) postInput.addEventListener('input', updatePostInput);

    function handlePostSubmit(event) {
        if (!postForm) return;
        event.preventDefault(); 
        const content = postInput.value.trim();

        if (content.length === 0 || content.length > MAX_CHAR_LIMIT) return;

        const newPost = {
            id: Date.now(), 
            content: content,
            timestamp: new Date().toLocaleString('tr-TR'),
            likes: 0, comments: 0, isLiked: false
        };

        posts.unshift(newPost);
        savePosts(); 
        renderPosts();

        postInput.value = '';
        updatePostInput();
    }
    if (postForm) postForm.addEventListener('submit', handlePostSubmit);


    /* ===================================================
       BÖLÜM 4: PROFİL VE SİLME İŞLEVLERİ (Global Fonksiyonlar)
    =================================================== */

    window.updateUserName = function() {
        const newName = prompt("Yeni adınızı girin:");
        if (newName && newName.trim().length > 0) {
            USER_PROFILE.name = newName.trim();
            saveUserProfile(); 
            renderPosts(); 
        }
    }

    window.updateUserHandle = function() {
        const newHandle = prompt("Yeni kullanıcı adınızı (@ olmadan) girin:");
        if (newHandle && newHandle.trim().length > 0) {
            const finalHandle = "@" + newHandle.trim().toLowerCase().replace(/\s/g, ''); 
            USER_PROFILE.handle = finalHandle;
            saveUserProfile(); 
            renderPosts(); 
        }
    }

    window.updateAvatar = function() {
        const newUrl = prompt("Yeni profil fotoğrafınızın URL'sini yapıştırın:");
        if (newUrl && newUrl.trim().length > 0) {
            USER_PROFILE.avatarUrl = newUrl.trim();
            saveUserProfile(); 
            renderPosts(); 
        }
    }

    window.deletePost = function(postId) {
        if (confirm("Bu gönderiyi silmek istediğinizden emin misiniz?")) {
            posts = posts.filter(post => post.id !== postId);
            savePosts(); 
            renderPosts();
        }
    }

    /* ===================================================
       BÖLÜM 5: UYGULAMA BAŞLANGICI
    =================================================== */

    loadUserProfile(); 
    loadPosts();       
    updatePostInput(); 
    renderPosts();
});