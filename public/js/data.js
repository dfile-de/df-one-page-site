'use strict';
import fetchJson from './fetchJson.js';
const dataModul=()=> {

  // function init data
    const initData = (jsonData) => {
        jsonData.articles.forEach((articleObj) => {
            // create article 
            const article = document.createElement('article');
            // add tag class
            // console.log(articleObj.tags);
            const tags=articleObj.tags.split(',').map(tag => tag.trim())
            tags.forEach((tag)=>{
                article.classList.add(tag.toLowerCase());
            });
            document.querySelector('#articles').append(article);
            // create headline
            const h3 = document.createElement('h3');
            h3.textContent = articleObj.headline;
            article.append(h3);
            // create content
            const content = document.createElement('div');
            content.classList.add('content');
            // fetch html files
            let url = './data/articles/' + articleObj.file;
            fetchJson(url,'text')
            .then(data => {
                content.innerHTML=data;
            })
            // handle error
            .catch(err => console.error(`Fetch html problem: ${err.message}`)); 
            // append html
            article.append(content);
            // create tags container
            const divTags = document.createElement('div');
            divTags.classList.add('tags');
            article.append(divTags);
            // create tag spans
            tags.forEach((tag) => {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            divTags.append(tagSpan);
            });
        });

        // get config
        let url = './data/config.json' ;
        fetchJson(url,'json')
        .then(data => { 
            setTagButtons(data);
            setIcons(data);
        })
        .catch(err => console.error(`Fetch config problem: ${err.message}`));  

        // add tag buttons
        const setTagButtons=(data)=>{
            // create button all tags
            const allTags = document.createElement('button');
            allTags.setAttribute('role', 'button');
            allTags.setAttribute('data-tag', 'all');
            allTags.textContent = 'Show all';
            document.querySelector('#alltags').append(allTags);

            // create tags
            data.alltags.forEach((tag)=>{
                const tags = document.createElement('button');
                tags.setAttribute('role', 'button');
                tags.setAttribute('data-tag',tag.toLowerCase());
                tags.textContent = tag;
                document.querySelector('#alltags').append(tags);
            })
        }

        // filter tags
        const articles=Array.from(document.querySelectorAll('article'));
        const filterTags=(tag)=>{
            articles.forEach((el)=>{
                // console.log(el);
                // add class hidden to all
                el.classList.add('hidden');
                // remove hidden from tag
                if(el.classList.contains(tag) || tag==='all'){
                    el.classList.remove('hidden');
                }               
            })
        }
    
        const tags=document.querySelector(".tags");
        tags.addEventListener('click',(el)=>{
            const tag=el.target.getAttribute('data-tag');
            el.stopPropagation();
            filterTags(tag);
        })

         // add icon to container #icons
         const setIcons=(data)=>{
            data.icons.forEach((i)=>{
                const icon = document.createElement('img');
                icon.src='./icons/'+i.file;
                icon.alt=i.alt;
                icon.width=30;
                icon.height=30;
                document.querySelector('#icons').append(icon);
             })
         }
    };
  
    // #####################################################
    // init fetch jason -> articles.json
    let url='./data/articles.json';
    fetchJson(url,'json')
    // initData function
    .then(data => initData(data)) 
    // handle error
    .catch(err => console.error(`Fetch json problem: ${err.message}`)); 

}
export default dataModul;