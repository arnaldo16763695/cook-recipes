/**
 * @license MIT
 * @copyright 2025 ajedev
 * @author ajedev <arnaldoespinoza1@hotmail.com>
 */

"use strict";

import { fetchData } from "./api.js";
import { cardSkeleton, cardQueries } from "./global.js";
import { getTime } from "./module.js";

/**
 * Accordion
 */

const /** {NodeList} */ $accordions =
    document.querySelectorAll("[data-accordion]");
 
/**
 * @param {NodeList} $element Accordion node
 */

const initAccordion = function ($element) {
  const /** {HTMLElement} */ $button = $element.querySelector(
      "[data-accordion-btn]"
    );
  let isExpanded = false;

  $button.addEventListener("click", function () {
    isExpanded = isExpanded ? false : true;
    this.setAttribute("aria-expanded", isExpanded);
  });
};

for (const $accordion of $accordions) initAccordion($accordion);

/**
 * Filter bar
 */
const /** {NodeList} */ $filterBar =
    document.querySelector("[data-filter-bar]");
const /** {NodeList} */ $filterTogglers = document.querySelectorAll(
    "[data-filter-toggler]"
  );
const /** {NodeList} */ $overlay = document.querySelector("[data-overlay]");

addEventOnElements($filterTogglers, "click", function () {
  $filterBar.classList.toggle("active");
  $overlay.classList.toggle("active");
  const bodyOverFlow = document.body.style.overflow;
  document.body.style.overflow =
    bodyOverFlow === "hidden" ? "visible" : "hidden";
});

/**
 * Filter submit and clear
 */
const /** {NodeList} */ $filterSubmit = document.querySelector(
    "[data-filter-submit]"
  );
const /** {NodeList} */ $filterClear = document.querySelector(
    "[data-filter-clear]"
  );
const /** {NodeList} */ $filterSearch = $filterBar.querySelector(
    "input[type='search']"
  );

$filterSubmit.addEventListener("click", function () {
  const $filterCheckBoxes = $filterBar.querySelectorAll("input:checked");
  const /**{Array<string>} */ queries = [];
  if ($filterSearch.value) {
    queries.push(["q", $filterSearch.value]);
  }
  if ($filterCheckBoxes.length) {
    for (const $checkBox of $filterCheckBoxes) {
      const /**{string} */ key =
          $checkBox.parentElement.parentElement.dataset.filter;
      queries.push([key, $checkBox.value]);
    }
  }
  //   console.log(queries.join("&").replace(/,/g, "="));
  window.location = queries.length
    ? `?${queries.join("&").replace(/,/g, "=")}`
    : "/recipes.html";
});

$filterSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $filterSubmit.click();
});

$filterClear.addEventListener("click", function () {
  const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");

  $filterCheckboxes?.forEach(($checkBox) => ($checkBox.checked = false));
  $filterSearch.value &&= "";
  window.location = "/recipes.html";
});
const /** {string} */ queryStr = window.location.search.slice(1);

const /** {Array<string>} */ queries =
    queryStr && queryStr.split("&").map((query) => query.split("="));
const /** {NodeList} */ $filterCount = document.querySelector(
    "[data-filter-count]"
  );

console.log(queries);
// filter count
if (queries.length) {
  $filterCount.style.display = "flex";
  $filterCount.innerHTML = queries.length;
} else {
  $filterCount.style.display = "none";
}

// console.log(queries);

queryStr &&
  queryStr.split("&").map((query) => {
    if (query.split("=")[0] === "q") {
      $filterBar.querySelector("input[type='search']").value = query
        .split("=")[1]
        .replace(/%20/g, " ");
    } else {
      $filterBar.querySelector(
        `[value='${query.split("=")[1].replace(/%20/g, " ")}']`
      ).checked = true;
    }
  });

const /** Node element */ $filterBtn =
    document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", (e) => {
  $filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
});

/**
 * Request recipes and render
 */

const /** Node element */ $gridList =
    document.querySelector("[data-grid-list]");
const /** Node element */ $loadMore =
    document.querySelector("[data-load-more]");
const /** Array<string> */ defaultQueries = [
    ["mealType", "breakfast"],
    ["mealType", "dinner"],
    ["mealType", "lunch"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...cardQueries,
  ];

$gridList.innerHTML = cardSkeleton.repeat(12);
let /** {string} */ nextPageUrl = "";
const renderRecipe = (data) => {
  data.hits.map((item, index) => {
    const {
      recipe: { image, label: title, totalTime: cookTime, uri },
    } = item;

    const /** {String} */ $recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const /** {undefined || String} */ isSaved =
        window.localStorage.getItem(`cookio-recipe${$recipeId}`);

    const /** {NodeElement} */ $card = document.createElement("div");
   
    $card.classList.add("card");
    $card.innerHTML = `
              <figure class="card-media img-holder">
                      <img
                        src="${image}"
                        width="195"
                        height="195"
                        loading="lazy"
                        alt="${title}"
                        class="img-cover"
                      />
                    </figure>
                    <div class="card-body">
                      <h3 class="title-small">
                        <a href="./detail.html?recipe=${$recipeId}" class="card-link"
                          >${title ?? "Untitled"}</a
                        >
                      </h3>
                      <div class="meta-wrapper">
                        <div class="meta-item">
                          <span
                            class="material-symbols-outlined"
                            aria-hidden="true"
                            >schedule</span
                          >
                          <span class="label-medium">${
                            getTime(cookTime).time || " <1 "
                          } ${getTime(cookTime).timeunit}</span>
                        </div>
                        <button
                          class="icon-btn has-state ${
                            isSaved ? "saved" : "removed"
                          }"
                          aria-label="Add to saved recipe" onclick="savedRecipe(this, '${$recipeId}')"
                        >
                          <span
                            class="material-symbols-outlined bookmark-add"
                            aria-hidden="true"
                            >bookmark_add</span
                          >
                          <span
                            class="material-symbols-outlined bookmark"
                            aria-hidden="true"
                            >bookmark</span
                          >
                        </button>
                      </div>
                    </div>
  `;
  $gridList.appendChild($card);
  });
};

let /** Boolean */ requestedBefore = true;

fetchData(queries || defaultQueries, (data) => {
  // console.log(data);
  const {
    _links: { next },
  } = data;
  nextPageUrl = next?.href;

  $gridList.innerHTML = "";
  requestedBefore = false;

  if (data.hits.length) {
    renderRecipe(data);
  } else {
    $loadMore.innerHTML = ` <p class="body-medium info-text">
                        No recipe found.
                    </p>`;
  }
});
