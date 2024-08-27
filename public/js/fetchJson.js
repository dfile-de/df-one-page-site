'use strict';
// fetchJson for type json or text
const fetchJson = async (url,type) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data;
        //for json
        if(type==='json'){
            data = await response.json();
        }
        //for text
        else if(type==='text'){
            data = await response.text();
        }
        else{
            data=null;
        }
        // Return jsonData
        return data; 

    }// end try
    catch (err) {
        console.error(`Fetch problem: ${err.message}`);
    }// end catch
}
export default fetchJson;