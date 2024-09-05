'use strict';
import express from 'express';
// use fs/promises
import { promises as fs } from 'fs'; 

const port = 3000;
const rootFolder='public';
const app = express();

//app rootFolder ext:html
app.use(express.static(rootFolder,{
    extensions:['html']
}));

// app use json 
app.use(express.json());

// json file
const jsonData = `${rootFolder}/data/articles.json`;
// html folder
const htmlFolder = `${rootFolder}/data/articles/`; 

//############################################################## 
// save json and html file
const saveData = (data) => {
    // random id 1234-id -> better use date for id?
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const id = `${randomNumber}-${data.id}`;
    return fs.readFile(jsonData, 'utf8')
    .then(fileData => {
        const json = JSON.parse(fileData);
        const newArticle = {
            id,
            headline: data.headline,
            file: `${id}.html`,
            tags: data.tags
        };
        // add to top
        //json.articles.unshift(newArticle);
        // or add to bottom
        json.articles.push(newArticle);
        //json file
        return fs.writeFile(jsonData, JSON.stringify(json, null, 4), 'utf8');
    })
    .then(() => {
        // save html file
        const htmlContent = `<pre>\n<code>\n${data.contentHtml}\n</code>\n</pre>`;
        return fs.writeFile(`${htmlFolder}/${id}.html`, htmlContent, 'utf8');
    })
    .then(() => res.send('ok'))
    .catch(() => console.warn);
};

//##############################################################
// delete article and html file
const deleteData=(id) => {
    return fs.readFile(jsonData, 'utf8')
    // .then(()=>console.log(data))
    .then(fileData => {
        const json = JSON.parse(fileData);
        // filter article -> remove article from json with article.id != id
        const filteredArticles = json.articles.filter(article => article.id !== id);
        //id to remove not fount
        if (filteredArticles.length === json.articles.length) {
            throw new Error('Article not found');
        }
        // all ok -> save json file
        json.articles = filteredArticles;
        return fs.writeFile(jsonData, JSON.stringify(json, null, 4), 'utf8');
    })
    // delete html file
    .then(() => {
        return fs.unlink(`${htmlFolder}/${id}.html`);
    })
    .catch(() => console.warn);
};

//##############################################################
const getEditData=(id) => {
    return fs.readFile(jsonData, 'utf8')
    .then(fileData => {
        const json = JSON.parse(fileData);
        // filter article -> get article from json with article.id = id
        const filteredArticles = json.articles.filter(article => article.id === id);
        return filteredArticles;
    })
    .catch(() => console.warn);
};

//##############################################################
// update json and html file
const updateData = (data) => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const id = `${randomNumber}-${data.id}`;
    return fs.readFile(jsonData, 'utf8')
    .then(fileData => {
        const json = JSON.parse(fileData);
        const index = json.articles.findIndex(article => article.id === data.realid);
        json.articles[index].id=id;
        json.articles[index].headline=data.headline;
        json.articles[index].file=`${id}.html`;
        json.articles[index].tags=data.tags;
        return fs.writeFile(jsonData, JSON.stringify(json, null, 4), 'utf8');
    })
    .then(()=>{
        return fs.unlink(`${htmlFolder}/${data.realid}.html`);
    })
    .then(() => {
        // update html file
        const htmlContent = `<pre>\n<code>\n${data.contentHtml}\n</code>\n</pre>`;
        return fs.writeFile(`${htmlFolder}/${id}.html`, htmlContent, 'utf8');
    })
    .then(() => res.send('ok'))
    .catch(() => console.warn);
};

//############################################################## 
// route save new content
app.post('/saveNewContent', (req, res) => {
    const data = req.body;
    saveData(data)
        .then(() => res.send('ok'))
        .catch(() => console.warn);
}); 

//############################################################## 
// route update content
app.post('/updateContent', (req, res) => {
    const data = req.body;
    updateData(data)
        .then(() => res.send('ok'))
        .catch(() => console.warn);
});

//############################################################## 
// route edit get entry
app.post('/editEntry', (req, res) => {
    const data = req.body;
    getEditData(data.id)
    .then(data =>res.json(data))
    .catch(() => console.warn);
}); 

//############################################################## 
// route delete entry -> ID
app.post('/removeEntry', (req, res) => {
    const data = req.body;
    deleteData(data.id)
        .then(() => res.send(`delete ${data.id}`))
        .catch(() => console.warn);
}); 

//############################################################## 
// route get content
app.get('/getContent', (req, res) => {
   fs.readFile(jsonData, 'utf8')
    .then(data => res.json(JSON.parse(data)))
    .catch(() => console.warn);
  });

//##############################################################  
//##############################################################  
// Start app
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
