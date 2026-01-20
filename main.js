const STORAGE_KEY = "BOOKSHELF_APP_DATA";
let books = [];
let isEditing = false;
let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadDataFromStorage();

  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const checkboxIsComplete = document.getElementById("bookFormIsComplete");

  checkboxIsComplete.addEventListener("change", () => {
    const span = document.querySelector("#bookFormSubmit span");
    span.innerText = checkboxIsComplete.checked
      ? "Selesai dibaca"
      : "Belum selesai dibaca";
  });

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleBookSubmit();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    renderBooks(query);
  });

  renderBooks();
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    books = JSON.parse(serializedData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  renderBooks();
}

function handleBookSubmit() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (isEditing) {
    const bookIndex = books.findIndex((b) => b.id === editingId);
    if (bookIndex !== -1) {
      books[bookIndex] = {
        ...books[bookIndex],
        title,
        author,
        year,
        isComplete,
      };
    }
    resetForm();
  } else {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };
    books.push(newBook);
  }

  saveData();
  document.getElementById("bookForm").reset();

  document.querySelector("#bookFormSubmit span").innerText =
    "Belum selesai dibaca";
}

function renderBooks(filterQuery = "") {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(filterQuery),
  );

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeList.appendChild(bookElement);
    } else {
      incompleteList.appendChild(bookElement);
    }
  });

  if (incompleteList.innerHTML === "") {
    incompleteList.innerHTML =
      '<div class="empty-message">Belum ada buku yang tersimpan di rak ini.</div>';
  }
  if (completeList.innerHTML === "") {
    completeList.innerHTML =
      '<div class="empty-message">Belum ada buku yang tersimpan di rak ini.</div>';
  }
}

function createBookElement(book) {
  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.innerText = `Tahun: ${book.year}`;

  const actionDiv = document.createElement("div");
  actionDiv.className = "action-buttons";

  const toggleBtn = document.createElement("button");
  toggleBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleBtn.innerText = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  toggleBtn.addEventListener("click", () => toggleBookStatus(book.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.innerText = "Hapus Buku";
  deleteBtn.addEventListener("click", () => deleteBook(book.id));

  const editBtn = document.createElement("button");
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.innerText = "Edit Buku";
  editBtn.addEventListener("click", () => startEditBook(book));

  actionDiv.append(toggleBtn, deleteBtn, editBtn);
  container.append(title, author, year, actionDiv);

  return container;
}

function toggleBookStatus(id) {
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
  }
}

function deleteBook(id) {
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmDelete) {
    books = books.filter((b) => b.id !== id);
    saveData();
  }
}

function startEditBook(book) {
  isEditing = true;
  editingId = book.id;

  document.getElementById("formTitle").innerText = "Edit Buku";
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  const span = document.querySelector("#bookFormSubmit span");
  span.innerText = book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  isEditing = false;
  editingId = null;
  document.getElementById("formTitle").innerText = "Masukkan Buku Baru";
}
