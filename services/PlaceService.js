import { HttpRequester } from "./HttpRequester";

export class PlaceService {
  static requester = HttpRequester.httpRequester();
  static async getAll(query='') {
    try {
      return await HttpRequester.get(`place${query}`);
    } catch (err) {
      throw err;
    }
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
