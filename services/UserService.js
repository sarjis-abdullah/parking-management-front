// import { Account } from './../models/Account';
// import { HttpHeader } from '../utils/HttpHeader';
// import { HttpRequester } from '../utils/HttpRequester';
// import { Urls } from "../utils/Urls";
// import { TokenService } from './TokenService';
// import { Address, ProductFee, AccountData, ContactAvatar } from '../models';
// import { ChannelRequest, UpdateAddressRequest } from '../requests';
// import { SettingRequest } from '../requests/SettingRequest';
// import { LocaleSettingRequest, PasswordUpdateRequest } from '../requests';
import { HttpRequester } from './HttpRequester';

export class UserService {
  static account;
//   static links = Urls.URLS();
  // private static requester = HttpRequester.httpRequester();
  static requester = HttpRequester.httpRequester();
//   static headers = new HttpHeader();
//   static config = useRuntimeConfig();
//   static BASE_URL = config.public.BASE_URL;
  static async loadAccount(id) {
        
    
    const json = await HttpRequester.get('place','this.headers');
    console.log(json);
    // try {
    //   await $fetch(BASE_URL + "place", {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       // "Content-Type": "application/json", // Adjust content type as needed
    //     },
    //   });
    // } catch (err) {
    //   throw err;
    // }
  }
  // public static setAccount(account:Account){
  //             this.account = account;
  // }
  // public static async getAccount(id:number):Promise<Account>{
  //     if(this.account){
  //         return this.account;
  //     }
  //     else{
  //         return this.loadAccount(id);
  //     }

  // }
  // public static async getAccountProductDetails(account_id:number):Promise<ProductFee[]>{
  //     try{
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         let json = await this.requester.get(this.links.accountPorductDetails(account_id),this.headers);
  //         return json.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
  // public static async updateAddress(address:UpdateAddressRequest):Promise<Address>{
  //     try{
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         let json = await this.requester.put(this.links.updateAddress(address.id),this.headers,address);
  //         this.account.address = json.data;
  //         return json.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
  // public static async updateChannel(channel:ChannelRequest):Promise<Boolean>{
  //     try{
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         if(channel.id)
  //             await this.requester.put(this.links.updateChannel(channel.id),this.headers,channel);
  //         else{
  //             await this.requester.post(this.links.updateChannel(),this.headers,channel);
  //         }
  //         return true;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
  // public static async updateSettings(accountId:number,setting:LocaleSettingRequest):Promise<any>{
  //     try{
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         let data = await this.requester.put(this.links.updateSettings(accountId),this.headers,setting);
  //         return data.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
  // public static async updatePassword(payload:PasswordUpdateRequest):Promise<AccountData>{
  //     try{
  //         const url = this.links.updatePassword();
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         const json = await this.requester.post(url,this.headers, payload);
  //         return json.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
  // public static async updateProfile(contactId: number, payload:ContactAvatar):Promise<Account>{
  //     try{
  //         const url = this.links.updateProfile(contactId);
  //         const token = TokenService.getToken();
  //         this.headers.addAuthHeader(token);
  //         const json = await this.requester.put(url,this.headers, payload);
  //         return json.data;
  //     }
  //     catch(err){
  //         throw err;
  //     }
  // }
}
