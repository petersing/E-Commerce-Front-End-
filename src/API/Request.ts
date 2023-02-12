import axios from "axios";
import { Cart_Object, Modify_Product_Object, Publish_Product_Object } from "../Component/Public_Data/Interfaces";

const Server_URL = process.env.REACT_APP_SERVER_URL

/// Account Function, Order Function, Chat Function will use REST API since GraphQL do not support File transfer
class Account_API{
    static Register(Email: string, Password: string, Username: string){
        return axios.post(Server_URL + 'api/Account/Register', {email: Email, password: Password, username: Username}, {headers: {'Content-Type': 'multipart/form-data'}})
    }
    static Login(Email: string, Password: string, Remember: boolean){
        return axios.post(Server_URL + 'api/Account/Login', {email: Email, password: Password, remember: Remember}, {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true})
    }
    static GoogleLogin(data: {credential: string}){
        return axios.post(Server_URL + 'api/Account/GoogleOAuth2', {credential: data.credential}, {headers: {'Content-Type': 'multipart/form-data'}})
    }
    static GoogleRegistry(data: {credential: string, username: string, password: string}){
        return axios.post(Server_URL + 'api/Account/GoogleRegistry', {credential: data.credential, username: data.username, password: data.password}, {headers: {'Content-Type': 'multipart/form-data'}})
    }
    static Refresh_Token(Refresh_Token: string){
        return axios.post(Server_URL + 'api/Account/Refresh_Token', {refresh: Refresh_Token}, {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true})
    }
    static Edit_Token(Email: string, Password: string){
        return axios.post(Server_URL + 'api/Account/Edit_Token', {email: Email, password: Password}, {headers: {'Content-Type': 'multipart/form-data'}, withCredentials: true})
    }
    static Ads_Token(access: string){
        return axios.post(Server_URL + 'api/Account/Ads_Token', {}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + access}, withCredentials: true})
    }
    static Reset_Password(data: {new_password: string, prev_password: string, Edit_Token: string}){
        return axios.post(Server_URL + 'api/Account/Reset_Password', {new_password: data.new_password, prev_password: data.prev_password}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + data.Edit_Token}})
    }
    static Subscribe(data: {access: string, Subscribe_Month: number, Subscribe_Plan: string }){
        return axios.post(Server_URL + 'api/Account/Subscribe', {Subscribe_Month: data.Subscribe_Month, Subscribe_Plan: data.Subscribe_Plan}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + data.access}})
    }
    static SetProfileIcon(data: {access: string, Icon: File}){
        return axios.post(Server_URL + 'api/Account/Update_ProfileIcon', {Icon: data.Icon}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + data.access}})
    }
}

class Order_API{
    static CreateOrder(data: {access: string, OrderDetail: Cart_Object[], ClientInformation: object}){
        const {access, OrderDetail, ClientInformation} = data
        const OrderData = OrderDetail.map((item) =>{
            const {AllOption , SubTotalPrice, image, ...Other } = item;
            return Other
        })
        return axios.post(Server_URL + 'api/Order/CreateOrder', {OrderDetail: JSON.stringify(OrderData), ClientInformation: JSON.stringify(ClientInformation)}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + access}})
    }
}

class Product_API{
    static CreateProduct(data: Publish_Product_Object){
        const {Access_Token, SubItem, Images, DescriptionImages,  ...rest} = data
        return axios.post(Server_URL + 'api/Product/Create_Product', {...rest, Images: Images, DescriptionImages:DescriptionImages, SubItem: JSON.stringify(SubItem)}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + Access_Token}})
    }
    static ModifyProduct(data: Modify_Product_Object){
        const {Access_Token, SubItem, RemoveImages, RemoveSubItem, RemoveDescriptionImages, ...rest} = data
        return axios.post(Server_URL + 'api/Product/Modify_Product', 
                          {...rest, SubItem: JSON.stringify(SubItem), RemoveImages: JSON.stringify(RemoveImages), RemoveSubItem: JSON.stringify(RemoveSubItem),
                           RemoveDescriptionImages: JSON.stringify(RemoveDescriptionImages),
                          }, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + Access_Token}})
    }
    static DeleteProduct(date: {id: string|number, Access_Token: string}){
        return axios.post(Server_URL + 'api/Product/Delete_Product', {id: date.id}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + date.Access_Token}})
    }    
}

class Chat_API{
    static FileChat(data: {Access_Token: string, Target: string, Files: File[]}){
        return axios.post(Server_URL + 'api/Message/File', {Target: data.Target, Files: data.Files}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + data.Access_Token}})
    }
    static DeleteChat(data: {Access_Token: string, id: number|string}){
        return axios.post(Server_URL + 'api/Message/DeleteMessage', {id: data.id}, {headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + data.Access_Token}})
    }
    
}


export {Account_API, Order_API, Product_API, Chat_API}