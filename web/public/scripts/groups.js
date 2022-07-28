let modal1 = document.getElementById("myModal");
let btn1 = document.getElementById("add-new-group");
let span1 = document.getElementsByClassName("close")[0];
let list = document.getElementById('group-list');
let edit_button = document.getElementById('edit-group');

let changed_groups = [];
let groups_list = [], id = [];

//create functionality of modal 
btn1.onclick = function () {
    modal1.style.display = "block";
};

span1.onclick = function () {
    modal1.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
}

if(groups.length > 0){
    for(let i = 0; i<groups.length; i++){
        groups_list.push(groups[i].name);
        id.push(groups[i].id)
    }
}else{
    document.getElementsByClassName('faq')[0].style.height = "100px"
}

//creating groupless 
let new_but = document.createElement("input");
    new_but.type = "button"
    new_but.id="groupless"
    new_but.value = "groupless"
    new_but.className = "groups-details"
    new_but.onchange = change_groups
    new_but.onpropertychange = change_groups;
    new_but.onkeyuponpaste = change_groups;
    new_but.oninput = change_groups;
    let new_li = document.createElement("li");
    new_li.className = "groups"
    new_li.appendChild(new_but);
    list.appendChild(new_li);

for(let i = 0; i<groups_list.length; i++){
    let new_but = document.createElement("input");
    new_but.type = "button"
    new_but.id=i
    new_but.value = groups_list[i]
    new_but.className = "groups-details"
    new_but.onchange = change_groups
    new_but.onpropertychange = change_groups;
    new_but.onkeyuponpaste = change_groups;
    new_but.oninput = change_groups;
    let new_li = document.createElement("li");
    new_li.className = "groups"
    new_li.appendChild(new_but);

    let new_form = document.createElement('form');
    new_form.action = "/delete-group";
    new_form.method = "post";
    let new_button2 = document.createElement('button');
    new_button2.name = "group";
    new_button2.className = "deleteGroups-button";
    new_button2.classList.add("deleting-group");
    new_button2.value = groups_list[i];
    let new_trash = document.createElement('i');
    new_trash.className = "fa-solid";
    new_trash.classList.add("fa-trash");
    new_button2.appendChild(new_trash);
    new_form.appendChild(new_button2);
    new_li.appendChild(new_form);
    list.appendChild(new_li);
}

let group_button = document.getElementsByClassName("groups-details");
    for(let i = 0; i<group_button.length; i++){
        group_button[i].onclick = function(){
            if(group_button[i].type == "button"){
                document.getElementById('selected-group').value = group_button[i].value
                document.getElementById('showGroupDetail-form').submit()
            }
        }
    }

//edit
edit_button.onclick = function(){
    let elements_for_change = document.getElementById('group-list').children;
    let trash = document.getElementsByClassName("deleteGroups-button");
    for(let i = 0; i<elements_for_change.length; i++){
        if(elements_for_change[i].children[0].type == "button"){
            elements_for_change[i].children[0].type = "text";
            document.getElementById('submit-edit').style.display = "inline"
            trash[i].style.display = "inline"
        }else{
            elements_for_change[i].children[0].type = "button";
            document.getElementById('submit-edit').style.display = "none"
            trash[i].style.display = "none"
        }
    }
}



function change_groups() {
    if (groups[this.id].name != this.value) {    //check if the value changed
        if (changed_groups.length != 0) {   //check if any changings are included to the array
            for (let i = 0; i < changed_groups.length; i++) {     //search for existing id to avoid duplicates
                if (changed_groups[i].id == id[this.id]) {
                    changed_groups.splice(i, 1);
                }
            }
            if (this.value != "") {
                changed_groups.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        } else {
            if (this.value != "") {
                changed_groups.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        }
    } else {
        if (changed_groups.length != 0) {
            for (let i = 0; i < changed_groups.length; i++) {
                if (changed_groups[i].id == id[this.id]) {
                    
                    changed_groups.splice(i, 1);
                }
            }
        }
    }
    console.log(typeof changed_groups)
    document.getElementById('saved-group').value = JSON.stringify(changed_groups);
}


function filter_groups(){
    let val = document.getElementById('input-search-groups').value.toLowerCase();
    let counter = groups.length;
    let groups_titles = ["groupless"];
    for(let i = 0; i<counter; i++){
        groups_titles.push(groups[i].name.toLowerCase());
    }
    let matches = groups_titles.filter(s => s.includes(val));
    if(val ==""){
        for(let i = 0; i<counter+1; i++){
            list.children[i].style.display = ""
        }
    }
    for(let i = 0; i<counter+1; i++){
        let el = list.children[i].children[0].value
        if(matches.indexOf(el) == -1){
            list.children[i].style.display = "none"
        }else{
            list.children[i].style.display = ""
        }
    }
}