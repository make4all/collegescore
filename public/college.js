/*
 * College Inclusiveness Search Team
 * February 2025
 */

"use strict";

(async function() {
  window.addEventListener("load", () => {
      getCollegeData().then(() => init());
    }
  );

  let collegeName;
  let collegeData;
  let ratingAvgs;
  let reviews;

  /**
   * Sets up event listeners for the buttons.
   */
  function init() {
    // todo: initialize event listeners
    id("rate-btn").addEventListener("click", openRatingForm);

    const urlParams = new URLSearchParams(window.location.search);
    collegeName = urlParams.get("name");
    qs("#college-name a").textContent = collegeName;

    /**
    let fakeData ={
      name: "University of Atlantis",
      drsLink: "#",
      inclusivity: "4.2",
      accessibility: "4.5",
      lgbqt: 4.5,
      accomodation: 3.0,
      outdoor: 4.0,
      indoor: 4.1,
      building: 4.4,
      gender: 3.5,
      cultural: 4.1,
      religious: 2.0,
      review: "I feel really safe here as a trans woman. The students and staff here are respectful about that. DRS was very timely in making sure I had all my accommodations ready to go before classes started."
    };*/
    updateCollegeInfo(ratingAvgs);
    populateAccomodations();
    populateReviews();
  }

  function populateAccomodations() {
    let accoms = JSON.parse(collegeData["accommodations"]);
    id("accoms").innerHTML = "";
    for (let i = 0; i < accoms.length; i++) {
      let accom = gen("li");
      accom.textContent = accoms[i];
      id("accoms").appendChild(accom);
    }
  }

  // returns style such that BG color is
  // poor (red): [1 - 2.9]
  // okay (yellow): [3 - 3.9]
  // good (green): [4.0 - 5.0]
  function getColor(num) {
    if (num < 3) {
      return "poor";
    } else if (num < 4) {
      return "okay";
    } else {
      return "good";
    }
  }

  // generates bar such that 1-5 -> 20% to 100% of bar filled
  function barStyle(num) {
    let numToNum = {
      1 : "one",
      2 : "two",
      3 : "three",
      4 : "four",
      5 : "five",
    }
    return numToNum[num] ? numToNum[num] : "";
  }

  function populateReviews() {
    id("n-ratings").textContent = reviews.length;
    for (let i = 0; i < reviews.length; i++) {
      console.log("populating review");
      let rev = reviews[i];
      let box = gen("div");
      box.classList.add("rating-box");
      box.innerHTML =
`
<div class="rating-header" aria-label="student review:">
    <div class="Overall-section">
      <h4>Overall Accessibility</h4>
      <span id="bubble" tabindex="0" class="rating-score ${getColor(rev.overallAccess_rating)}">${rev.overallAccess_rating}</span>
      <h4>Overall Identity</h4>
      <span class="rating-score ${getColor(rev.overallIdentity_rating)}">${rev.overallIdentity_rating}</span>
    </div>
    <div class="review-text">
      <h4 >General Review</h4>
      <p  >${rev.general_review ? rev.general_review : "<em>No review provided.</em>"}</p>
      <h4  >Identity-focused Review</h4>
      <p  >${rev.identity_review ? rev.identity_review : "<em>No review provided.</em>"}</p>
    </div>
  </div>
  <div class="rating-category">
    <p  >LGBTQ+ Friendliness: ${rev.lgbtq_safety} out of 5</p>
    <div class="rating-bar ${barStyle(rev.lgbtq_safety)}"></div>
  </div>
  <div class="rating-category">
    <p  >Liberal Climate: ${rev.liberal_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.liberal_rating)}"></div>
  </div>
  <div class="rating-category">
    <p >Accommodation Friendliness: ${rev.accommodation_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.accommodation_rating)}"></div>
  </div>
  <div class="rating-category">
    <p >Accommodation Difficulty: ${rev.accommodations_difficulty} out of 5</p>
    <div class="rating-bar ${barStyle(rev.accommodations_difficulty)}"></div>
  </div>
  <div class="rating-category">
    <p  >Accommodation Reliability: ${rev.reliability_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.reliability_rating)}"></div>
  </div>
  <div class="rating-category">
    <p  >Peer Support: ${rev.supportive_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.supportive_rating)}"></div>
  </div>
  <div class="rating-category">
    <p  >Indoor Campus Accessibility: ${rev.inside_accessibility} out of 5</p>
    <div class="rating-bar ${barStyle(rev.inside_accessibility)}"></div>
  </div>
  <div class="rating-category">
    <p  >Outdoor Campus Accessibility: ${rev.outside_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.outside_rating)}"></div>
  </div>
  <div class="rating-category">
    <p >Cultural & Racial Diversity: ${rev.diversity_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.diversity_rating)}"></div>
  </div>
  <div class="rating-category">
    <p >Religious Tolerance: ${rev.tolerance_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.tolerance_rating)}"></div>
  </div>
  <div class="rating-category">
    <p >Club Inclusivity: ${rev.clubs_rating} out of 5</p>
    <div class="rating-bar ${barStyle(rev.clubs_rating)}"></div>
  </div>
</div>
`;
      id("reviews-right").appendChild(box);
    }
  }

  function openRatingForm() {
    window.open(`/surveyN.html?name=${encodeURIComponent(collegeName)}`, "_blank");//new window open
  }

  // round to exactly 1 decimal place
  // if 0 return "N/A"
  function round(num) {
    num = (Math.round(num * 100) / 100).toFixed(1);
    return num == 0 ? "N/A" : num;
  }
  
  //round percentages to a whole number
  function roundPerc(num) {
    num = (Math.round(num * 100) / 100).toFixed(0);
    return num == 0 ? "N/A" : num;
  }

  /**
   * Gets college data
   */
  async function getCollegeData() {
    const urlParams = new URLSearchParams(window.location.search);
    collegeName = urlParams.get("name");

    collegeData = await getRequest("/colleges/" + collegeName, res => res.json());
    ratingAvgs = await getRequest("/rating-avgs/" + collegeName, res => res.json());
    for (const [key, value] of Object.entries(ratingAvgs)) {
      ratingAvgs[key] = round(ratingAvgs[key]);
    }
    reviews = await getRequest("/all-reviews/" + collegeName, res => res.json());

    // replace null with "N/A" in individual ratings
    for (let i = 0; i < reviews.length; i++) {
      let review = reviews[i];
      for (const [key, value] of Object.entries(review)) {
        review[key] = review[key] ? review[key] : "N/A";
      }
    }

    // debug
    console.log(collegeData);
    console.log(ratingAvgs);
    console.log(reviews);
  }

  async function updateCollegeInfo(data) {
  let percentData = await getRequest("/stats/" + collegeName, res => res.json());

  // debug
  console.log("percentData");
  console.log(percentData);

  id("lgbtq_id").textContent = roundPerc(percentData["friendly_score"]);
  id("exclusionary").textContent = roundPerc(percentData["exclusionary_score"]);
  id("friendly").textContent = roundPerc(percentData["lgbtq_score"]);
  id("mobility").textContent = roundPerc(percentData["mobility_score"]);

  id("college-name").innerHTML = `<a href ="${data.drsLink}" target="_blank">${collegeName}</a>`;
  // id("review-text").textContent = data.review;
  // id("college-info").classList.remove("hidden");

  let overallInclusivity = qs("#overall-inclusivity .overall-display");
  overallInclusivity.textContent = data["overallIdentity_avg"];
  overallInclusivity.classList.remove("poor", "okay", "good");
  overallInclusivity.classList.add(getColor(data["overallIdentity_avg"]));


  let overallAccessibility = qs("#overall-accessibility .overall-display");
  overallAccessibility.textContent = data["overallAccess_avg"];
  overallAccessibility.classList.remove("poor", "okay", "good");
  overallAccessibility.classList.add(getColor(data["overallAccess_avg"]));
 
 
  let lgbtqRating = qs("#lgbtq-rating .rating-display");
  lgbtqRating.textContent = data["lgbtq_avg"];
  lgbtqRating.classList.remove("poor", "okay", "good");
  lgbtqRating.classList.add(getColor(data["lgbtq_avg"]));


  let accommodationRating = qs("#accommodation-rating .rating-display");
  accommodationRating.textContent = data["rating_avg"];
  accommodationRating.classList.remove("poor", "okay", "good");
  accommodationRating.classList.add(getColor(data["rating_avg"]));


  let outdoorRating = qs("#outdoor-accessibility .rating-display");
  outdoorRating.textContent = data["outside_avg"];
  outdoorRating.classList.remove("poor", "okay", "good");
  outdoorRating.classList.add(getColor(data["outside_avg"]));


  let indoorRating = qs("#indoor-accessibility .rating-display");
  indoorRating.textContent = data["inside_avg"];
  indoorRating.classList.remove("poor", "okay", "good");
  indoorRating.classList.add(getColor(data["inside_avg"]));


  let supportRating = qs("#peer-support .rating-display");
  supportRating.textContent = data["supportive_avg"]
  supportRating.classList.remove("poor", "okay", "good");
  supportRating.classList.add(getColor(data["supportive_avg"]));


  let liberalRating = qs("#liberal .rating-display");
  liberalRating.textContent = data["liberal_avg"];
  liberalRating.classList.remove("poor", "okay", "good");
  liberalRating.classList.add(getColor(data["liberal_avg"]));


  let culturalRating = qs("#cultural-diversity .rating-display");
  culturalRating.textContent = data["diversity_avg"];
  culturalRating.classList.remove("poor", "okay", "good");
  culturalRating.classList.add(getColor(data["diversity_avg"]));


  let religiousRating = qs("#religious-tolerance .rating-display");
  religiousRating.textContent = data["tolerance_avg"];
  religiousRating.classList.remove("poor", "okay", "good");
  religiousRating.classList.add(getColor(data["tolerance_avg"]));
  console.log(data);

  
  // inclusiveness of clubs
  let clubsRating = qs("#club-inclusiveness .rating-display");
  clubsRating.textContent = data["clubs_avg"];
  clubsRating.classList.remove("poor", "okay", "good");
  clubsRating.classList.add(getColor(data["clubs_avg"]));

  // khai & danielle: added 3 new averages;
  /* difficulty of getting accomodations*/
  let difficultyRating = qs("#difficulty-rating .rating-display");
  difficultyRating.textContent = data["difficulty_avg"];
  difficultyRating.classList.remove("poor", "okay", "good");
  difficultyRating.classList.add(getColor(data["difficulty_avg"]));
  // reliability of accomodations
  let relibilityRating = qs("#reliability-rating .rating-display");
  relibilityRating.textContent = data["reliability_avg"];
  relibilityRating.classList.remove("poor", "okay", "good");
  relibilityRating.classList.add(getColor(data["reliability_avg"]));
  
}


  /* --- HELPER FUNCTIONS --- */

  /**
   * Shows the view and hides all other views
   * @param {string} view - the view to show
   */
  function toggleView(view) {
    for (let i = 0; i < ALL_VIEWS.length; i++) {
      id(ALL_VIEWS[i]).classList.add("hidden");
    }
    id(view).classList.remove("hidden");
  }

  /**
   * returns result of GET request with extractFunc being
   * either res => res.json() or res => res.text()
   * @param {string} url - URL to fetch
   * @param {function} extractFunc - res => res.json() or res => res.text()
   * @returns {object | string | undefined} - res.json(), res.text(), or undefined
   */
  async function getRequest(url, extractFunc) {
    try {
      let res = await fetch(url);
      await statusCheck(res);
      res = await extractFunc(res);
      return res;
    } catch (err) {
      handleError();
    }
  }

  /**
   * returns result of POST request with extractFunc being
   * either res => res.json() or res => res.text()
   * @param {string} url - URL to fetch
   * @param {object} body - body of POST request
   * @param {function} extractFunc - res => res.json() or res => res.text()
   * @returns {object | string | undefined} - res.json(), res.text(), or undefined
   */
  async function postRequest(url, body, extractFunc) {
    try {
      let res = await fetch(url, {
        method: "POST",
        body: body
      });
      await statusCheck(res);
      res = await extractFunc(res);
      return res;
    } catch (err) {
      handleError();
    }
  }

  /**
   * Handles errors gracefully
   */
  function handleError() {

  }

  /**
   * If res does not have an ok HTML response code, throws an error.
   * Returns the argument res.
   * @param {object} res - HTML result
   * @returns {object} -  same res passed in
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns all element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object[]} - DOM object associated selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new HTML element matching the tag.
   * @param {string} tagName - HTML tag name.
   * @returns {object} - new HTML element matching the tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();