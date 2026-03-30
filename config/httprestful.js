// http 
const axios = require('axios')


const api = {
    get: (url, param) => {
        axios.get(url)
            .then((response)=>{
                console.log(response); 
            }).catch((error)=>{
                console.log(error); 
            }).then(()=>{
                console.log('finally');
            })

    }
}



module.exports = {api}; 