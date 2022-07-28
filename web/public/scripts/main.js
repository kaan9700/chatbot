let modal1 = document.getElementById("myModal");
let btn1 = document.getElementById("add-new-FAQ");
let span1 = document.getElementsByClassName("close")[0];
let list = document.getElementById('faq-list');
let edit_button = document.getElementById('edit-faq');
let dropdown = document.getElementById('group-dropdown');

let changed_tags = [];
let tags_list = [], id = [];
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
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}


if(tags.length >0){
    for(let i = 0; i<tags.length; i++){
        tags_list.push(tags[i].tag);
        id.push(tags[i].id)
    }           
}else{
    document.getElementsByClassName('faq')[0].style.height = "100px"
}


for(let i = 0; i<tags_list.length; i++){
    let new_but = document.createElement("input");
    new_but.type = "button"
    new_but.id=i
    new_but.value = tags_list[i]
    new_but.className = "tags-details"
    new_but.onchange = change_tags
    new_but.onpropertychange = change_tags;
    new_but.onkeyuponpaste = change_tags;
    new_but.oninput = change_tags;
    let new_li = document.createElement("li");
    new_li.className = "tags"
    new_li.appendChild(new_but);
    
    let admin = document.createElement('button');
    admin.type = "button"
    admin.id = tags_list[i];
    admin.className = "add-group"
    let plus = document.createElement('i');
    plus.className = "fa-solid"
    plus.classList.add("fa-plus");
    admin.appendChild(plus);
    new_li.appendChild(admin);

    
    let new_form = document.createElement('form');
    new_form.action = "/delete-tag";
    new_form.method = "post";
    let new_button2 = document.createElement('button');
    new_button2.name = "tag";
    new_button2.className = "deleteTags-button";
    new_button2.classList.add("deleting-tag");
    new_button2.value = tags_list[i];
    let new_trash = document.createElement('i');
    new_trash.className = "fa-solid";
    new_trash.classList.add("fa-trash");
    new_button2.appendChild(new_trash);
    new_form.appendChild(new_button2);
    new_li.appendChild(new_form);

    list.appendChild(new_li);
}


let tag_buttons = document.getElementsByClassName("tags-details");
    for(let i = 0; i<tag_buttons.length; i++){
        tag_buttons[i].onclick = function(){
            if(tag_buttons[i].type == "button"){
                document.getElementById('selected-tag').value = tag_buttons[i].value
                document.getElementById('showTagDetail-form').submit()
            }
        }
    }


let admin_buttons = document.getElementsByClassName('add-group');
//edit
edit_button.onclick = function(){
    let elements_for_change = document.getElementById('faq-list').children;
    let trash = document.getElementsByClassName("deleteTags-button");
    for(let i = 0; i<elements_for_change.length; i++){
        if(elements_for_change[i].children[0].type == "button"){
            elements_for_change[i].children[0].type = "text";
            document.getElementById('submit-edit').style.display = "inline"
            trash[i].style.display = "inline";
            admin_buttons[i].style.display = "inline";
        }else{
            elements_for_change[i].children[0].type = "button";
            document.getElementById('submit-edit').style.display = "none"
            trash[i].style.display = "none";
            admin_buttons[i].style.display = "none";
        }
    }
}


function change_tags() {
    if (tags[this.id].tag != this.value) {    //check if the value changed
        if (changed_tags.length != 0) {   //check if any changings are included to the array
            for (let i = 0; i < changed_tags.length; i++) {     //search for existing id to avoid duplicates
                if (changed_tags[i].id == id[this.id]) {
                    changed_tags.splice(i, 1);
                }
            }
            if (this.value != "") {
                changed_tags.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        } else {
            if (this.value != "") {
                changed_tags.push({ "id": id[this.id], "new_line": this.value })   //insert changed value
            }
        }
    } else {
        if (changed_tags.length != 0) {
            for (let i = 0; i < changed_tags.length; i++) {
                if (changed_tags[i].id == id[this.id]) {
                    
                    changed_tags.splice(i, 1);
                }
            }
        }
    }
    document.getElementById('saved-tags').value = JSON.stringify(changed_tags);
}



for(let i = 0; i<admin_buttons.length; i++){
    admin_buttons[i].onclick = function(){
        
    }
}


let modal2 = document.getElementById("myModal2");
let span2 = document.getElementsByClassName("close")[1];
let btns = [];
for(let i = 0; i<tags.length; i++){
    btns[i] = document.getElementById(tags[i].tag)
}

for(let i = 0; i<tags.length; i++){
    btns[i].onclick = function(){
        modal2.style.display = "block";
        document.getElementById('assign-tag').value=tags[i].tag;
        document.getElementById('assign-tag-text').value = tags[i].tag;
        for(let x = 0; x<groups.length; x++){
            let opt = document.createElement('option');
            opt.value = groups[x].name;
            opt.innerHTML = groups[x].name;
            dropdown.appendChild(opt);
        }
    }
}

span2.onclick = function () {
    modal2.style.display = "none";
};

function filter_tags(){
    let val = document.getElementById('input-search-tags').value.toLowerCase();
    let counter = tags.length;
    let tags_titles = [];
    for(let i = 0; i<counter; i++){
        tags_titles.push(tags[i].tag.toLowerCase());
    }
    let matches = tags_titles.filter(s => s.includes(val));
    if(val ==""){
        for(let i = 0; i<counter; i++){
            list.children[i].style.display = ""
        }
    }
    for(let i = 0; i<counter; i++){
        let el = list.children[i].children[0].value
        if(matches.indexOf(el) == -1){
            list.children[i].style.display = "none"
        }else{
            list.children[i].style.display = ""
        }
    }
}