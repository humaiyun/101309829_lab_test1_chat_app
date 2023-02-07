const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log(socket.id)
});

// handle receive all messages from db
let allMessages;
const messageDiv = document.getElementById("msg-container");
const getAllMessages = async () => {
    fetch("http://localhost:5000/messages", {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        allMessages = data;
    })
    .then(() => console.log(allMessages))
    .then(() => allMessages.map(msg => {
        messageDiv.innerHTML += `<h3>${msg.from_user}</h3><p>${msg.message}</p>`
    }));
}
getAllMessages();



// allMessages.map(msg => {
//     messageDiv.append(`<div>
//     <h3>${msg?.from_user?.toString()}</h3>
//     <h4>${msg?.message?.toString()}</h4>
//     </div>`)
// })


// handle user sign up
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const password = document.getElementById("password");

    const userObj = {
        username: username.value,
        firstName: firstname.value,
        lastName: lastname.value,
        password: password.value
    }

    await fetch("http://localhost:5000/api/v1/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
    }).then(res => {
        document.getElementById("signup-status").innerHTML = ``
        console.log(res);
        if(!res.status !== 200){
            document.getElementById("signup-status").innerHTML = `<h1 style="color:red;">Sign Up Failure</h1>`
        }
        document.getElementById("signup-status").innerHTML = `<h1 style="color:green;">Signed Up Successfully</h1>`
        document.getElementById("signed-in-banner").innerHTML = `<h1 style="color:green;">Logged In Successfully as ${username.value}</h1>`
        document.getElementById("username-message-box").placeholder = `${username.value}`
        username.value = "";
        firstname.value = "";
        lastname.value = "";
        password.value = "";
    })

    socket.emit("user-signup", userObj);
});

// handle user login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("usernameLogin");
    const password = document.getElementById("passwordLogin");

    const userObj = {
        username: username.value,
        password: password.value
    }

    await fetch("http://localhost:5000/api/v1/user/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userObj),
    }).then(res => {
        console.log(res);
        document.getElementById("signed-in-banner").innerHTML = ``
        if(!res.status !== 200){
            document.getElementById("signed-in-banner").innerHTML = `<h1 style="color:red;">Log In Failure</h1>`
        }
        document.getElementById("signed-in-banner").innerHTML = `<h1 style="color:green;">Logged In Successfully as ${username.value}</h1>`
        document.getElementById("username-message-box").placeholder = `${username.value}`
        username.value = "";
        password.value = "";
    });

    socket.emit("user-signin", userObj);
});


// Handle sending a message
const messageForm = document.getElementById("sendForm");
messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message-input").value
    const username = document.getElementById("message-input").value

    const msgObj = {
        message: messageInput,
        from_user: username,
        room: "main"
    }

    await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(msgObj),
    }).then(res => {
        console.log(res)
    });

    socket.emit("send-chat-msg", msgObj);

    messageInput.value = "";
});

