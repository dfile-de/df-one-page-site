'use strict';
import fetchJson from '../../js/fetchJson.js';

const myAlert=(text)=>{
    const alertEl = document.querySelector('.backend-form .alert');
    const alertText = document.querySelector('.backend-form .alert p span');
    alertText.innerText=text;
    alertEl.classList.add('active');
    setTimeout(() => {
        alertEl.classList.remove('active');
    }, 8000); 
}

const articles=document.querySelector('.list-items');
// einträge auflisten
const getContent=()=>{ 
    fetch('/getContent')
    .then(res => res.json())
    .then(data => backendEntries.listContent(data.articles))
    .catch(error => {
        console.error('get content:', error);
    })
};

const fillInputs=(data)=>{
    data=data[0];
    const headlineInput = document.querySelector('input[name="headline"]');
    const idInput = document.querySelector('input[name="id"]');
    const tagsInput = document.querySelectorAll('input[name="tags"]');
    const realID = document.querySelector('input[name="realid"]');
    const htmlTextarea = document.querySelector('textarea[name="contentHtml"]');
    // felder füllen
    headlineInput.value = data.headline;
    // remove random id z.B. 1000-
    idInput.value = data.id.replace(/^\d{4}-/, '');
    // alle checkboxen zurücksetzen
    tagsInput.forEach(checkbox=>{
        checkbox.checked = false;
    }) 
     // checkboxen auswählen
    const tags = data.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
        const checkbox = document.querySelector(`input[name="tags"][value="${tag}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    // für form real-id hidden input field
    realID.value=data.id;
    // textarea füllen
     //fetch html files
     console.log(data);
     
     let url = '../data/articles/'+data.file;
     fetchJson(url,'text')
     .then(data => {
         // remove <pre> </pre> <code> </code> tags
         data = data.replace(/<\/?pre>/g, '');
         data = data.replace(/<\/?code>/g, '');
         data = data.trim();
         htmlTextarea.value=data;
         // button einblenden
         document.querySelector('#editButton').style.visibility = 'visible';
     })
     // handle error
     .catch(err => console.error(`Fetch html problem: ${err.message}`)); 
}

const backendEntries={
    listContent(data){
        // liste leeren
        articles.innerHTML = '';
        data.forEach(e => {
            const div=document.createElement('div');
            div.innerHTML=`<h2>${e.headline}</h2>`;

            // show details button
            const showButton = document.createElement('button');
            showButton.innerHTML = '<svg class="feather"><use href="../icons/feather-sprite.svg#chevron-down"/></svg>';
            showButton.classList.add('show-button');
            div.appendChild(showButton);

            // edit button
            const editButton = document.createElement('button');
            editButton.innerHTML = '<svg class="feather"><use href="../icons/feather-sprite.svg#edit"/></svg>';
            editButton.classList.add('edit-button',e.id);
            div.appendChild(editButton);

            // delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<svg class="feather"><use href="../icons/feather-sprite.svg#x-circle"/></svg>';
            deleteButton.classList.add('delete-button',e.id);
            div.appendChild(deleteButton);

            // innerdiv
            const innerDiv=document.createElement('div');
            innerDiv.classList.add('inner-div');
            innerDiv.innerHTML+=`<p>ID: ${e.id}</p>`;
            innerDiv.innerHTML+=`<p>Tags: ${e.tags}</p>`;
            div.appendChild(innerDiv);
            articles.appendChild(div);

            // show details button addEventListener
            showButton.addEventListener('click', () => {
                innerDiv.classList.toggle('is-active'); 
            });

            // edit button addEventListener
            editButton.addEventListener('click', () => {
                this.editEntry(e.id);
            });

            // delete button addEventListener
            deleteButton.addEventListener('click', () => {
                this.deleteEntry(e.id);
            });
        });
    },

    // eintrag löschen -> json eintrag und html file
    deleteEntry(deleteID){
        console.log(`Delete entry with ID: ${deleteID}`);
            fetch('/removeEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: deleteID}),
            })
            .then(myAlert(`Der Eintrag mit der ID ${deleteID} wurde gelöscht.`))
            // einträge neu einlesen getContent
            .then(getContent)
            .catch(error => {
                console.error('delete entry:', error);
            })
    },

     // eintrag editieren -> daten holen
     editEntry(editID){
        console.log(`Edit entry with ID: ${editID}`);
            fetch('/editEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: editID}),
            })
            .then(res => res.json())
            .then(data => fillInputs(data))
            .then(myAlert(`Die Daten wurden übernommen.`))
            .catch(error => {
                console.error('edit entry:', error);
            })
    }

}
getContent();
export {getContent,myAlert};