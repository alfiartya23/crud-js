"use strict";
const btnAdd = document.querySelector("#btn-add");
const input = document.querySelector("#input");
const btnFilterAll = document.querySelector("#btn-all");
const btnFilterNotComplete = document.querySelector("#btn-active");
const btnFilterCompleted = document.querySelector("#btn-completed");
const toggleCheckAll = document.querySelector("#check-all");

// Ambil string dari localStorage lalu ubah menjadi object kembali
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let currentFilter = "all";

toggleCheckAll.addEventListener("change", function () {
  // todos.forEach((task) => (task.completed = true));
  const isChecked = toggleCheckAll.checked;

  // We can use forEach
  todos.forEach((task) => {
    task.completed = isChecked;
  });

  console.log(todos.every((todo) => todo.completed));

  // Save
  saveTodo();
  renderList();
});

// CREATE - Menambahkan Data
btnAdd.addEventListener("click", function (e) {
  e.preventDefault();

  const value = input.value.trim();

  // Validasi kosong
  if (!value) {
    Swal.fire({
      title: "Oops...",
      text: "Input tidak boleh kosong!",
      icon: "error",
    });
    return;
  }

  // initialize id and name todo
  const newTodo = {
    id: Date.now() + Math.random(),
    text: input.value,
    // Task for checkbox
    completed: false,
  };

  // todos.push(newTodo);
  // much safer but its only for complex case
  todos = [...todos, newTodo];

  // Save list
  saveTodo();

  //   Render ke list
  renderList();

  Swal.fire({
    title: "Berhasil!",
    text: "Aktivitas ditambahkan",
    icon: "success",
    timer: 1000,
    position: "top-end",
    showConfirmButton: false,
  });

  input.value = "";
  input.focus();

  console.log(newTodo);
});

// FILTER
const setFilter = (filterType) => {
  // Update the state
  currentFilter = filterType;

  // Removing active class
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.remove("active");
  });

  // Adding active class only button that was clicked
  document.getElementById(`btn-${filterType}`).classList.add("active");

  // Render filtered task
  renderList();
};

// SAVE TASK
const saveTodo = () => {
  // JSON.stringify changing array into string
  return localStorage.setItem("todos", JSON.stringify(todos));
};

//  DELETE TASK - Menghapus data berdasarkan ID
// Concept
// DELETE DATA = Filter data → Replace state → Save → Re-render
const deleteData = (id) => {
  Swal.fire({
    title: "Yakin mau hapus ini?",
    text: "Anda tidak bisa mengembalikan data kembali jika sudah terhapus",
    icon: "warning",
    showDenyButton: true,
    confirmButtonText: "Ya",
    denyButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // if ID is a falsy value, then stop. If exist then return and continue to the next line
      if (!id) return;

      // Here we create a new list of todos from Filter array
      // Simplenya mengecheck apakah todo.id tersebut beda?

      // Jangan mikir: "yang dihapus siapa?"
      // Tapi mikir: "yang gue simpan siapa?"

      todos = todos.filter((todo) => todo.id !== id);

      saveTodo();
      renderList();

      Swal.fire({
        text: "Data Sudah Terhapus!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  });
};

// READ - Menampilkan Data
function renderList() {
  const listTodo = document.getElementById("list");

  // Clear the current list
  listTodo.innerHTML = "";

  let filteredTask = [];

  if (currentFilter === "all") {
    // If all still checked, then show all array elements (filtered)
    filteredTask = todos;
  } else if (currentFilter === "completed") {
    // Only show the compleded
    filteredTask = todos.filter((todo) => todo.completed === true);
  } else if (currentFilter === "active") {
    // Only show the not completed
    filteredTask = todos.filter((todo) => todo.completed === false);
  }

  // Here we use forEach to render each task we just added
  filteredTask.forEach((todo) => {
    listTodo.innerHTML += /* html */ `
        <li class="todo-item ${todo.completed ? "completed-task" : ""}" >
            <div>
              <input 
                type="checkbox" 
                onChange="toggleTaskStatus(${todo.id})" 
                ${todo.completed ? "checked" : ""}
                class="checkbox"
              /> 
              <span class="todo-text">${todo.text}</span>    
            </div>
        <div class="todo-actions">
            <button class="btn-edit" onclick="editTodo(${todo.id})">Edit</button>
            <button class="btn-delete" onclick="deleteData(${todo.id})">Hapus</button>
        </div>
        </li>
    `;
  });

  // Sync toggle all to render
  toggleCheckAll.checked = todos.length > 0 && todos.every((task) => task.completed);
}

// Attach each button with those event
btnFilterAll.addEventListener("click", () => setFilter("all"));
btnFilterNotComplete.addEventListener("click", () => setFilter("active"));
btnFilterCompleted.addEventListener("click", () => setFilter("completed"));

const toggleTaskStatus = (id) => {
  // Find the id
  const task = todos.find((t) => t.id === id);

  if (task) {
    task.completed = !task.completed;
  }

  // Save the updated array
  saveTodo();

  // Re-render the UI so the checkmark and text styling update
  renderList();
};

// UPDATE - Mengubah data
// UPDATE = Find ID -> Changing Text -> Save and Re-render
const editTodo = (id) => {
  const todo = todos.find((t) => t.id === id);

  if (!todo) return;

  Swal.fire({
    title: "Edit Todo",
    input: "text",
    inputValue: todo.text,
    showCancelButton: true,
    confirmButtonText: "Simpan",
  }).then((result) => {
    if (!result.isConfirmed) return;

    const value = result.value?.trim();

    if (!value) return;

    todo.text = value;

    saveTodo();
    renderList();

    Swal.fire({
      text: "Data sudah diperbarui!",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  });
};

// langsung render list yang sudah dibuat
renderList();
