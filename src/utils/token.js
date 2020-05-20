const KEY = 'heimamm_token'

const setToken = token =>{
    localStorage.setItem(KEY,token)
}

const getToken = ()=>{
    localStorage.getItem(KEY)
}

const removeToken = ()=>{
    localStorage.removeItem(KEY)
}


export {setToken,getToken,removeToken}