function $(id) {
    return document.getElementById(id)
}

const form = $('form');
const date = $('date');
const tbody = $('tbody');
const searchField = $('s_name');
const filterField = $('filter');
const sort = $('sorting');
const by_date = $('by_date')
const bulkPriority = $("bulk_priority");
const bulkStatus = $("bulk_status");
const editInput=$("edit_inp")
const editSel=$("edit_sel")
const today = new Date().toISOString().slice(0,10);
date.value = today;
// checkbox action ===============================>>
let checked = [];

//=== search functionality ============ =============>>

searchField.addEventListener('input', function (e) {
    filterField.selectedIndex = 0;
    tbody.innerHTML = '';
    by_date.value = '';
    // const searchTerm=e.target.value; if i use arrow function
    const searchTerm = this.value; // if i use normal function
    console.log(searchTerm);
    const tasks = getDataFromLocalStorage();
    let no = 0;
    tasks.forEach(task => {
        if (task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            ++no
            displayUI(task, no)
        }
    })
});

//=== filter functionality ============ =============>>

filterField.addEventListener('change', function (e) {
    searchField.value = '';
    tbody.innerHTML = '';
    const filterTerm = this.value;
    // console.log(filterTerm);

    const tasks = getDataFromLocalStorage();
    switch (filterTerm) {
        case "all":
            tasks.forEach((task,i) => {
                displayUI(task,i+1)
            })
            break;
        case "complete":
            let no1 = 0;
            tasks.forEach((task) => {
                if (task.status === 'complete') {
                    ++no1
                    displayUI(task,no1)
                }
            })
            break;
        case "incomplete":
            let no2 = 0;
            tasks.forEach((task) => {
                if (task.status === 'incomplete') {
                    ++no2
                    displayUI(task,no2)
                }
            })
            break;
        case "today":
            let no3 = 0;
            tasks.forEach((task) => {
                if (task.date === today) {
                    ++no3
                    displayUI(task,no3)
                }
            })
            break;
        case "high":
            let no4 = 0;
            tasks.forEach((task) => {
                if (task.priority === 'high') {
                    ++no4
                    displayUI(task,no4)
                }
            })
            break;
        case "medium":
            let no5 = 0;
            tasks.forEach((task) => {
                if (task.priority === 'medium') {
                    ++no5
                    displayUI(task,no5)
                }
            })
            break;
        case "low":
            let no6 = 0;
            tasks.forEach((task) => {
                if (task.priority === 'Low') {
                    ++no6
                    displayUI(task,no6)
                }
            })
            break;
    }
})

//=== sorting functionality ============ =============>>

sort.addEventListener('change', function (e) {
    console.log(e.target.value)
    tbody.innerHTML = '';
    const sortTerm = this.value;
    const tasks = getDataFromLocalStorage();
    if (sortTerm === 'newest') {
        console.log('newest')
        tasks.sort((a, b) => {
            if (new Date(a.date) > new Date(b.date)) {
                return -1
            } else if (new Date(a.date) < new Date(b.date)) {
                return 1
            } else {
                return 0;
            }
        })
    } else {
        tasks.sort((a, b) => {
            if (new Date(a.date) > new Date(b.date)) {
                return 1
            } else if (new Date(a.date) < new Date(b.date)) {
                return -1
            } else {
                return 0;
            }
        })
    }

    tasks.forEach((task,i) => {
        displayUI(task,i+1)
    })
})

// --------sort with specific date--------------------

by_date.addEventListener('change', function (e) {
    console.log(e.target.value)
    const selectedDate = this.value;
    searchField.value = '';
    tbody.innerHTML = '';
    filterField.selectedIndex = 0;
    const tasks = getDataFromLocalStorage();
    if (selectedDate) {
        let count = 0;
    tasks.forEach((task) => {
        if (task.date === selectedDate) {
            ++count;
            displayUI(task,count)
        }
    })
    } else {
        tasks.forEach((task,i) => {
            displayUI(task,i+=1)
    })
    }
})

//============add new task=========================//
form.addEventListener('submit', function (e) {
    e.preventDefault();
    // console.log(this);
    const inputElements = [...this.elements];
    const formData = {}
    let isValid = true;
    inputElements.forEach(element => {
        // console.log(input.value, input.type, input.name);
        if (element.type !== "submit") {
            if (element.value == '') {
                alert("All field required");
                isValid = false;
                return;
            }
            formData[element.name] = element.value;
            
        }
    })
    if (isValid) {
        formData.status = 'incomplete';
        formData.id = uuidv4();
        // console.log(formData);
        const tasks = getDataFromLocalStorage()
        displayUI(formData,tasks.length+1);
        // console.log(tasks)
        tasks.push(formData);
        setDataToLocalStorage(tasks);
    }
    this.reset();
    $('date').value = today;
});

window.onload = load;
function load() {
    tbody.innerHTML = '';
    const tasks = getDataFromLocalStorage()
    tasks.forEach((task, index)=>{
        displayUI(task,index+1)
    })
}


// bulk status functionality==================>>>>>>>>
bulkStatus.onchange = function (e) {
    const selected = this.value;
    let tasks = getDataFromLocalStorage();
    checked.forEach(tr => {
        const id = tr.dataset.id;
        [...tr.children].forEach(td => {
            if (td.id == 'status') {
                td.innerHTML = selected;
            }
        })
        tasks=tasks.filter(task => {
            if (task.id == id) {
                task.status = selected;
                return task;
            } else {
                return task;
            }
        })
    })
    setDataToLocalStorage(tasks)
}

// bulk priority functionality----------

bulkPriority.addEventListener('change', function (e) {
    const selected = this.value;
    let tasks = getDataFromLocalStorage();
    checked.forEach(tr => {
        const id = tr.dataset.id;
        [...tr.children].forEach(td => {
            if (td.id == 'priority') {
                td.innerHTML = selected;
            }
        })
        tasks=tasks.filter(task => {
            if (task.id == id) {
                task.priority = selected;
                return task;
            } else {
                return task;
            }
        })
    })
    setDataToLocalStorage(tasks)
})

// bulk select functionality ---------------->>>>>>>>>>>>
editSel.onchange = function (e) {
    if (this.value == 'name') {
        editInput.type = 'text';
        editInput.value = '';
    } else {
        editInput.type = 'date';
        editInput.value = '';
    }
}
editInput.oninput = function (e) {
    const modifiedValue = this.value;
    let tasks = getDataFromLocalStorage();
    if (this.type == 'text') {
        checked.forEach(tr => {
            const id = tr.dataset.id;
            [...tr.children].forEach(td => {
                if (td.id == 'name') {
                    td.innerHTML = modifiedValue;
                }
            })
            tasks = tasks.filter(task => {
                if (task.id == id) {
                    task.name = modifiedValue;
                    return task
                } else {
                    return task;
                }
            })

        })
 
    } else {
        checked.forEach(tr => {
            const id = tr.dataset.id;
            [...tr.children].forEach(td => {
                if (td.id == 'date') {
                    td.innerHTML = modifiedValue;
                }
            })
            tasks = tasks.filter(task => {
                if (task.id == id) {
                    task.date = modifiedValue;
                    return task
                } else {
                    return task;
                }
            })

        })
    }
    setDataToLocalStorage(tasks)
}

// --bulk-delete single task-------------------
$('bulk_del').addEventListener('click', function (e) {
    let tasks = getDataFromLocalStorage();
    checked.forEach(tr => {
        const id = tr.dataset.id;
        tasks=tasks.filter(task=>task.id!==id)
        tr.remove()
    })
    setDataToLocalStorage(tasks)
})

function selectFunc(e) {
    const tr = e.target.parentElement.parentElement;
    const id = tr.dataset.id;
    if (e.target.checked) {
        checked.push(tr);
        bulkActionhandler();
        // console.log(checked)
    } else {
        const index = checked.findIndex(tr => tr.dataset.id == id);
        checked.splice(index, 1);
        bulkActionhandler();
        // console.log(index)
    }
    // console.log(checked)
}

// bulk functionality-------------------------

function bulkActionhandler() {
    if (checked.length) {
        $('bulk_action').style.display = 'flex';
    }
    else {
        $('bulk_action').style.display = 'none';
    }
}

// dismis button action hndle-------------------

document.querySelector('.dismiss').addEventListener('click', function (e) {
    bulkPriority.selectedIndex = 0;
    bulkStatus.selectedIndex = 0;
    editInput.type = 'text';
    editInput.value = '';
    editSel.selectedIndex = 0;
    const checkBoxes = document.getElementsByClassName('checkbox');
    for (let box of checkBoxes) {
        box.checked = false;
    }
    // console.log(checked)
    $('all_select').checked = false;
    checked = [];
    bulkActionhandler();
})


// select all checkbox-------------------
$('all_select').addEventListener('change', function (e) {
    const checkBoxes = document.getElementsByClassName('checkbox');
    if (e.target.checked) {
        // console.log(e.target.checked)

        checked = [];
        for (let box of checkBoxes) {
            box.checked = true;
            checked.push(box.parentElement.parentElement);
        }
        // console.log(checked)
        bulkActionhandler();
    } else {
        // console.log(e.target.checked)
        for (let box of checkBoxes) {
            box.checked = false;
            checked = [];
        }
        // console.log(checked)
        bulkActionhandler();
    }
})

// data show on UI--------------------
// we can destructure also: function displayUI(task)----
function displayUI({id,name,priority,status,date},index) {
    const tr = document.createElement('tr');
    const check = document.createElement('input');
    check.type = 'checkbox';
    // check.value = id; //optional na dileo hobe
    check.className = 'checkbox';
    check.addEventListener('change', selectFunc)

    tr.innerHTML = `
    <td id="check"></td>
                    <td id='no'>${index}</td>
                    <td id='name'>${name}</td>
                    <td id='priority'>${priority}</td>
                    <td id='status'>${status}</td>
                    <td id='date'>${date}</td>
                    <td id='action'>
                        <button id="delete"> <i class="fas fa-trash"></i> </button>
                        <button id="check"><i class="fas fa-check-double"></i></button>
                        <button id="edit"><i class="fas fa-highlighter"></i></button>
                    </td>
    `
    tr.dataset.id = id;
    tr.firstElementChild.appendChild(check);
    tbody.appendChild(tr);
}

// add data to local storage------------

function getDataFromLocalStorage() {
    let tasks = [];
    const data = localStorage.getItem('tasks');
    if (data) {
        tasks = JSON.parse(data);
    }
    return tasks;
};
function setDataToLocalStorage(tasks) {
    localStorage.setItem('tasks',JSON.stringify(tasks))
};

// -------------------Delete Action----------------------//

tbody.addEventListener('click', function (e) {
    if (e.target.id == "delete") {
        const tr = e.target.parentElement.parentElement;
        const id = tr.dataset.id;
        tr.remove();
        let tasks = getDataFromLocalStorage()
        tasks=tasks.filter((task) => {
            if (task.id !== id) {
                return tasks;
            }
        })
        setDataToLocalStorage(tasks)
        load();
    }
    else if (e.target.id == "check") {
        const tr = e.target.parentElement.parentElement;
        const id = tr.dataset.id;
        const tds = tr.children;
        // console.log(tds);
        [...tds].forEach(td => {
            if (td.id == 'status') {
                let tasks = getDataFromLocalStorage()
                tasks=tasks.filter((task) => {
                    if (task.id === id) {
                    
                      if (task.status === 'incomplete') {
                          task.status = 'complete';
                          td.innerText = 'complete';
                      } else {
                          task.status = 'incomplete';
                          td.innerText = 'incomplete';
                      } return task;
                    } else {
                      return task;
                    }
                })

                setDataToLocalStorage(tasks)
            }
        })
    }
        
    else if (e.target.id == "edit") {
        const tr = e.target.parentElement.parentElement;
        const id = tr.dataset.id;
        const tds = tr.children;

        //========name
        let nameTd;
        let newNameField;
        //priority
        let priorityTd;
        let prioritySelect;
        // date
        let dateTd;
        let dateInputField;
        //action
        let actionTd;
        let preButtons;

        //============
        [...tds].forEach(td => {
            if (td.id === 'name') {
                nameTd = td;
                const preName = td.textContent;
                td.innerText = '';
                newNameField = document.createElement('input');
                newNameField.type = 'text';
                newNameField.value = preName;
                td.appendChild(newNameField)

            } else if (td.id === 'priority') {
                priorityTd = td;
                const prePriority = td.textContent;
                td.innerText = '';
                prioritySelect = document.createElement('select');
                prioritySelect.innerHTML =`
                   <option disabled>Select one</option>
                   <option value="high">High</option>
                   <option value="medium">Medium</option>
                   <option value="low">Low</option>

                `
                if (prePriority === 'high') {
                    prioritySelect.selectedIndex = 1;
                }else if (prePriority === 'medium') {
                    prioritySelect.selectedIndex = 2;
                }else if(prePriority === 'low') {
                    prioritySelect.selectedIndex = 3;
                }

                td.appendChild(prioritySelect);

            } else if (td.id === 'date') {
                dateTd = td;
                const preDate = td.textContent;
                td.innerText = '';
                dateInputField = document.createElement('input');
                dateInputField.type = 'date';
                dateInputField.value = preDate;
                td.appendChild(dateInputField)

            } else if (td.id === 'action') {
                actionTd = td;
                preButtons= td.innerHTML;
                td.innerHTML = '';
                const saveBtn = document.createElement('button');

                saveBtn.innerHTML = '<i class="fas fa-sd-card"></i>';
                saveBtn.addEventListener('click', function () {
                    // name
                    const newName = newNameField.value;
                    nameTd.innerHTML = newName;
                    // priority
                    const newPriority = prioritySelect.value;
                    priorityTd.innerHTML = newPriority;

                    //date
                    const newDate = dateInputField.value;
                    dateTd.innerHTML = newDate;
                    // change save button
                    actionTd.innerHTML = preButtons;
                    // save new data to local storage
                    let tasks = getDataFromLocalStorage()
                    tasks=tasks.filter(task => {
                        if (task.id === id) {
                            task.name = newName;
                            task.priority = newPriority;
                            task.date = newDate;
                            return task;
                        } else {
                            return task;
                        }
                    })
                    setDataToLocalStorage(tasks)
                })
                td.appendChild(saveBtn);
                
            }
        })
    }
})



