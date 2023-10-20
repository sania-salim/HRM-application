import { db, getDocs, getDoc, collection, addDoc, query, where, doc, setDoc, limit, updateDoc, deleteDoc, orderBy, startAt } from "./firestore.js";

// COMMON QUERYSELECTORS
const tableBody = document.querySelector(".table-body");

const filterStatus = document.querySelector(".filter-button");
const filterOptions = document.querySelector(".filter-options");

// toast
const toastBox = document.querySelector(".toastOverlay")
const toastText = document.querySelector(".toast")


// listener for create button click
const createButton = document.querySelector(".create-employee-button");
const addEmployeeModal = document.querySelector(".add-modal-overlay");
const addModalClose = document.querySelector(".close-add-modal");
const cancelAdd = document.querySelector(".cancel-create");


// event listeners for skill list in add modal
const skillInput = document.querySelector(".skills-input");
const skillsDropDown = document.querySelector(".skills-drop-down");



let currentLastId;

//  FILTER, SORT, SEARCH STATUS

// Sort
let sortFlag = 0;  //current sort is none

const sortButton = document.querySelector(".sort-button");
sortButton.addEventListener("click", sortFunction)

function sortFunction(callback) {

  if (sortFlag === 0) {
    sortOrder = orderBy("employeeId", "desc");
    sortFlag = 1;
  } else if (sortFlag === 1) {
    sortOrder = orderBy("employeeId");
    sortFlag = 0;
  }

  if (filterFlag) {
    getFilteredEmployees(filterArray, sortOrder);
  }
  else {
    queryEmployeeTable(sortOrder)
  }

}

//filter
const filterContainer = document.querySelector(".filter-container");
let sortOrder = orderBy("employeeId");
queryEmployeeTable();

let filterFlag = 0;
let filterArray = [];

filterStatus.addEventListener("click", filterFunction);


function filterFunction() {
  filterStatus.classList.add("filterClicked");
  filterOptions.classList.add("filterClicked");

  filterOptions.addEventListener("click", (e) => {
    let filterElement = e.target.getAttribute("class");
    console.log(filterElement);

    if (filterElement === "Angular" || filterElement === "HTML/CSS" ||
      filterElement === "React" || filterElement === "React Native" ||
      filterElement === "Node") {

      filterArray.push(filterElement);

      // adding background color to selection
      e.target.classList.add("selected-filter-element");
    }

    else if (filterElement === "done") {

      // exit without changes if empty array
      if (filterArray.length === 0) {
        console.log("Exiting filter without any changes");
        filterOptions.classList.remove("filterClicked");
      }

      // filter using filter array
      else {
        getFilteredEmployees(filterArray, sortOrder);
        filterFlag = 1;
        console.log("Filtered using", filterArray);
        filterOptions.classList.remove("filterClicked");
      }
    }

    else if (filterElement === "clear") {
      removeFilters();
    }

  })
}


function removeFilters() {
  queryEmployeeTable();

  filterStatus.classList.remove("filterClicked");
  let previousSelections = document.querySelectorAll(".selected-filter-element");

  previousSelections.forEach(skill => {
    skill.classList.remove("selected-filter-element");
  })

  console.log("Im in remove");

  filterArray = [];
  filterStatus.addEventListener("click", filterFunction);

}


// search
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", searchFunction);

async function searchFunction() {
  let prompt = searchInput.value;
  console.log(prompt)

  let searchQuery = query(collection(db, "employee"), where('employeeName', '==', prompt));
  let searchedDocs = await getDocs(searchQuery);
  console.log(searchedDocs)

  showEmployeeTable(searchedDocs, sortOrder);

}




/* FETCH AND DISPLAY TABLE */

// fetching main table of all employees
async function queryEmployeeTable(sortOrder) {
  const queryTable = query(collection(db, "employee"), sortOrder, limit(10));
  const employees = await getDocs(queryTable);
  showEmployeeTable(employees);
}


// FILTER
// returns every document where the are in filter array
async function getFilteredEmployees(filterArray, sortOrder) {
  let filterQuery = query(collection(db, "employee"), sortOrder,
    where('skills', 'array-contains-any', filterArray), limit(10));

  let filteredDocs = await getDocs(filterQuery);
  showEmployeeTable(filteredDocs);
}


// Displays fetched data as table 
function showEmployeeTable(employees) {

  tableBody.innerHTML = "";

  let empData = [];

  employees.forEach((emp) => {

    let data = {
      id: emp.id,
      employeeId: `${emp.get("employeeId")}`,
      employeeName: `${emp.get("employeeName")}`,
      designation: `${emp.get("designation")}`,
      mailID: `${emp.get("mailID")}`,
      designation: `${emp.get("designation")}`,
      workStatus: `${emp.get("workStatus")}`
    }
    empData.push(data);
  });


  let temp = "";
  empData.forEach(employee => {

    // setting icon depending on work from home or office
    let workIcon;
    if (employee.workStatus === "wfh") {
      workIcon = "assets/work-from-home.svg";
    } else if (employee.workStatus === "office") {
      workIcon = "assets/work-from-office.svg";
    }

    // adding each employee as row to table body
    temp += `
        <tr data-docID="${employee.id}">
        <td>${employee.employeeId}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.designation}</td>
        <td>${employee.mailID}</td>
        <td><img src=${workIcon} alt="" /></td>
        <td><img src="assets/edit.svg" alt=""  class="edit-icon"/></td>
      </tr>`
    currentLastId = employee.employeeId;
  });

  tableBody.innerHTML = temp;
}





/* FETCH AND DISPLAY MODAL */

// listener for click on row and on edit icon
const employeeDetailsModal = document.querySelector(".show-details-overlay");

tableBody.addEventListener("click", function (e) {

  const targetRow = e.target.closest("tr");
  const docId = targetRow.getAttribute("data-docID");
  const currentTargetTd = e.target.getAttribute("class");
  console.log(e.target)
  console.log(currentTargetTd)

  queryEmployeeDetails(docId, currentTargetTd);

});


// fetching employee details data for details and edit modal
async function queryEmployeeDetails(docId, currentTargetTd) {

  const employeeRef = doc(db, "employee", docId)
  const emp = await getDoc(employeeRef);

  console.log(emp.data());

  const employeeDetails = emp.data()
  employeeDetails.id = docId;

  //if e.target is edit img, then open edit modal else show details
  if (currentTargetTd === "edit-icon") {
    console.log("im trying to display")
    showEditModal(employeeDetails);

  } else {
    console.log("im in else condition");
    showDetailsModal(employeeDetails);
  }

}

// displaying fetched employee details in modal
const employeeDetails = document.querySelector(".show-details-modal");
function showDetailsModal(details) {

  employeeDetailsModal.classList.add("show-modal");
  let temp = "";
  temp = `
          <div class="photo-and-basic-details">
            <img
              src="assets/Profile photo.png"
              alt="Profile photo"
              class="profile-pic"
            />
  
            <div class="basic-details">
              <h2>${details.employeeName}</h2>
              <p>ID: ${details.employeeId}</p>
              <h3>${details.designation}</h3>
  
              <div class="show-details-contact">
                <img src="assets/phone number.svg" alt="" />
                <p>${details.mobileNumber}</p>
              </div>
  
              <div class="show-details-contact">
                <img src="assets/mail.svg" alt="" />
                <p>${details.mailID}</p>
              </div>
            </div>
            <img
              class="close-button close-show-details"
              src="assets/close.svg"
              alt=""
            />
          </div>
  
          <div>
            <img class="location-icon" src="assets/location.svg" alt="location" />
            <a href="https://maps.app.goo.gl/nSZoY85aWnADwL7Q9"
              >Ganga Building, Technopark Phase-3, Trivanrdum</a
            >
          </div>
  
          <h4>Skills</h4>
          <p>${details.skills}</p>
          <!--<h4>Projects</h4>-->
          <!--<p>${details.projectList}</p>-->
          <h4>Joined On</h4>
          <p>${details.joiningDate}</p>

          `

  employeeDetails.innerHTML = temp;
  const employeeModalClose = document.querySelector(".close-show-details");

  employeeModalClose.addEventListener("click", closeEmployee);
  function closeEmployee() {
    employeeDetailsModal.classList.remove("show-modal");
  }
}







/* DISPLAY CREATE FORM AND ADD NEW ENTRY TO DATABASE */

// Add employee modal on button click
createButton.addEventListener("click", addNewEmployee);

// add new entry in employee table
function addNewEmployee() {

  addEmployeeModal.classList.add("show-modal");
  addModalClose.addEventListener("click", closeAddModal);
  cancelAdd.addEventListener("click", closeAddModal);

  const add = "get-details-form";
  pushEmployee(null, add);

}

// close add modal
function closeAddModal() {
  addEmployeeModal.classList.remove("show-modal");
}

// form skill slection drop-down on input focus
skillInput.addEventListener("focus", () => {
  skillsDropDown.classList.add("show-modal");

});




// independant function to assign employee ID
// call newId() to get new ID
function count() {

  let countValue = 13;

  function incrementCount() {
    countValue++;
    return countValue;
  }
  return incrementCount;
}
const newId = count();







// push employee => add/edit
async function pushEmployee(id, formType) {
  const addForm = document.getElementById(`${formType}`);
  console.log(formType);

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault()


    let name1 = addForm.querySelector(".full-name1");
    let mobile = addForm.querySelector(".mobile-number");
    let mail = addForm.querySelector(".mail");
    let workStatus = addForm.querySelector(".work-status");
    let joined = addForm.querySelector(".joining-date");
    let designation = addForm.querySelector(".designation");

    let skills = [];    //array that stores selected skills
    let skillInputs = document.querySelectorAll(".skill-select");

    console.log(skillInputs)
    skillInputs.forEach(checkBox => {
      if (checkBox.checked) {
        skills.push(checkBox.value);
      }
    });

    let empDoc = {
      employeeName: name1.value,
      designation: designation.value,
      mailID: mail.value,
      mobileNumber: mobile.value,
      workStatus: workStatus.value,
      joiningDate: joined.value,
      skills: skills
    }

    if (!id) {
      empDoc.employeeId = newId()
    }

    console.log(empDoc)

    // form validation
    let validaionFlag = 0;

    if (formType === "get-details-form") {

      if (empDoc.employeeName == "") {
        console.log("Bruh name");
        validaionFlag++;
        const nameError = document.querySelector(".nameValidation");
        nameError.classList.add("val-error");
      }
      if (empDoc.mailID == "") {
        console.log("Bruh mail");
        validaionFlag++;
        const mailError = document.querySelector(".mailValidation");
        mailError.classList.add("val-error");
      }
      if (empDoc.designation == "") {
        console.log("Bruh designation");
        validaionFlag++;
        const designationError = document.querySelector(".designationValidation");
        designationError.classList.add("val-error");
      }
    }

    if (formType === "edit-details-form") {

      if (empDoc.employeeName == "") {
        console.log("Bruh name");
        validaionFlag++;
        const nameError = document.querySelector(".nameVal");
        nameError.classList.add("val-error");
      }
      if (empDoc.mailID == "") {
        console.log("Bruh mail");
        validaionFlag++;
        const mailError = document.querySelector(".mailVal");
        mailError.classList.add("val-error");
      }
      if (empDoc.designation == "") {
        console.log("Bruh designation");
        validaionFlag++;
        const designationError = document.querySelector(".designationVal");
        designationError.classList.add("val-error");
      }

    }

    if (validaionFlag === 0) {

      console.log("valid", id);

      // if update, delete existing record
      if (id) {

        await updateDoc(doc(db, "employee", id), empDoc)

        //toast upon edit
        toastText.innerHTML = `<p>Edited<span class="insert-delete-name"> ${empDoc.employeeName}</span></p>`;
        editModal.classList.remove("show-modal");

        toastBox.classList.add("show-modal");
        setTimeout(() => {
          toastBox.classList.remove("show-modal");
        }, 2000);

      }

      else {
        // add new entry
        console.log("im in add condition");
        await setDoc(doc(collection(db, "employee")), empDoc);
        closeAddModal();
        addForm.reset();
        queryEmployeeTable(sortOrder);

        //toast upon edit
        toastText.innerHTML = `<p>Added <span class="insert-delete-name">${empDoc.employeeName}</span></p>`;
        addEmployeeModal.classList.remove("show-modal");
        console.log("hihihi")
        toastBox.classList.add("show-modal");
        setTimeout(() => {
          toastBox.classList.remove("show-modal");
        }, 2000);

        const form = document.getElementById("edit-details-form");
        addForm.reset();

      }
    }

  })
}






/* FETCH SELECTED EMPLOYEE DETAILS, DISPLAY FORM, UPDATE IN DB */

// Display details in form
const editModal = document.querySelector(".edit-modal-overlay");

function showEditModal(details) {

  console.log(details);
  let temp = "";
  editModal.classList.add("show-modal");

  //check form id and logic

  temp = `
  <div class="edit-modal big-modal">
    <img src="assets/profile placeholder.png" alt="" />

    <form action="" id="edit-details-form">
      <h3>Employee ID: ${details.employeeId}</h3>
      
      <div>
        <div class="full-name">
          <label for="full-name">Full Name</label>
          <input type="text" class="full-name1" value="${details.employeeName}" />
          <p class="nameVal">Required field: enter name</p>
          </div>
      </div>

      <div class="form-half-width">
        <div class="form-half-inner">
          <label for="dob">Date of birth:</label>
          <input type="date" class="dob"  value="${details.joiningDate}"/>
        </div>
        <div class="form-half-inner">
          <label for="joining-date">Date of joining:</label>
          <input type="date" class="joining-date" value="${details.joiningDate}" />
        </div>
      </div>

      <h3>Contact Details</h3>

      <div class="form-half-width">
        <div class="form-half-inner">
          <label for="phone-number">Phone number:</label>
          <input type="tel" class="mobile-number"  value="${details.mobileNumber}"/>
        </div>

        <div class="form-half-inner">
          <label for="mail">Email ID:</label>
          <input type="email" class="mail" value="${details.mailID}"/>
          <p class="mailVal">Required field: enter email ID</p>
        </div>
      </div>

      <h3>Employment details</h3>
      <div class="form-half-width">
        <div class="form-half-inner">
          <label for="reporting-location">Reporting location:</label>
          <select name="reporting-location" id="reporting-location">
            <option value="tvm-technopark">
              Ganga Building, Technopark Phase-3, Trivanrdum
            </option>
            <option value="tvm-vazhutacaud">
              Artech Magnet Vazhuthacaud Trivandrum
            </option>
            <option value="cochin">Lulu Cyber Tower Infopark Cochin</option>
            <option value="calicut">UL Cyber Park Calicut</option>
            <option value="koratty">
              Nisagandhi, Infopark Koratty, Thrissur
            </option>
          </select>
        </div>

        <div class="form-half-inner">
          <label for="designation">Designation</label>
          <input type="text" class="designation"  value="${details.designation}"/>
          <p class="designationVal">
                Required field: enter designation
              </p>
        </div>
      </div>

      <h3>Skills</h3>
      <div class="skills-container">
      <label for="skills">Check off all applicable skills:</label>
        <input type="text" class="skills-input-edit" />

        <ul class="skills-drop-down-edit">
          <li>
            <label for="Angular-edit"
              ><input
                type="checkbox"
                class="skill-select Angular"
                value="Angular"
                id="Angular-edit"
              />Angular</label
            >
          </li>

          <li>
            <label for="HTML/CSS-edit"
              ><input
                type="checkbox"
                class="skill-select HTML/CSS"
                value="HTML/CSS"
                id="HTML/CSS-edit"
              />HTML/CSS</label
            >
          </li>

          <li>
            <label for="React-edit"
              ><input
                type="checkbox"
                class="skill-select React"
                value="React"
                id="React-edit"
              />React</label
            >
          </li>

          <li>
            <label for="React Native-edit"
              ><input
                type="checkbox"
                class="skill-select React Native"
                value="React Native"
                id="React Native-edit"
              />React Native</label
            >
          </li>

          <li>
            <label for="Node-edit"
              ><input
                type="checkbox"
                class="skill-select Node"
                value="Node"
                id="Node-edit"
              />Node</label
            >
          </li>
        </ul>
      </div>
      <div class="work-status-container">
      <label for="work-status">Select work status:</label>
      <select name="work-status" class="work-status">
        <option value="office">Office</option>
        <option value="wfh">Work From home</option>
      </select>
      </div>
      <div class="form-button-container">
        <button type="button" class="cancel-edit form-button">Cancel</button>
        <button type="button" class="form-button delete-employee">Delete employee</button>
        <button type="submit" class ="form-button">Submit</button>
      </div>
    </form>

    <img
      class="close-button close-edit-modal"
      src="assets/close.svg"
      alt="Close button"
    />
  </div>`

  editModal.innerHTML = temp;

  const editModalClose = editModal.querySelector(".close-edit-modal");
  const cancelEdit = editModal.querySelector(".cancel-edit");


  // edit modal skill-list dropdown
  const skillInputEdit = editModal.querySelector(".skills-input-edit");
  const skillsDropDownEdit = editModal.querySelector(".skills-drop-down-edit");

  console.log("Im here");

  skillInputEdit.addEventListener("focus", () => {

    details.skills.forEach(element => {

      document.getElementById(`${element}-edit`).checked = true;

    });

    console.log("focused on skills")
    skillsDropDownEdit.classList.add("show-modal");

    skillsDropDownEdit.onblur = function () {
      skillsDropDownEdit.classList.remove("show-modal");
    }

  });


  // delete employee listeners
  const deleteButton = editModal.querySelector(".delete-employee");
  console.log(deleteButton);

  deleteButton.addEventListener("click", () => {
    console.log("details.id");
    deleteEmployee(details.id, details.employeeName)
  });

  // close edit modal listeners
  editModalClose.addEventListener("click", closeEditModal);
  cancelEdit.addEventListener("click", closeEditModal);

  // event listeners for submission of edit form
  const edit = "edit-details-form"
  pushEmployee(details.id, edit);

}

// close edit modal
function closeEditModal() {
  editModal.classList.remove("show-modal");
  queryEmployeeTable(sortOrder);
}









/* DELETE EMPLOYEE FROM TABLE */
async function deleteEmployee(id, name) {

  const confirmDiv = document.querySelector(".confirm-deletion-modal-overlay");
  confirmDiv.classList.add("show-modal");

  const fillName = confirmDiv.querySelector(".insert-delete-name");
  fillName.innerHTML = name;

  const confirmDeleteButton = confirmDiv.querySelector(".confirm-delete-button");
  const cancelDeleteButton = confirmDiv.querySelector(".cancel-delete-button");

  cancelDeleteButton.addEventListener("click", () => {
    confirmDiv.classList.remove("show-modal");
    closeEditModal();
  })

  confirmDeleteButton.addEventListener("click", async () => {

    await deleteDoc(doc(db, "employee", id));
    confirmDiv.classList.remove("show-modal");
    closeEditModal();


    //toast upon delletion
    toastText.innerHTML = `<p>Deleted<span class="insert-delete-name"> ${name}</span></p>`;
    toastBox.classList.add("show-modal");

    setTimeout(() => {
      toastBox.classList.remove("show-modal");
    }, 2000);

  })
}



// skillsDropDown.onblur = function () {
//   skillsDropDown.classList.remove("show-modal");
// }

// close on clicking anywhere else
// setTimeout(() => {
//   skillInput.addEventListener("click", (e) => {

//     console.log(e.target);
//     if (e.target !== "li") {
//       skillsDropDown.classList.remove("show-modal");
//     }
//   })
// }, 200);


const nextButton = document.querySelector(".next-page");
const previousButton = document.querySelector(".previous-page");

nextButton.addEventListener("click", () => {
  fetchNextPage(currentLastId);
})

// pagination
async function fetchNextPage(nextId) {

  console.log("trying to fetch next page", nextId);
  const pageQuery = query(collection(db, "employee"), sortOrder, orderBy("employeeId"), startAt(nextId));
  let pageDocs = await getDocs(pageQuery);
  showEmployeeTable(pageDocs);
}



