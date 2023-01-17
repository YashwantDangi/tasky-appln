const state = {
  taskList: [],
};

// dom manipulations
const taskModel = document.querySelector(".task__modal__body");
const taskContents = document.querySelector(".task__contents");

// console.log(taskModel);

// getElementById() , getElementByClass() , getElementByTagName()
//      >> these r used when we want to process the user data from html in js

// querySelector()
//      >> these r used from js to insert any kind of html text which would be reflected on the UI

// to create a card on Home pg
const htmlTaskContent = ({ id, title, description, type, url }) => `


    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick='editTask.apply(this,arguments)'>
                    <i class='fa fa-pencil-alt' name='${id}'></i>
                </button>
                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask.apply(this,arguments)'>
                    <i class='fa fa-trash-alt' name='${id}'></i>
                </button>
            </div>
            <div class='card-body'>
                ${
                  url
                    ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsKqnvyCNTs_5rX1NVeyIWsw6qmKCPpLI5yw&usqp=CAU" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                }
                <h4 class='task__card__title'>${title}</h4>
                <p class='description trim-3-lines text-muted' data-gram_editor='false'>${description}</p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>
            <div class='card-footer'>
                <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#showTask' id=${id} onclick='openTask.apply(this,arguments)'>Open Task</button>
            </div>
        </div>
    </div>
`;

// Dynamic modals(cards) on our home page/ui
const htmlModalContent = ({ id, title, description, type, url }) => {
  const date = new Date(parseInt(id));
  return `
        <div id='${id}'>
            ${
              url
                ? `<img width='100%' src=${url} alt='card image here' class='img-fluid place__holder__image mb-3' />`
                : `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsKqnvyCNTs_5rX1NVeyIWsw6qmKCPpLI5yw&usqp=CAU" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            }
            <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
            <h2 class="my-3">${title}</h2>
            <p class="lead">${description}</p>
            <span class="badge bg-primary m-1">${type}</span>
        </div>
    `;
};

// here we will be updating our local storage (i.e., the modals/cards which we see on our ui)
const updateLocalStorage = () => {
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

// to get data or card or modals on ur ui from local storage (Browsers storage)
const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardDate) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
  });
};

// handle submit
const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("tags").value,
    description: document.getElementById("taskDescription").value,
  };
  if (input.title === "" || input.type === "" || input.description === "") {
    return alert("Please Fill All the Fields");
  }
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  // updated task list - for 1st go
  state.taskList.push({ ...input, id });

  // update the same on localStorage too
  updateLocalStorage();
};

// opens new modal on our ui when user clicks open task
const openTask = (e) => {
  // pop up the current one
  if (!e) e = window.event;

  // find the correct card opened
  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModel.innerHTML = htmlModalContent(getTask);
  // console.log(getTask);
};

// delete operation
const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.getAttribute("name");
  // console.log(targetID);

  const type = e.target.tagName;
  // console.log(type);

  const removeTask = state.taskList.filter(({ id }) => id !== targetID);
  // console.log(removeTask);

  state.taskList = removeTask;
  updateLocalStorage();

  if (type === "BUTTON") {
    // console.log(e.target.parentNode.parentNode.parentNode);
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  // console.log(e.target.parentNode.parentNode.parentNode.parentNode);
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

// edit operation
const editTask = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  // console.log(taskTitle);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

  // needs to be implemented
  submitButton.setAttribute("onclick", "saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

// Save Edit Operation
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updatedData.taskTitle,
          description: updatedData.taskDescription,
          type: updatedData.taskType,
          url: task.url,
        }
      : task
  );

  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

// Search Operation
const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};
