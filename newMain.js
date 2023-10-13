import { db, getDocs, getDoc, collection, addDoc, query, where, doc, setDoc, limit, updateDoc, deleteDoc } from "./firestore.js";


/* FETCH AND DISPLAY TABLE */

// fetching main table of all employees
async function queryEmployeeTable() {
  const queryTable = query(collection(db, "employee"), limit(10));
  const employees = await getDocs(queryTable);

  let empData = [];

  employees.forEach((emp) => {

    let data = {
      employeeId: `${emp.get("employeeId")}`,
      employeeName: `${emp.get("employeeName")}`,
      designation: `${emp.get("designation")}`,
      mailID: `${emp.get("mailID")}`,
      designation: `${emp.get("designation")}`,
      workStatus: `${emp.get("workStatus")}`
    }

    empData.push(data);
  });
  showEmployeeTable(empData);
}

queryEmployeeTable();

// Displays fetched data as table 
const tableBody = document.querySelector(".table-body");
function showEmployeeTable(employeeArr) {
  let temp = "";
  employeeArr.forEach(employee => {

    // setting icon depending on work from home or office
    let workIcon;
    if (employee.workStatus === "wfh") {
      workIcon = "assets/work-from-home.svg";
    } else if (employee.workStatus === "office") {
      workIcon = "assets/work-from-office.svg";
    }

    // adding each employee as row to table body
    temp += `
        <tr data-empID="${employee.employeeId}">
        <td>${employee.employeeId}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.designation}</td>
        <td>${employee.mailID}</td>
        <td><img src=${workIcon} alt="" /></td>
        <td><img src="assets/edit.svg" alt=""  class="edit-icon"/></td>
      </tr>`

  });

  tableBody.innerHTML = temp;
}



/* FETCH AND DISPLAY MODAL */

// listener for click on row and on edit icon
const employeeDetailsModal = document.querySelector(".show-details-overlay");

tableBody.addEventListener("click", function (e) {

  const targetRow = e.target.closest("tr");
  const row = targetRow.getAttribute("data-empID");
  const currentTargetTd = e.target.getAttribute("class");
  console.log(e.target)
  console.log(currentTargetTd)

  queryEmployeeDetails(Number(row), currentTargetTd);

});


// fetching employee details data for details and edit modal
async function queryEmployeeDetails(row, currentTargetTd) {

  let employeeDetails;
  let queryEmployee = query(collection(db, "employee"), where("employeeId", "==", row));
  let emp = await getDocs(queryEmployee);

  emp.forEach(doc => {

    let data = doc.data();

    employeeDetails = {
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      designation: data.designation,
      mailID: data.mailID,
      mobileNumber: data.mobileNumber,
      skills: data.skills,
      joiningDate: data.joiningDate
    }
  })

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
          <h4>Projects</h4>
          <p>${details.projectList}</p>
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

// listener for create button click
const createButton = document.querySelector(".create-employee-button");
const addEmployeeModal = document.querySelector(".add-modal-overlay");
const addModalClose = document.querySelector(".close-add-modal");
const cancelAdd = document.querySelector(".cancel-create");


// Add employee modal on button click
createButton.addEventListener("click", addNewEmployee);

// add new entry in employee table
function addNewEmployee() {

  addEmployeeModal.classList.add("show-modal");
  addModalClose.addEventListener("click", closeAddModal);
  cancelAdd.addEventListener("click", closeAddModal);

  function closeAddModal() {
    addEmployeeModal.classList.remove("show-modal");
  }

  let id = newId();
  const add = "get-details-form";
  pushEmployee(id, add);

}

// independant function to assign employee ID
// call newId() to get new ID
function count() {

  let countValue = 0;

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

    let name1 = addForm.querySelector(".first-name");
    console.log(name1);
    let name2 = addForm.querySelector(".last-name");
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
      employeeId: id,
      joiningDate: joined.value,
      skills: skills
    }
    console.log(empDoc)

    // if update, delete existing record
    if (formType === "edit-details-form") {
      console.log("im in the if consition for edit dletion")
      deleteEmployee(id);
    }

    //then add new entry
    await setDoc(doc(collection(db, "employee")), empDoc);
    alert("done");
  })
}

/* FETCH SELECTED EMPLOYEE DETAILS, DISPLAY FORM, UPDATE IN DB */

// Display details in form
const editModal = document.querySelector(".edit-modal-overlay");

function showEditModal(details) {

  let temp = "";
  editModal.classList.add("show-modal");

  //check form id and logic

  temp = `
  <div class="edit-modal big-modal">
    <img src="assets/profile placeholder.png" alt="" />

  
    <form action="" id="edit-details-form">
      <h3>Employee ID: ${details.employeeId}</h3>
      <div class="form-half-width">
        <div class="form-half-inner">
          <label for="first-name">First Name</label>
          <input type="text" class="first-name" value="${details.employeeName}" />
        </div>
        <div class="form-half-inner">
          <label for="last-name">Last name:</label>
          <input type="text" class="last-name" />
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
        </div>
      </div>

      <h3>Skills</h3>
      <label for="skills">Check off all applicable skills:</label>
      <div class="skills-container">
        <input type="text" class="skills-input" />

        <ul class="skills-drop-down">
          <li>
            <label for="skills"
              ><input
                type="checkbox"
                class="skill-select"
                value="Angular"
              />Angular</label
            >
          </li>

          <li>
            <label for="skills"
              ><input
                type="checkbox"
                class="skill-select"
                value="HTML/CSS"
              />HTML/CSS</label
            >
          </li>

          <li>
            <label for="skills"
              ><input
                type="checkbox"
                class="skill-select"
                value="React"
              />React</label
            >
          </li>

          <li>
            <label for="skills"
              ><input
                type="checkbox"
                class="skill-select"
                value="React"
              />React Native</label
            >
          </li>

          <li>
            <label for="skills"
              ><input
                type="checkbox"
                class="skill-select"
                value="Node"
              />Node</label
            >
          </li>
        </ul>
      </div>
      <label for="work-status">Select work status:</label>
      <select name="work-status" class="work-status">
        <option value="office">Office</option>
        <option value="wfh">Work From home</option>
      </select>
      <div>
        <button type="button" class="cancel-edit">Cancel</button>
        <button type="button">Delete employee</button>
        <button type="submit">Submit</button>
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

  editModalClose.addEventListener("click", closeEditModal);
  cancelEdit.addEventListener("click", closeEditModal);

  function closeEditModal() {
    editModal.classList.remove("show-modal");
  }

  // event listeners for submission of edit form
  const edit = "edit-details-form"
  pushEmployee(details.employeeId, edit);

}

// Update entry in database
// async function editEmployee() {
//   await updateDoc(doc(collection(db, "employee")), {
//     // key: value;
//   })
// }


/* DELETE EMPLOYEE FROM TABLE */

async function deleteEmployee(id) {

  let q = query(collection(db, "employee"), where("employeeId", "==", id));
  let empDel = await getDocs(q);

  let delId;

  empDel.forEach(emp => {
    delId = emp.id;
    console.log(delId)
  });

  await deleteDoc(doc(db, "employee", `${delId}`));
  alert("deleted");
}

deleteEmployee(1);

// form skill slection drop-down on input focus
const skillInput = document.querySelector(".skills-input");
const skillsDropDown = document.querySelector(".skills-drop-down");
skillInput.addEventListener("focus", showSkillDropDown);

function showSkillDropDown() {
  skillsDropDown.classList.add("show-modal");

  // skillsDropDown.onblur = function () {
  //   skillsDropDown.classList.remove("show-modal");
  // }

  //close on clicking anywhere else
  // document.addEventListener("click", (e) => {

  //   console.log(e.target);
  //   if (e.target !== "li") {
  //     skillsDropDown.classList.remove("show-modal");
  //   }
  // })
}

