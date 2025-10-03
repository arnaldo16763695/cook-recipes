/**
 * @license MIT
 * @copyright 2025 ajedev
 * @author ajedev <arnaldoespinoza1@hotmail.com>
 */

"use strict";

import { fetchData } from "./api.js";
import { cardQueries, cardSkeleton } from "./global.js";
import { getTime } from "./module.js";

// Home page search

const /** {NodeElement} */ $searchField = document.querySelector(
    "[data-search-field]"
  );
const /** {NodeElement} */ $searchBtn =
    document.querySelector("[data-search-btn]");

$searchBtn.addEventListener("click", function () {
  if ($searchField.value)
    window.location = `/recipes.html?q=${$searchField.value}`;
});

// search submit when press enter key

$searchField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") $searchBtn.click();
});

// tab panel navigation

const /** NodeList */ $tabBtns = document.querySelectorAll("[data-tab-btn]");
const /** NodeList */ $tabPanels =
    document.querySelectorAll("[data-tab-panel]");

let /** nodeElement */ [$lastActiveTabPanel] = $tabPanels;
let /** nodeElement */ [$lastActiveTabBtn] = $tabBtns;

addEventOnElements($tabBtns, "click", function () {
  $lastActiveTabPanel.setAttribute("hidden", "");
  $lastActiveTabBtn.setAttribute("aria-selected", false);
  $lastActiveTabBtn.setAttribute("tabindex", -1);

  const /** {NodeElement} */ $currentTabPanel = document.querySelector(
      `#${this.getAttribute("aria-controls")}`
    );

  $currentTabPanel.removeAttribute("hidden");
  this.setAttribute("aria-selected", true);
  this.setAttribute("tabindex", 0);

  $lastActiveTabPanel = $currentTabPanel;
  $lastActiveTabBtn = this;
  addtabContent(this, $currentTabPanel);
});

/**
 * Navigate tab with arrow key
 */

addEventOnElements($tabBtns, "keydown", function (e) {
  const /** {NodeElement} */ $nextElement = this.nextElementSibling;
  const /** {NodeElement} */ $previousElement = this.previousElementSibling;

  if (e.key === "ArrowRight" && $nextElement) {
    this.setAttribute("tabindex", -1);
    $nextElement.setAttribute("tabindex", 0);
    $nextElement.focus();
  } else if (e.key === "ArrowLeft" && $previousElement) {
    this.setAttribute("tabindex", -1);
    $previousElement.setAttribute("tabindex", 0);
    $previousElement.focus();
  } else if (e.key === "Tab") {
    this.setAttribute("tabindex", -1);
    $lastActiveTabBtn.setAttribute("tabindex", 0);
  }
});

/**
 * Work with API
 * fetch data for tab content
 */

const addtabContent = ($currentTabBtn, $currentTabPanel) => {
  const /** {String} */ $gridList = document.createElement("div");
  $gridList.classList.add("grid-list");
  $currentTabPanel.innerHTML = `
<div class="grid-list">
 ${cardSkeleton.repeat(10)}
</div>
`;

  fetchData(
    [
      ["mealType", $currentTabBtn.textContent.trim().toLowerCase()],
      ...cardQueries,
    ],
    function (data) {
      // console.log(data);
      $currentTabPanel.innerHTML = "";

      for (let i = 0; i < 12; i++) {
        const {
          recipe: { uri, label: title, image, totalTime: cookTime },
        } = data.hits[i];

        const /** {String} */ $recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const /** {undefined || String} */ isSaved =
            window.localStorage.getItem(`cookio-recipe${$recipeId}`);

        const /** {NodeElemt} */ $card = document.createElement("div");
        $card.classList.add("card");
        $card.style.animationDelay = `${100 * i}ms`;
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
      }

      $currentTabPanel.appendChild($gridList);

      $currentTabPanel.innerHTML += `
  <a
                href="./recipes.html?mealType=${$currentTabBtn.textContent
                  .trim()
                  .toLowerCase()}"
                class="btn btn-secondary has-state label-large"
                >Show more</a
              >
  `;
    }
  );
};

addtabContent($lastActiveTabBtn, $lastActiveTabPanel);

/**
 * Fetch data for slider card
 */

const /** {Array} */ cuisineType = ["Asian", "French"];

const /** {NodeList} */ $sliderSections = document.querySelectorAll(
    "[data-slider-section]"
  );

for (const [index, $sliderSection] of $sliderSections.entries()) {
  $sliderSection.innerHTML = `
    <div class="container">
            <h2 class="section-title headline-small" id="slider-label-1">
              Latest ${cuisineType[index]} Recipes
            </h2>
             <div class="slider">
              <ul class="slider-wrapper" data-slider-wrapper>
                ${`<li class="slider-item">${cardSkeleton}</li>`.repeat(10)}
              </ul>
             </div>
    </div> 
    `;
  const /** {NodeElement} */ $liderWrapper = $sliderSection.querySelector(
      "[data-slider-wrapper]"
    );

  fetchData(
    [...cardQueries, ["cuisineType", cuisineType[index]]],
    function (data) {
      $liderWrapper.innerHTML = "";

      data.hits.map((item) => {
        const {
          recipe: { uri, label: title, image, totalTime: cookTime },
        } = item;
        const /** {String} */ $recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const /** {undefined || String} */ isSaved =
            window.localStorage.getItem(`cookio-recipe${$recipeId}`);

        const /** {NodeElement} */ $sliderItem = document.createElement("li");
       
        $sliderItem.classList.add("slider-item");
        $sliderItem.innerHTML = `
             <div class="card">
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
             </div>
      `;
      $liderWrapper.appendChild($sliderItem);
      });

      $liderWrapper.innerHTML += `
      <li class="slider-item" data-slider-item>
              <a href="./recipes.html?cuisineType=${cuisineType[index].toLowerCase()}" class="load-more-card has-state">
                <span class="label-large">Show more</span>
                <span class="material-symbols-outlined" aria-hidden="true">navigate_next</span>
              </a>
            </li>
      `;
    }
  );
}
