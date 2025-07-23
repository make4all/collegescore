/**Structure
 * Global Variables and Data (questions and answers)
 * Render and DOM functions (renderQs and update progress)
 * Logic/flow control (what questions to show and moving to next)
 * Event Handling
 * Posts
 */


//TODO: make functions for repeat html
//Survey Questions
//phase1: only general and accessability questions will be populated 
let collegeName;
const questions = [
    //Identity Block
    {   type: "yesno", 
        id:"lgbt_id", 
        text: "Do you identify as LGBTQIA2+ ",
        category: "identity"},
    {   type: "yesno", 
        id: "poc_id", 
        text:"Do you identify as a person of color (POC)",
        category: "identity"},
    {   type: "yesno", 
        id: "disability_id", 
        text: "Do you identify as having a disability (visual, auditory, motor, or cognitive)",
        category:"identity"},
    {   type: "yesno", 
        id: "optin", 
        text: "Would you like your identity to be attached to your response for filtering purposes (e.g., \"POC responses\")?",
        category: "identity"},
    {   type: "written", 
        id: "share_id", 
        text: "If you would like to have your identities included in your review, please list them below",
        category:"identity"},
    //LGBT Block
    {   type: "rating", 
        id: "lgbt_safety", 
        text: ""
            + "",
        category:"lgbt"},
    {   type: "yesno", 
        id: "lgbt_harm", 
        text: "",
        category:"lgbt"},
    {   type: "rating", 
        id: "lgbt_inclusion", 
        text: ""
            + "",
        category:""},
    {   type: "rating", 
        id: "lgbt_bias", 
        text: ""
            + "" ,
        category:""},
    {   type: "rating", 
        id: "lgbt_peer", 
        text: ""
            + "" ,
        category:""},
    {   type: "rating", 
        id: "lgbt_inst", 
        text: ""
            + "" ,
        category:""},
    //POC block
    {   type: "rating", 
        id: "poc_safety", 
        text: ""
            + "" ,
        category:""},
    {   type: "yesno", 
        id: "poc_harm", 
        text: "",
    category:""},
    {   type: "rating", 
        id: "poc_inclusion", 
        text: ""
            + "" ,
        category:""},
    {   type: "rating", 
        id: "poc_bias", 
        text: "",
    category:""},
    {   type: "rating", 
        id: "poc_peer", 
        text: ""
            + "" ,
        category:""},
    {   type: "rating", 
        id: "poc_inst", 
       text: ""
            + "" ,
        category:""},
    //Disability block
    {   type: "rating", 
        id: "disability_safety", 
        text: "On a scale of 1-5 how safe do you feel on campus and the surrounding area as a person with a disability?"
            + "\n1 being not safe at all, 5 being incredibly safe." ,
        category:"disability"},
    {   type: "yesno", 
        id: "disability_harm", 
        text: "Have you experienced harassment or assault as a result of your disability identity?",
        category:"disability"},
    {   type: "rating", 
        id: "disability_inclusion", 
        text: "On a scale of 1-5 how inclusive to disability identities is your school (peers and staff)?"
            + "\n1 being not at all, 5 being very inclusive." ,
        category:"disability"},
    {   type: "rating", 
        id: "disability_bias", 
        text: "On a scale of 1-5 how rarely do you hear ableist/derogatory language from students and staff?"
            + "\n1 being frequent, 5 being never." ,
        category:"disability"},
    {   type: "rating", 
        id: "disability_access", 
        text: "On a scale of 1-5 how accessible is your campus?"
            + "\n1 being not accessible, 5 being highly accessible." ,
        category:"disability"},
    {   type: "rating", 
        id: "disability_peer", 
        text: "On a scale of 1–5, how easy is it for students to find and participate in disability communities and spaces on or near campus?"
            + "\n1 being not accessible at all, 5 being very accessible and welcoming." ,
        category:"disability"},
    {   type: "rating", 
        id: "disability_inst", 
        text: "On a scale of 1-5 how reliable are your accommodations? Are your accommodation needs being met? "
            + "\n1 being very unreliable/not actually provided to you, 5 being very reliable in practice." ,
        category:"disability"},
    {   type: "written", 
        id: "disability_accom", 
        text: "If you are comfortable with having this information included in your public response please share what accommodations you use and what your experience getting those accommodations met has been.",
        category:"disability"},
    //General Block
    {   type: "written", 
        id: "written_rev", 
        text: "If you would like to, please share a short review of your experience in your college.",
        category:"general"},
    {   type: "written", 
        id: "written_expereience", 
        text: "Did you feel welcome and supported? Please share how your identity has shaped your experience at this school.",
        category:"general"},
    {   type: "written", 
        id: "written_challenges", 
        text: "Have you faced or witnessed any challenges related to your identity, particularly as part of one or more underrepresented groups?",
        category:"general"},
    {   type: "written", 
        id: "written_recs", 
        text: "Were there any community groups or classes you would like to share with prospective students? Please list them.",
        category:"general"},
];

function showQuestion(q/*, responses*/) {
  // Always show general and screening questions
  if (/*!q.category ||*/ q.category === "general" || q.category === "identity") return true;

  // Show LGBTQIA2+ questions only if they identified as such
  //if (q.category === "lgbt" && responses.lgbt_id === "yes") return true;

  // Show POC questions only if they identified as such
  //if (q.category === "poc" && responses.poc_id === "yes") return true;

  // Show disability questions only if they identified as such
  if (q.category === "disability" /*&& responses.disability_id === "yes"*/) return true;
  
  // Otherwise, don't show
  return false;
}


//DOM
function writtenRespQ(id, questionText){
    const container = document.createElement("div");
    container.className = "text-question";
    container.innerHTML = `
        <label for="${id}">${questionText}</label>
        <textarea id="${id}" name="${id}" rows="6" cols="33"></textarea>
    `;
    return container;
}

//todo: consider changing so input is inside the label 
//todo:update if should be fieldset
function ratingRespQ(id, questionText){
    const container = document.createElement("fieldset");
    container.className = "star-rating";
    container.innerHTML = `
        <legend>${questionText}</legend>
        <div>
          <input type="radio" name="${id}" value="1" id="${id}1" aria-label="1 star"/>
          <label for="${id}1">★</label>
          <input type="radio" name="${id}" value="2" id="${id}2" aria-label="2 stars"/>
          <label for="${id}2">★</label>
          <input type="radio" name="${id}" value="3" id="${id}3" aria-label="3 stars"/>
          <label for="${id}3">★</label>
          <input type="radio" name="${id}" value="4" id="${id}4" aria-label="4 stars"/>
          <label for="${id}4">★</label>
          <input type="radio" name="${id}" value="5" id="${id}5" aria-label="5 stars"/>
          <label for="${id}5">★</label>
        </div>
    `;
    return container;
}

function ynRespQ(id, questionText){
    const container = document.createElement("fieldset");
    container.className = "yesno-question"
    container.innerHTML = `
        <legend id="${id}">${questionText}</legend>
        <label><input type="radio" name="${id}" value="yes" required> Yes</label>
        <label><input type="radio" name="${id}" value="no" required> No</label>
    ` ;  
    return container;
}


//if disablity_id = "yes" (answers[2]="yes") then show the questions

function renderQuestion(q){
    if (q.type === "written") return writtenRespQ(q.id, q.text);
    if (q.type === "yesno") return ynRespQ(q.id, q.text);
    if (q.type === "rating") return ratingRespQ(q.id, q.text);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    collegeName = urlParams.get("name");

    document.getElementById("college-header").textContent = `${collegeName} Review` 

    const surveyContainer = document.getElementById("survey-container");
    const submitBtn = document.getElementById("submitBtn");

    
    document.getElementById("backBtn").addEventListener("click", function(){
      window.close();
    });
    
    //Render visable questions
    const visibleQuestions = questions.filter(q => showQuestion(q));
    visibleQuestions.forEach(q => {
    const elemQ = renderQuestion(q);
    //Question wrapper for styling
    const question = document.createElement("div");
    question.className = "question";
    question.appendChild(elemQ);
    //Insert question before submit button
    surveyContainer.insertBefore(question,submitBtn); 
    });

    //other event listeners

});
