'use strict';
import fetchJson from '../../js/fetchJson.js';
import {getContent,myAlert} from './backendEntries.js';
// neuer eintrag
const form=document.querySelector('#form');
// form buttons
const createButton=document.querySelector('#createButton');
const editButton=document.querySelector('#editButton');
const resetButton=document.querySelector('#resetButton');
//tags
const tagsContainer=document.getElementById('tags-container');

// get config and create a checkbox for each tag
let url = '../../data/config.json' ;
fetchJson(url,'json')
.then(data => { 
    data.alltags.forEach((tag)=>{
        //create
        const checkboxdiv=document.createElement('div');
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.name='tags';
        checkbox.value=tag;
        checkbox.id=`tag-${tag}`;
        const label = document.createElement('label');
        label.htmlFor = `tag-${tag}`;
        label.textContent = tag;
        //append
        checkboxdiv.appendChild(label);
        checkboxdiv.appendChild(checkbox);
        tagsContainer.appendChild(checkboxdiv);
       
    });
})
.catch(err => console.error(`Fetch config problem: ${err.message}`));  

// ##################################################################

const checkboxSelected=()=> {
    const selectedTags = Array.from(form.querySelectorAll('input[name="tags"]:checked'));
    return selectedTags.length > 0;
};

const getTags = () => {
    const checkboxes = form.querySelectorAll('input[name="tags"]:checked');
    const tags = [];
    checkboxes.forEach(checkbox => {
        tags.push(checkbox.value);
    });
    return tags.join(',');
};

// neuen eintrag speichern
const saveNewContent=(data)=>{ 
    fetch('/saveNewContent', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: data})
    // einträge neu einlesen getContent
    .then(getContent)
    .catch(console.warn)
}

// eintrag geändert
const updateContent=(data)=>{ 
    fetch('/updateContent', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: data})
    // einträge neu einlesen getContent
    .then(getContent)
    .catch(console.warn)
}

// ##################################################################

// form absenden save new
createButton.addEventListener('click',(event)=>{
    if (form.reportValidity() && checkboxSelected()) {
        // get form data
        let formData =new FormData(form);
        formData = Object.fromEntries(formData);
        formData.tags = getTags();
        let data = JSON.stringify(formData, 'UTF-8');
        saveNewContent(data);
        // felder leeren
        form.reset();
        myAlert('Der Eintrag wurde gespeichert.');
    }
    else{
        myAlert('Alle Fleder müssen ausgefüllt werden.');
    }
});

// form absenden edit 
editButton.addEventListener('click',(event)=>{
    if (form.reportValidity() && checkboxSelected()) {
        // get form data
        let formData =new FormData(form);
        formData = Object.fromEntries(formData);
        formData.tags = getTags();
        let data = JSON.stringify(formData, 'UTF-8');
        updateContent(data);
        // felder leeren
        form.reset();
        myAlert('Der Eintrag wurde geändert.');
    }
    else{
        myAlert('Alle Fleder müssen ausgefüllt werden.');
    }
 });

 // reset button
 resetButton.addEventListener('click',(event)=>{
    form.reset();
    editButton.style.visibility = 'hidden';

 });
