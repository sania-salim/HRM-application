import { db, getDocs, getDoc, collection, addDoc, query, where, doc, setDoc } from "./firestore.js";


// fetching main table of all employees
async function queryEmployeeTable() {
  const queryTable = query(collection(db, "employee"));
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
        <td><img src="assets/edit.svg" alt="" /></td>
      </tr>`

  });

  tableBody.innerHTML = temp;
}


const employeeDetailsModal = document.querySelector(".show-details-overlay")
// listener for click on row
tableBody.addEventListener("click", function (e) {

  const targetRow = e.target.closest("tr");
  const row = targetRow.getAttribute("data-empID");
  console.log(row);
  employeeDetailsModal.classList.add("show-modal");

  queryEmployeeDetails(Number(row));

});



// fetching employee details data for modal
async function queryEmployeeDetails(row) {

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
      mobileNumber: data.mobileNumber
    }
  })
  showDetailsModal(employeeDetails);
}



// displaying fetched employee details in modal
const employeeDetails = document.querySelector(".show-details-modal");
function showDetailsModal(details) {

  let temp = "";
  temp = `
          <div class="photo-and-basic-details">
            <img
              src="assets/Profile photo.png"
              alt="Profile photo"
              class="profile-pic"
            />
  
            <div class="basic-details">
              <h2>${details.employeeId}</h2>
              <p>${details.employeeName}213</p>
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
          <p>React</p>
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





// listener for create button click
const createButton = document.querySelector(".create-employee-button");
const addEmployeeModal = document.querySelector(".add-modal-overlay");
const addModalClose = document.querySelector(".close-add-modal");
const cancelAdd = document.querySelector(".cancel-create");
const addForm = document.getElementById("get-details-form");



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

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    let name1 = document.querySelector(".first-name");
    let name2 = document.querySelector(".last-name");
    let mobile = document.querySelector(".mobile-number");
    let mail = document.querySelector(".mail");
    let workStatus = document.querySelector(".work-status");
    let joined = document.querySelector(".joining-date");
    let skills = document.querySelector(".skills-drop-down");
    let designation = document.querySelector(".designation");

    // console.log(skills.value);

    let id = newId();
    // console.log("hi im id", id)

    let empDoc = {
      employeeName: name1.value,
      designation: designation.value,
      mailID: mail.value,
      mobileNumber: mobile.value,
      workStatus: workStatus.value,
      employeeId: id,
      joiningDate: joined.value,
      // skills: skills.value
    }
    console.log(empDoc)
    await setDoc(doc(collection(db, "employee")), empDoc);
  })
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

