import { useEffect, useReducer, useState } from "react"

function ParseCookies(cookies: string){
    const Cookies_List = cookies.split('; ')
    const ParseList: {[keys: string]: string} = {}
    Cookies_List.forEach((cookie: string) => {
        var Cookie_Pair = cookie.split('=')
        ParseList[Cookie_Pair[0]] = Cookie_Pair[1]
    })
    return ParseList
}

function Check_Email_Valide(email: string): Boolean{
    return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(email)
}


function ParseGraphQLData(data: {[keys: string]: any}){
    const Out: any = {}
    Object.keys(data).forEach((keys) =>{
        if (data[keys][0] === '{' || data[keys][0] === '['){
            Out[keys] = JSON.parse(data[keys])
        }else{
            Out[keys] = data[keys]
        }
    })
    return Out
}

function Combine_Query_With_Param(data: {URL: string, Param: {[keys: string]: any}}){
    const URL = data.URL
    const Param = data.Param
    const Param_List: string[] = []
    Object.keys(Param).forEach((keys) =>{
        Param_List.push(`${keys}=${Param[keys]}`)
    })
    return `${URL}?${Param_List.join('&')}`
}

const useChatsocket = (Data: {URL : string, Param?: {[keys: string]: any}}) => {
    const [URL, setURL] = useState(Data.URL)
    const [Param, setParam] = useState(Data.Param)
    const [Socket, setSocket] = useState<WebSocket| null>()
    const [Target, setTarget] = useState<string>('')
    const [ResponseData, setResponseData] = useState<{id: number, Date: string, Message: string, SenderName: string, Time: string, Type: string}[]>([])
    const [MessageList, setMessageList] = useState<{[Target: string] : {Date: string, Message: string, Time: string, Sender: string, Read: number}}>({})
    const [Status, setStatus] = useState<string>('')
    const [, forceUpdate] = useReducer(x => x + 1, 0)


    useEffect(() =>{
        var NewSocket: WebSocket;
        if (Param?.Target!== '' && Param){
            NewSocket = new WebSocket(Combine_Query_With_Param({URL: URL, Param: Param ? Param: {}}))
            setSocket(NewSocket)
        }
        return () =>{
            if (NewSocket){
                NewSocket.close()
            }
        }
    }, [setSocket, URL, Param])

    function Send(Data: {message: string, target: string, type: string}){
        if (Socket){
            Socket.send(JSON.stringify({Message: Data.message, Target: Data.target, Type: Data.type}))
        }
    }

    function Reset(){
        setResponseData([])
    }
    if (Socket){
        Socket.onmessage = function(event) {
            const {id, Date, Message, SenderName, Time, ChatRoom, Type} = JSON.parse(event.data)
            if (ChatRoom.includes(Target) && Target){
                setResponseData((prev) => {
                    return [...prev, {id, Date, Message, SenderName, Time, Type}]
                })
            }else{
                if (SenderName in MessageList){
                    const prev = MessageList[SenderName]
                    MessageList[SenderName] = {Date: Date, Message: Message, Time: Time, Read: prev.Read + 1, Sender: SenderName}
                    forceUpdate()
                }else{
                    setMessageList((prev) =>{
                        return {...prev, [SenderName]: {Date: Date, Message: Message, Time: Time, Read: 1, Sender: SenderName}}
                    })
                }
            }
        };
        Socket.onopen = function(event) {
            setStatus('Connected')
        }
    }

    return {Socket, Send, ResponseData, Status, setURL, setParam, Reset, MessageList, setTarget, Target}
}

const useScript = (Data: {url: string, async?: boolean,  defer?: boolean}) => {
    useEffect(() => {
      const script = document.createElement('script');
  
      script.src = Data.url;
      script.async = Boolean(Data.async);
      script.defer = Boolean(Data.defer);

  
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      }
    }, [Data]);
  };

export {ParseCookies, ParseGraphQLData, Combine_Query_With_Param, useChatsocket, Check_Email_Valide, useScript}