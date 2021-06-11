import files from "./images.js"; // Importing all the image files

let active; // Holds the index of current active list element
const img = document.querySelector(".img-box img"); // Selecting img box and title so that it can be reset on certain events
const img_title = document.querySelector(".img-title");

function createList() {
    // Initially creates all the list items and sets the first element as default
    const list = document.querySelector(".list");

    for (let i = 0; i < files.length; i++) {
        let url = files[i].previewImage;
        let title = files[i].title;
        const newListElement = document.createElement("li"); // Creating a new list element and setting its attributes
        newListElement.classList.add("list-element");
        newListElement.setAttribute("url", `${url}`);
        newListElement.setAttribute("title", `${title}`);
        // Using innerHTML to create the structure of the list element
        newListElement.innerHTML = `   
        <div class = "list-element-image">
            <img src ="${url}" alt = "">
        </div>
        <div class = "list-element-title">
            ${title}
        </div>
        `;
        if (i == 0) {
            // Setting first element as default active
            newListElement.classList.add("active");
            img.setAttribute("src", `${url}`);
            img_title.innerHTML = `${title}`;
            active = 0;
        }
        list.appendChild(newListElement);
    }
}
createList();

const listElements = document.querySelectorAll(".list-element"); // Storing all the list elements

function resizeTitle() {
    // Used to resize titles using binary search
    const listElementsText = document.querySelectorAll(".list-element-title");
    let fullWidth =
        document.querySelector(".list-element-title").clientWidth + 1; // Calculates the intended width for the title text
    let body = document.querySelector("body");
    for (let i = 0; i < listElements.length; i++) {
        let title = listElements[i].title;
        let finalTitle = title;
        const div = document.createElement("div"); // Line number 50 - 58, is used to calculate the width of our actual title on DOM
        div.innerHTML = `${title}`;
        body.appendChild(div);
        div.style["width"] = "fit-content";
        div.style["font-size"] = "1.75vh";
        div.style["fontFamily"] =
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
        let width = div.clientWidth + 1;
        body.removeChild(body.lastElementChild);
        if (width + 10 > fullWidth) {
            // If the title is overflowing, then we enter this block and make use of binary search to resize the title
            let L = 1,
                U = Math.floor(title.length / 2);
            while (L <= U) {
                let M = Math.floor((L + U) / 2); // Here 'M ' is the number of characters to be used from the front/back
                let newTitle =
                    title.slice(0, M) + "..." + title.slice(title.length - M);
                const div = document.createElement("div"); // Line number 67 - 75, is used to calculate the width of the new title on DOM
                div.innerHTML = `${newTitle}`;
                body.appendChild(div);
                div.style["width"] = "fit-content";
                div.style["font-size"] = "1.75vh";
                div.style["fontFamily"] =
                    "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
                let width = div.clientWidth + 1;
                body.removeChild(body.lastElementChild);
                if (width + 10 <= fullWidth) {
                    // If the new title fits, we set it as the best possible title till now
                    finalTitle = newTitle;
                    L = M + 1;
                } else {
                    // else, we reduce the value of 'M'
                    U = M - 1;
                }
            }
        }
        listElementsText[i].innerHTML = `${finalTitle}`;
    }
}
resizeTitle();

function handleChange(index) {
    // Used to set another list element as active
    if (active != index) {
        document.querySelector(".active").classList.remove("active");
        listElements[index].classList.add("active");
        img.setAttribute("src", `${listElements[index].getAttribute("url")}`);
        img_title.innerHTML = `${listElements[index].getAttribute("title")}`;
        active = index;
    }
}

for (let i = 0; i < listElements.length; i++) {
    // Attaching event listeners for 'click' event
    listElements[i].addEventListener("click", () => {
        handleChange(i);
    });
}

document.addEventListener("keydown", (e) => {
    // Attaching event listeners for ArrowUp and ArrowDown
    if (e.code == "ArrowDown") {
        let index = (active + 1) % listElements.length;
        handleChange(index);
    } else if (e.code == "ArrowUp") {
        let index = (active - 1 + listElements.length) % listElements.length;
        handleChange(index);
    }
});

window.addEventListener("resize", resizeTitle);
