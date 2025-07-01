/*
 * College Inclusiveness Search Team
 * February 2025
 */

"use strict";

//Resources used:
  //Structure for multi tab form: https://www.w3schools.com/howto/howto_js_form_steps.asp?
  //Debugging help: ChatGPT
  //accessible star rating: https://dev.to/grahamthedev/5-star-rating-system-actually-accessible-no-js-no-wai-aria-3idl
  let collegeName
  var currentTab = 0; // Current tab is set to be the first tab (0)
    


(function() {
  
  window.addEventListener("load", init);
  

  /**
   * Sets up event listeners for the buttons.
   */
  function init() {
    const urlParams = new URLSearchParams(window.location.search);
    collegeName = urlParams.get("name");

    id("college-header").textContent = `${collegeName} Review` 

    
    id("backBtn").addEventListener("click", function(){
      window.location.href = `/college.html?name=${encodeURIComponent(collegeName)}`;
    });

    //Prevent using enter on elemnts other than buttons from form default event
    id("survey").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
          const activeElement = document.activeElement;
  
          if (activeElement.tagName === "BUTTON") {
            return; 
        }

        // Allow Enter on interactive buttons
        if (activeElement.type === "checkbox" || activeElement.type === "radio") {
            event.preventDefault();
            activeElement.click(); 
            return;
        }

        event.preventDefault();
      }
  });

    
    id("nextBtn").addEventListener("click", function() {
      nextPrev(1);
    });
  

    id("prevBtn").addEventListener("click", function() {
        nextPrev(-1);
    }); 

    
    id("survey").addEventListener("submit", function(event){
      event.preventDefault();
      submitSurvey();
    });

    showTab(currentTab); // Display the current tab
    
    stars(); //functionality for stars
    
  }

  /**Show specified subset/tab of the survey
   * Based on: https://www.w3schools.com/howto/howto_js_form_steps.asp?
   * @param {int} n, the specific subset/section of the form to be displayed
   */
  function showTab(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";

    if (n == 0) {
      id("backBtn").style.display= "inline"; //only visable on the first tab
      id("prevBtn").style.display = "none";
    } else {
      id("prevBtn").style.display = "inline";
      id("backBtn").style.display= "none";
    }
    if (n == (x.length - 1)) {
      id("backBtn").style.display= "none";
      id("nextBtn").style.display = "none";
      id("submitBtn").style.display = "inline"; //make submit visable only on the last tab
    } else {
      id("nextBtn").style.display = "inline";
      id("submitBtn").style.display = "none";
    }
    //display the correct step indicator
    fixStepIndicator(n)
  }
  
  /**Show correct tab when next or prev buttons are used for navigating form.
  * @param {int} n, -1 for prev, 1 for next
  */
  function nextPrev(n) {
    
    var x = document.getElementsByClassName("tab");
   
    // Hide the current tab:
    x[currentTab].style.display = "none";
    currentTab = currentTab + n; 
    if (currentTab >= x.length) { //end of form
      //...the form gets submitted:
      id("survey").submit();
      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
    topFunction();
  }

  /**Navigates to the top of the document page */
  function topFunction(){
    document.body.scrollTop = 0; //for safari
    document.documentElement.scrollTop= 0; //for chrome, firefox, IE, and Opera
  }
  
  /**This function removes the "active" class of all steps
   * @param {int} n representing the current tab
   */
  function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
  }

  /**POST form data to database and close survey*/
  function submitSurvey(){
    let formData = new FormData(id("survey")); 
    let jsonData = {};
    jsonData["college_name"] = collegeName;

    formData.forEach((value, key) => {
      if (value.trim() === "") {
          jsonData[key] = null;  // handle unasnwered fields
      } else if (!isNaN(value)) {
          jsonData[key] = parseInt(value, 10); //convert star ratings to integers
      } else {
          jsonData[key] = value;
      }
    });
    
    postRequest(`/submit-survey/${encodeURIComponent(collegeName)}`, JSON.stringify(jsonData), res => res.text());
    window.open(`/college.html?name=${encodeURIComponent(collegeName)}`); 
  }

  

  /**Functionality for star ratings */
  function stars(){

    const starRatings = document.querySelectorAll(".star-rating");

    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll("label");
        const values = rating.querySelectorAll("input");

        stars.forEach(star => {
            star.addEventListener("mouseover", () => highlightStars(star));
            star.addEventListener("mouseout", resetStars);
            star.addEventListener("click", () => selectStars(star));
        });

        values.forEach(input => {
          // Add event listener for focus
          input.addEventListener("focus", () => highlightFocus(input));
          input.addEventListener("blur", resetStars); // Reset highlighting when focus is lost
        });

        /**Highlight up to and including a given star
         * @param star to be highlighted
         */
        function highlightStars(star) {
            let value = star.previousElementSibling.value;
            resetStars(); // Clear previous highlights
            for (let i = 0; i < value; i++) {
                stars[i].style.color = "rgb(219, 164, 0)";
            }
        }

        /*Unselect and unhighlight star*/
        function resetStars() {
            stars.forEach(star => {
                star.style.color = "#ccc"; // Reset to default
            });
            const checkedStar = rating.querySelector("input:checked");
            if (checkedStar) {
                selectStars(checkedStar.nextElementSibling);
            }
        }

        /**Select a certain star to generate a 1-5 rating
         * @param star to highlight to (inclusive)
         */
        function selectStars(star) {
            let value = star.previousElementSibling.value;
            for (let i = 0; i < value; i++) {
                stars[i].style.color = "rgb(219, 164, 0)";
            }
        }
    });
    
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
        headers: {"Content-Type": "application/json"},
        body: body
      });
      await statusCheck(res);
      res = await extractFunc(res);
      console.log("Post response: ", res);
      return res;
    } catch (err) {
      console.error("Post error:" ,err);
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