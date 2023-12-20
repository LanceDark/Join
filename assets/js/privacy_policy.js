/**
 * Initializes the application.
 * @description This function includes HTML content from external files to elements with the "w3-include-html" attribute.
 */
function init() {
    includeHTML();
  }

  /**
 * Includes HTML content from external files to elements with the "w3-include-html" attribute.
 * @description This function asynchronously loads HTML content from external files and includes it in elements with the "w3-include-html" attribute.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html"
      let resp = await fetch(file);
      if (resp.ok) {
        element.innerHTML = await resp.text();
      } else {
        element.innerHTML = "Page not found";
      }
    }
  }


  /**
 * Adds an event listener to the "backButton" element that navigates to the previous page in the browser history.
 * @description This function is triggered when the DOM content is fully loaded.
 */
  document.addEventListener("DOMContentLoaded", function() {
    const backButton = document.getElementById("backButton");
  
    backButton.addEventListener("click", function() {
      
      window.history.back();
    });
  });


/** go to legal_notice.html */
  function redirectToLegalNotice() {
    window.location.href = "./legal_notice.html";
}