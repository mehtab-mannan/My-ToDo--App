function $(id) {
    return document.getElementById(id)
}


const form = $('form');
const date = $('date');
const tbody = $('tbody');
const today = new Date().toISOString().slice(0,10);
date.value = today;


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
        displayUI(formData);
    }
    this.reset();
})

// data show on UI--------------------
// we can destructure also: function displayUI(task)----
function displayUI({name,priority,status,date}) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
                    <td>1</td>
                    <td>${name}</td>
                    <td>${priority}</td>
                    <td>${status}</td>
                    <td>${date}</td>
                    <td>
                        <button id="delete"> <i class="fas fa-trash"></i> </button>
                        <button id="check"><i class="fas fa-check-double"></i></button>
                        <button id="edit"><i class="fas fa-highlighter"></i></button>
                    </td>
    `
    tbody.appendChild(tr);
}

// generate unique ID------------


