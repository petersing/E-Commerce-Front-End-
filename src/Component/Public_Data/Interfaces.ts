interface User_Object{
    id: string, 
    username: string, 
    isSubscriber: boolean, 
    email: string, 
    dateJoined: string,
    RemainPublish: number,
    Subscribe?: {SubscribeDate: string, SubscribeEnd: string, SubscribePlan: string},
    ProfileIcon: string;

}

interface Address_Object{
    id: number, Address: string, Phone: string, City: string, isDefault: boolean, Country: string, ReceiverName: string
}

interface Item_Object{
    id: string|number;
    name: string;
    price: number;
    author: string;
    image?: string;
    Create_Date?: string;
}

interface Cart_Object{
    image: string| undefined;
    ProductName: string;
    id: number| string;
    SubTotalPrice: number;
    AllOption: {[SubId: string]: {Name: string, Price: number, Quantity: number}| any}
    SubItems: {[SubId: string]: {Count: number}| any}
    Author: string
}

interface Publish_Product_Object{
    Description: string, 
    ProductName: string, 
    ShippingLocation: string, 
    SubItem:  {Name: string, Price: number, Quantity: number, Sell:number,  Properties: {[keys: string]: string}|undefined}[], 
    Category: string, 
    Access_Token: string,
    Images: File[],
    DescriptionImages: File[],
}

interface Product_Detail_Object{
    Author: string,
    Description: string[],
    Images: string[],
    DescriptionImages: string[],
    ProductName: string,
    ShippingLocation: string,
    SubItem: {Name: string, Price: number, Quantity: number, Sell: number, Properties: {[keys: string]: string}, id: string|number}[],
    SimilarProduct: {Price: number, Author: string, id: number}[]
    id: number
    Comment: {CommentTitle: string, CommentContent: string, Score: number, CreateDate: string, CommentProductName: string, User: {username: string, ProfileIcon: string}}[]
    Score: {TotalScore: number, Distribution: {[keys: string]: number}, TotalComment: number},
}

interface Product_Display_Object{
    id: string|number,
    Author: string,
    ProductName: string,
    FirstImage?:  string,
    DateCreate: string,
    MinPrice: number,
    AuthorIcon: string,
    SellingRecord: number,
    Score: {TotalScore: number, TotalComment: number},
    Loaded?: boolean
}

interface Order_SubList{
    id: number,
    SellerName: string,
    TransportCode: string,
    OrderList: {id: number, ProductTitle: string, ProductKey: number, OrderImage: string, SubItem: {Name: string, Count: number, Price: number, Status: string, id: number, Comment: boolean}[]}[]
}

interface Order_Object{
    Order: Order_SubList[],
    PaymentStatus: string,
    PaymentID: number,
}

interface Full_Order_Object{
    id: string|number,
    DateCreate: string,
    TransportCode: string,
    ProductTitle: string,
    OrderList: {ProductTitle: string, OrderImage: string, SubItem: {Name: string, Count: number, Price: number, Status: string}[]}[],
    DeliveryMethod: string,
    PaymentMethod: string
    OrderProcess: number,
    SellerName: string,
    SellerID: string,
    Address: string,
}

interface Management_Product_Object{
    id: string|number,
    Author: string,
    Description: string[], 
    Images: string[],
    DescriptionImages: string[],
    ProductName: string, 
    ShippingLocation: string,
    SubItem: {Name: string, Price: number, Quantity: number, Sell: number, Properties: {[keys: string]: string}, id: string|number}[],
    Category: string
}

interface Modify_Product_Object{
    id: string|number,
    Description: string,
    ProductName: string,
    ShippingLocation: string,
    SubItem: {Name: string, Price: number, Quantity: number, Sell: number, Properties: {[keys: string]: string}, id: string|number}[],
    Category: string,
    Access_Token: string,
    Images?: File[],
    DescriptionImages?: File[],
    RemoveDescriptionImages? : string[],
    RemoveImages?: string[],
    RemoveSubItem?: string[],
}

interface Seller_Order_List_Object{
    PaymentStatus: string,
    Address: string,
    BuyerName: string,
    DateCreate: string,
    DeliveryMethod: string,
    OrderProcess: number,
    Phone: string,
    id: string|number,
    Status: string,
    TransportCode: string,
    OrderList: {id: string, ProductTitle: string, OrderImage: string,  SubItem: {Name: string, Count: number, Price: number, Status: string, id: string}[]}[],
}

interface ReturnItem{
    SellerName?: string,
    BuyerName?: string,
    ReturnStatus: string,
    ReturnStatusState: string,
    ReturnTransportCode: string,
    id: number,
    SubItem: {Name: string, Count: number, Price: number},
    Order: {ProductTitle: string, OrderImage: string},

}


export type {User_Object, Item_Object, Cart_Object, Publish_Product_Object, Product_Detail_Object, Product_Display_Object, Order_Object, Full_Order_Object,
             Management_Product_Object, Modify_Product_Object, Seller_Order_List_Object, Order_SubList, ReturnItem, Address_Object}