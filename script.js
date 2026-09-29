
let posts = [
    {
        id: 1,
        title: "My First Blog",
        author: "Sameera",
        content: "Welcome to my first blog on BlogSpace! I am learning web development using HTML, CSS and JavaScript.",
        comments: []
    },
    {
        id: 2,
        title: "My Learning Journey",
        author: "Sameera",
        content: "I am a CSE AI & ML student. I am improving my programming skills and building projects.",
        comments: []
    }
];

let currentUser = null;
let nextId = 3;

function showHome() {
    document.getElementById("main").innerHTML = `
        <h2>Latest Blog Posts</h2>
        <div id="posts"></div>
    `;
    displayPosts();
}

function displayPosts() {
    const container = document.getElementById("posts");

    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = "<p>No blog posts yet. Create your first blog!</p>";
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="card">
            <h3>${escapeHTML(post.title)}</h3>
            <p>By ${escapeHTML(post.author)}</p>
            <p>${escapeHTML(post.content)}</p>
            <p>💬 ${post.comments.length} comments</p>
            <button onclick="viewPost(${post.id})">Read More</button>
            ${
                currentUser === post.author
                ? `<button onclick="editPost(${post.id})">Edit</button>
                   <button onclick="deletePost(${post.id})">Delete</button>`
                : ""
            }
        </div>
    `).join("");
}

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function showRegister() {
    document.getElementById("main").innerHTML = `
        <div class="card">
            <h2>Create an Account</h2>
            <form onsubmit="registerUser(event)">
                <label>Username</label>
                <input id="regName" required>
                <label>Email</label>
                <input id="regEmail" type="email" required>
                <label>Password</label>
                <input id="regPassword" type="password" minlength="6" required>
                <button type="submit">Register</button>
            </form>
        </div>
    `;
}

function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    let users = JSON.parse(localStorage.getItem("blogUsers") || "[]");

    if (users.some(user => user.email === email)) {
        alert("Email already registered. Please login.");
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("blogUsers", JSON.stringify(users));

    alert("Registration successful! Please login.");
    showLogin();
}

function showLogin() {
    document.getElementById("main").innerHTML = `
        <div class="card">
            <h2>Login to BlogSpace</h2>
            <form onsubmit="loginUser(event)">
                <label>Email</label>
                <input id="loginEmail" type="email" required>
                <label>Password</label>
                <input id="loginPassword" type="password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `;
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("blogUsers") || "[]");

    const user = users.find(
        item => item.email === email && item.password === password
    );

    if (!user) {
        alert("Invalid email or password.");
        return;
    }

    currentUser = user.username;
    alert("Welcome, " + currentUser + "!");
    updateNavigation();
    showHome();
}

function updateNavigation() {
    const nav = document.querySelector("nav");

    if (currentUser) {
        nav.innerHTML = `
            <a href="#" onclick="showHome()">Home</a>
            <a href="#" onclick="showCreate()">Write Blog</a>
            <a href="#" onclick="logout()">Logout (${escapeHTML(currentUser)})</a>
        `;
    } else {
        nav.innerHTML = `
            <a href="#" onclick="showHome()">Home</a>
            <a href="#" onclick="showLogin()">Login</a>
            <a href="#" onclick="showRegister()">Register</a>
        `;
    }
}

function logout() {
    currentUser = null;
    updateNavigation();
    showHome();
}

function showCreate() {
    if (!currentUser) {
        alert("Please login first.");
        showLogin();
        return;
    }

    document.getElementById("main").innerHTML = `
        <div class="card">
            <h2>Create New Blog</h2>
            <form onsubmit="createPost(event)">
                <label>Blog Title</label>
                <input id="blogTitle" required>
                <label>Blog Content</label>
                <textarea id="blogContent" required></textarea>
                <button type="submit">Publish Blog</button>
            </form>
        </div>
    `;
}

function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value.trim();
    const content = document.getElementById("blogContent").value.trim();

    if (!title || !content) return;

    posts.unshift({
        id: nextId++,
        title,
        author: currentUser,
        content,
        comments: []
    });

    alert("Blog published successfully!");
    showHome();
}

function viewPost(id) {
    const post = posts.find(item => item.id === id);
    if (!post) return;

    document.getElementById("main").innerHTML = `
        <div class="card">
            <h2>${escapeHTML(post.title)}</h2>
            <p>Written by ${escapeHTML(post.author)}</p>
            <p>${escapeHTML(post.content)}</p>

            ${
                currentUser === post.author
                ? `<button onclick="editPost(${post.id})">Edit Blog</button>
                   <button onclick="deletePost(${post.id})">Delete Blog</button>`
                : ""
            }

            <hr>
            <h3>Comments (${post.comments.length})</h3>

            ${
                currentUser
                ? `<form onsubmit="addComment(event, ${post.id})">
                    <textarea id="commentText" placeholder="Write your comment..." required></textarea>
                    <button type="submit">Add Comment</button>
                   </form>`
                : `<p>Please login to comment.</p>`
            }

            <div>
                ${post.comments.map(comment => `
                    <div class="comment">
                        <strong>${escapeHTML(comment.author)}</strong>
                        <p>${escapeHTML(comment.text)}</p>
                    </div>
                `).join("")}
            </div>

            <button onclick="showHome()">Back to Home</button>
        </div>
    `;
}

function addComment(event, id) {
    event.preventDefault();

    const text = document.getElementById("commentText").value.trim();
    const post = posts.find(item => item.id === id);

    if (!post || !text) return;

    post.comments.push({
        author: currentUser,
        text
    });

    viewPost(id);
}

function editPost(id) {
    const post = posts.find(item => item.id === id);

    if (!post || post.author !== currentUser) return;

    document.getElementById("main").innerHTML = `
        <div class="card">
            <h2>Edit Blog</h2>
            <form onsubmit="saveEdit(event, ${id})">
                <label>Title</label>
                <input id="editTitle" value="${escapeHTML(post.title)}" required>
                <label>Content</label>
                <textarea id="editContent" required>${escapeHTML(post.content)}</textarea>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    `;
}

function saveEdit(event, id) {
    event.preventDefault();

    const post = posts.find(item => item.id === id);
    if (!post || post.author !== currentUser) return;

    post.title = document.getElementById("editTitle").value.trim();
    post.content = document.getElementById("editContent").value.trim();

    alert("Blog updated successfully!");
    showHome();
}

function deletePost(id) {
    const post = posts.find(item => item.id === id);

    if (!post || post.author !== currentUser) return;

    if (confirm("Are you sure you want to delete this blog?")) {
        posts = posts.filter(item => item.id !== id);
        alert("Blog deleted successfully!");
        showHome();
    }
}

displayPosts();