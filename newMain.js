import { db, getDocs, getDoc, collection, addDoc, query, where, doc } from "./firestore.js";

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

    let queryEmployee = query(collection(db, "employee"), where("employeeId", "==", row));
    console.log(queryEmployee);

    let empDetails = getDocs(queryEmployee).then((emp) => {
        let employeeDetails = {
            employeeId: `${emp.get("employeeId")}`,
            employeeName: `${emp.get("employeeName")}`,
            designation: `${emp.get("designation")}`,
            mailID: `${emp.get("mailID")}`,
            designation: `${emp.get("designation")}`,
            mobileNumber: `${emp.get("mobileNumber")}`
        }
        showDetailsModal(employeeDetails);
    }
    )
    // console.log(empDetails)

});


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
                <p>${details.mailID}/p>
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
  
          <div class="skills-projects-joining"></div>
          `

    employeeDetails.innerHTML = temp;
    const employeeModalClose = document.querySelector(".close-show-details");

    employeeModalClose.addEventListener("click", closeEmployee);
    function closeEmployee() {
        employeeDetailsModal.classList.remove("show-modal");
    }
}

