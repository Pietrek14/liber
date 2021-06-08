import { serverAddress } from "../scripts/constants.js";
import { alert } from "../scripts/alert.js";

const title = document.getElementById("title");
const author = document.getElementById("author");
const description = document.getElementById("description");
const cover = document.getElementById("cover");
const rating = document.getElementById("rating");

const starsDiv = document.getElementById("stars");
const stars = Array.from(starsDiv.children);

const borrowButton = document.getElementById("borrow-button");
const readButton = document.getElementById("read-button");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const book = urlParams.get("book");

let checkIfClicked = false;
let rate = 0;

// 60a6dedec11b102ca8443d03 - Autostopem przez Galaktykę
// 60b2659f6e73e6cd63049bcd - Pan Tadeusz

// Trzeba robić w funkcji asynchronicznej, żeby można używać awaitów

const init = async () => {
  // Sprawdzamy czy użytkownik jest zalogowany

  const res = await fetch(`${serverAddress}/getname`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    window.location = "../login/";
  }

  // Pobieramy informacje o książce

  const bookInfoRequest = await fetch(`${serverAddress}/getbookinfo/${book}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const bookInfo = await bookInfoRequest.json();

  // Jeśli jest jakiś błąd (prawdopodobnie w linku zostało podany niepoprawne id książki), wróć na stronę główną

  if (bookInfoRequest.status !== 200) {
    window.location = "../index.html";
    return;
  }

  // Ustaw pola na odpowiednie wartości

  title.textContent = bookInfo.title;
  author.textContent = bookInfo.author;
  description.textContent = bookInfo.description;
  rating.textContent = bookInfo.rating.toLocaleString("en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });
  cover.setAttribute("src", bookInfo.coverUrl);
  cover.setAttribute("alt", `Okładka książki "${bookInfo.title}"`);

  // Jeśli książka jest dostępna do czytania online, to też ustaw

  if (bookInfo.content !== null) {
    readButton.onclick = () => {
      window.open(bookInfo.content);
    };
  } else {
    readButton.classList.add("d-none");
  }

  //   Ocena książki

  for (let i = 0; i < stars.length; i++) {
    stars[i].onclick = async () => {
      checkIfClicked = true;
      for (let j = 0; j < 5; j++) {
        if (j <= i) {
          stars[j].classList.add("checked");
        } else {
          stars[j].className = "fa fa-star";
        }
      }
      rating.textContent = `${i + 1}.0`;
      rate = i + 1;
      console.log(rate);
    };
    stars[i].onmouseover = async () => {
      if (!checkIfClicked) {
        for (let j = 0; j < 5; j++) {
          if (j <= i) {
            stars[j].classList.add("checked");
          } else {
            stars[j].className = "fa fa-star";
          }
        }
        rating.textContent = `${i + 1}.0`;
      }
      starsDiv.onmouseleave = async () => {
        if (!checkIfClicked) {
          for (let j = 0; j < 5; j++) {
            stars[j].className = "fa fa-star";
          }
          rating.textContent = `0.0`;
        }
      };
    };
  }

  borrowButton.onclick = async () => {
    // Tutaj dodać wypożyczanie książki
  };
};

init();

// Menu boczne

import setUpSideBar from "../scripts/sideBar.js";

setUpSideBar();
