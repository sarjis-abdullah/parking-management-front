
let localStorageAvailable = false;
const useLocalStorage = process.env.VITE_USE_LOCAL_STORAGE === 'true';

if (process.client) {
  localStorageAvailable = true;
}
export class AccountStorage{
    public static saveAccount(account){
        if(useLocalStorage)
        sessionStorage.setItem('LOGIN_ACCOUNT',JSON.stringify(account));
    }
    // public static getAccount(){
    //     const data = window.localStorage.getItem('LOGIN_ACCOUNT');
    //     if(data)
    //         return JSON.parse(data);
    //     return null;
    // }
    // public static clearStorage(){
    //     window.localStorage.removeItem('LOGIN_ACCOUNT')
    // }
    
}