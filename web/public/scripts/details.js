let patterns_list = document.getElementById('patterns-list');
let responses_list = document.getElementById('responses-list');
let edit_buttons = document.getElementsByClassName('edit-button');

let modal1 = document.getElementById("myModal");
let btn1 = document.getElementById("add-new-pattern");
let btn2 = document.getElementById("add-new-response");
let span1 = document.getElementsByClassName("close")[0];

let clicked_btn;

let changed_patterns = [], changed_responses = [];

//creating elements for every pattern
for (let i = 0; i < patterns.length; i++) {
    let new_li = document.createElement('li');
    let new_input = document.createElement('input');
    new_input.type = "button";
    new_input.onchange = change_patterns
    new_input.onpropertychange = change_patterns;
    new_input.onkeyuponpaste = change_patterns;
    new_input.oninput = change_patterns;
    new_input.id = i;
    new_input.className = "faq-values";
    new_input.value = new_line(patterns[i]);
    new_li.appendChild(new_input);

    let new_form = document.createElement('form');
    new_form.action = "/delete-pattern";
    new_form.method = "post";
    let new_button2 = document.createElement('button');
    new_button2.name = "pattern";
    new_button2.className = "deletePatterns-button";
    new_button2.classList.add("deleting-faq");
    new_button2.value = new_line(patterns[i]);
    let new_trash = document.createElement('i');
    new_trash.className = "fa-solid";
    new_trash.classList.add("fa-trash");
    new_button2.appendChild(new_trash);
    new_form.appendChild(new_button2);
    new_li.appendChild(new_form);
    patterns_list.appendChild(new_li);
}

//creating elements for every response
for (let i = 0; i < responses.length; i++) {
    let new_li = document.createElement('li');
    let new_input = document.createElement('input');
    new_input.type = "button";
    new_input.onchange = change_responses
    new_input.onpropertychange = change_responses;
    new_input.onkeyuponpaste = change_responses;
    new_input.oninput = change_responses;
    new_input.id = i;
    new_input.className = "faq-values";
    new_input.value = new_line(responses[i])
    new_li.appendChild(new_input);



    let new_form = document.createElement('form');
    new_form.action = "/delete-response";
    new_form.method = "post";
    let new_button2 = document.createElement('button');
    new_button2.name = "response";
    new_button2.className = "deleteResponses-button";
    new_button2.classList.add("deleting-faq");
    new_button2.value = new_line(responses[i]);
    let new_trash = document.createElement('i');
    new_trash.className = "fa-solid";
    new_trash.classList.add("fa-trash");
    new_button2.appendChild(new_trash);
    new_form.appendChild(new_button2);
    new_li.appendChild(new_form);
    responses_list.appendChild(new_li);
}

//edit button
for (let i = 0; i < edit_buttons.length; i++) {
    edit_buttons[i].onclick = function () {
        let elements_for_change = edit_buttons[i].parentElement.parentElement.children[1]
        for (let j = 0; j < elements_for_change.childElementCount; j++) {
            if (elements_for_change.children[j].children[0].type == "button") { //checking if the edit button was clicked already
                elements_for_change.children[j].children[0].type = "text";      //changing input type to text for accessing the editing function
                document.getElementById('submit-edit').style.display = "inline";    //inline the submit button
                if(i == 0){ //inline the trash buttons
                    let trash = document.getElementsByClassName("deletePatterns-button");
                    for(let x = 0; x<trash.length; x++){
                        trash[x].style.display = "inline"
                    }
                }else{
                    let trash = document.getElementsByClassName("deleteResponses-button");
                    for(let x = 0; x<trash.length; x++){
                        trash[x].style.display = "inline"
                    }
                }
            } else {
                elements_for_change.children[j].children[0].type = "button"; //change all textfields back to a "button"
                if (i == 0 && j == elements_for_change.childElementCount - 1) {
                    if (edit_buttons[1].parentElement.parentElement.children[1].lastChild.children[0].type == "button") {
                        document.getElementById('submit-edit').style.display = "";
                    }
                } if (i == 1 && j == elements_for_change.childElementCount - 1) {
                    if (edit_buttons[0].parentElement.parentElement.children[1].lastChild.children[0].type == "button") {
                        document.getElementById('submit-edit').style.display = "";
                    }
                }
                if(i == 0){
                    let trash = document.getElementsByClassName("deletePatterns-button");
                    for(let x = 0; x<trash.length; x++){
                        trash[x].style.display = "none";
                    }
                }else{
                    let trash = document.getElementsByClassName("deleteResponses-button");
                    for(let x = 0; x<trash.length; x++){
                        trash[x].style.display = "none";
                    }
                }

            }
        }
    }

}

//modals
btn1.onclick = function () {
    modal1.style.display = "block";
    clicked_btn = "pattern"
};

btn2.onclick = function () {
    modal1.style.display = "block";
    clicked_btn = "response"
}

span1.onclick = function () {
    modal1.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
    if (clicked_btn == "pattern") {
        document.getElementById('new-Data').placeholder = "Type a new pattern";
        document.getElementById('modal-create-headline').innerHTML = "Create new Pattern";
        document.getElementById('pr-name').value = "patterns"
    } else {
        document.getElementById('new-Data').placeholder = "Type a new response";
        document.getElementById('modal-create-headline').innerHTML = "Create new Response";
        document.getElementById('pr-name').value = "responses"
    }
}


//editing
function change_patterns() {
    if (patterns[this.id] != this.value) {    //check if the value changed
        if (changed_patterns.length != 0) {   //check if any changings are included to the array
            for (let i = 0; i < changed_patterns.length; i++) {     //search for existing id to avoid duplicates
                if (changed_patterns[i].id == id[this.id]) {
                    changed_patterns.splice(i, 1);
                }
            }
            if (this.value != "") {
                changed_patterns.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        } else {
            if (this.value != "") {
                changed_patterns.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        }
    } else {
        if (changed_patterns.length != 0) {
            for (let i = 0; i < changed_patterns.length; i++) {
                if (changed_patterns[i].id == id[this.id]) {
                    changed_patterns.splice(i, 1);
                }
            }
        }
    }
    document.getElementById('saved-changes_patterns').value = JSON.stringify(changed_patterns);
}

function change_responses() {
    if (responses[this.id] != this.value) {    //check if the value changed
        if (changed_responses.length != 0) {   //check if any changings are included to the array
            for (let i = 0; i < changed_responses.length; i++) {     //search for existing id to avoid duplicates
                if (changed_responses[i].id == id[this.id]) {
                    changed_responses.splice(i, 1);
                }
            }
            if (this.value != "") {
                changed_responses.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }

        } else {
            if (this.value != "") {
                changed_responses.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        }


    } else {
        if (changed_responses.length != 0) {
            for (let i = 0; i < changed_responses.length; i++) {
                if (changed_responses[i].id == id[this.id]) {
                    changed_responses.splice(i, 1);
                }
            }
        }
    }
    document.getElementById('saved-changes_responses').value = JSON.stringify(changed_responses);
}


//for the case, a tag has no patterns or responses
if(patterns.length == 0){
    patterns_list.style.height = "75px";
}
if(responses.length == 0){
    responses_list.style.height = "75px";
}

//new line function
function new_line(text){
    let counter = (text.split("\\n")).length - 1;
    if(counter == 0){
        return text;
    }
    let filtered_text
        let substring = text.split('\\n');
        for(let i = 0; i<substring.length; i++){
            
            if(filtered_text == undefined){
                filtered_text = substring[i];
            }else{
                filtered_text = filtered_text + "\n" + substring[i]
            }
        }
        return filtered_text;
}

