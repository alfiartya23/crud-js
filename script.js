"use strict";
const btnAdd = document.querySelector("#btn-add");
const input = document.querySelector("#input");

// Ambil string dari localStorage lalu ubah menjadi object kembali
let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveTodo = () => {
  // JSON.stringify changing array into string
  return localStorage.setItem("todos", JSON.stringify(todos));
};

//  DELETE - Menghapus data berdasarkan ID
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
  listTodo.innerHTML = "";

  // Here we use forEach to render each TODO we just added
  todos.forEach((todo) => {
    listTodo.innerHTML += `
        <li class="todo-item">
            <span class="todo-text">${todo.text}</span>

            <div className="todo-actions">
              <button class="btn-edit" onclick="editTodo(${todo.id})">Edit</button>
              <button class="btn-delete" onclick="deleteData(${todo.id})">Hapus</button>
            </div>
        </li>
    `;
  });
}

// EDIT - Mengubah data
// UPDATE = Find ID -> Changing Text -> Save and Re-render
const editTodo = (id) => {
  const todo = todos.find((t) => t.id === id);

  // Prompt new text
  const updatedText = prompt("Edit:", todo.text);

  if (updatedText) {
    todo.text = updatedText;
  }

  Swal.fire({
    text: "Data sudah diperbarui!",
    icon: "success",
    timer: 1000,
    showConfirmButton: false,
  });
  saveTodo();
  renderList();
};

// CREATE - Menambahkan Data
btnAdd.addEventListener("click", function (e) {
  e.preventDefault();

  const value = input.value.trim();

  // Validasi kosoong
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
// langsung render list yang sudah dibuat
renderList();
