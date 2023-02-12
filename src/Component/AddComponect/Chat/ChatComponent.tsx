import { Box, Avatar, Typography, Dialog, DialogContent, Menu, MenuItem, Chip, InputBase, IconButton } from "@mui/material";
import React, { useRef } from "react";
import { useState }from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Chat_API} from "../../../API/Request";
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from "react-i18next";

const MessageLeft = (props: {Sender: string, Message: string, Time: string, Type: string, id: number, DeleteFunction: Function, position: number, From: string}) =>{
    const [OpenImage, setOpenImage] = useState<boolean>(false);
    return(
        <>      
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '90%'}}>  
                <div style={{display: 'flex', marginLeft: '5px', marginTop: '5px', marginBottom: '5px'}}>
                        <Avatar/>
                        <div style={{marginLeft: '15px'}}>
                            <Typography variant='body2'>{props.Sender}</Typography>
                            {props.Type === 'String' &&
                                <Box sx={{backgroundColor: "#A8DDFD", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #97C6E3", position: 'relative', ml: '5px',
                                            borderRadius: "10px", ':before': {content: "''", position: "absolute", borderTop: "15px solid #A8DDFD", borderLeft: "15px solid transparent", borderRight: "15px solid transparent", top: "-1px", left: "-17px"},
                                            ':after': {content: "''", position: "absolute", borderTop: "15px solid #A8DDFD", borderLeft: "15px solid transparent", borderRight: "15px solid transparent",top: "0",left: "-15px"}}}>
                                    <Typography component={'span'} variant='body2'>
                                        {props.Message.split("\n").map((i, key) => {
                                            if (i.includes('http')){
                                                return <div key={key}><a href={i} target='_blank' rel='noreferrer'>{i}</a></div>;
                                            }else{
                                                return <div key={key}>{i}</div>;
                                            }
                                        })}
                                    </Typography>
                                    <Typography variant='caption' sx={{display: 'flex', justifyContent: 'flex-start', opacity: '0.7'}}>{props.Time.substring(0, 5)}</Typography>
                                </Box>
                            }
                            {props.Type === 'Image' &&
                                <Box sx={{backgroundColor: "#A8DDFD", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #97C6E3", position: 'relative', ml: '5px',  height: '100px',
                                            borderRadius: "10px", ':before': {content: "''", position: "absolute", borderTop: "15px solid #A8DDFD", borderLeft: "15px solid transparent", borderRight: "15px solid transparent", top: "-1px", left: "-17px"},
                                            ':after': {content: "''", position: "absolute", borderTop: "15px solid #A8DDFD", borderLeft: "15px solid transparent", borderRight: "15px solid transparent",top: "0",left: "-15px"}}}
                                            onClick={() => setOpenImage(true)}>
                                    <img src={props.Message + '?Width=100'} style={{height: '100px', objectFit: 'contain'}} alt='Chat_Image'/>
                                </Box>
                            }
                            {props.Type === 'Delete' &&
                                <Box sx={{backgroundColor: "rgb(230,230,230)", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #dfd087", position: 'relative', borderRadius: "10px"}}>
                                    <Typography variant='body2'>This message has been deleted</Typography>
                                </Box>
                            }
                        </div>            
                </div>
            </Box>
            <Dialog open={OpenImage} onClose={() => setOpenImage(false)} maxWidth='lg'>
                <DialogContent>
                    <img src={props.Message} style={{height: '100%', objectFit: 'contain'}} alt='Chat_Image'/>
                </DialogContent>
            </Dialog>
        </> 
        )
  } 
  

const MessageRight = (props: {Message: string, Time: string, Type: string, id: number, DeleteFunction: Function, position: number, From: string, Date: string}) =>{
    const [Display, setDisplay] = useState<boolean>(false)
    const [anchorEI, setAnchorEI] = useState<null | HTMLElement>(null);  
    const [OpenImage, setOpenImage] = useState<boolean>(false);
    const CurrentTime = new Date()
    const CreateTime = new Date(props.Date + ' ' + props.Time)

    return(
        <>
            <div style={{display: 'flex', marginRight: '25px', marginTop: '5px', marginBottom: '5px' , justifyContent: 'flex-end', alignItems: 'center', width: '90%'}} onMouseEnter={() => setDisplay(true && CurrentTime.getTime() - CreateTime.getTime() < 60*60*1000 && props.Type !== 'Delete')} onMouseLeave={() => setDisplay(false)}>
                <div onClick={(e: React.MouseEvent<HTMLDivElement>) => setAnchorEI(e.currentTarget)}>
                    {Display && <MoreVertIcon sx={{":hover": {cursor: 'pointer'}}}/>}
                </div>  
                <div >
                    {props.Type === 'String' &&
                        <Box sx={{backgroundColor: "#f8e896", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #dfd087", position: 'relative', 
                                    borderRadius: "10px", ':before': {content: "''", position: "absolute", borderTop: "17px solid #dfd087", borderLeft: "15px solid transparent", borderRight: "15px solid transparent", top: "-1px", right: "-17px"},
                                    ':after': {content: "''", position: "absolute", borderTop: "15px solid #f8e896", borderLeft: "15px solid transparent", borderRight: "15px solid transparent",top: "0",right: "-15px"}}}>
                            <Typography component={'span'} variant='body2'>
                                {props.Message.split("\n").map((i, key) => {
                                    if (i.includes('http')){
                                        return <div key={key}><a href={i} target='_blank' rel='noreferrer'>{i}</a></div>;
                                    }else{
                                        return <div key={key}>{i}</div>;
                                    }
                                })}
                            </Typography>
                            <Typography variant='caption' sx={{display: 'flex', justifyContent: 'flex-end', opacity: '0.7'}}>{props.Time.substring(0, 5)}</Typography>
                        </Box>
                    }
                    {props.Type === 'Image' &&
                        <Box sx={{backgroundColor: "#f8e896", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #dfd087", position: 'relative',  height: '100px',
                                borderRadius: "10px", ':before': {content: "''", position: "absolute", borderTop: "17px solid #dfd087", borderLeft: "15px solid transparent", borderRight: "15px solid transparent", top: "-1px", right: "-17px"},
                                ':after': {content: "''", position: "absolute", borderTop: "15px solid #f8e896", borderLeft: "15px solid transparent", borderRight: "15px solid transparent",top: "0",right: "-15px"}}}
                                onClick={() => setOpenImage(true)}>
                            <img src={props.Message+ '?Width=100'} style={{height: '100px', objectFit: 'contain'}} alt='Chat_Image'/>
                        </Box>
                    }
                    {props.Type === 'Delete' &&
                        <Box sx={{backgroundColor: "rgb(230,230,230)", padding: '10px', textAlign: "left", font: "400 .9em 'Open Sans', sans-serif", border: "1px solid #dfd087", position: 'relative', borderRadius: "10px"}}>
                            <Typography variant='body2'>This message has been deleted</Typography>
                        </Box>
                    }
                </div>  
            </div>
            <Menu anchorEl={anchorEI} open={Boolean(anchorEI)} onClose={() => setAnchorEI(null)} anchorOrigin={{vertical: 'bottom',horizontal: 'left'}} keepMounted transformOrigin={{vertical: 'top',horizontal: 'left'}} disableScrollLock={true}>
                <MenuItem onClick={() => {props.DeleteFunction({id: props.id, position: props.position, From: props.From, Date: props.Date, Time: props.Time}); setAnchorEI(null)}}>
                    <DeleteOutlineIcon sx={{mr: '5px'}}/>
                    <Typography textAlign="center">Delete</Typography>
                </MenuItem>
            </Menu>
            <Dialog open={OpenImage} onClose={() => setOpenImage(false)} maxWidth='lg'>
                <DialogContent>
                    <img src={props.Message} style={{width: '100%', objectFit: 'contain'}} alt='Chat_Image'/>
                </DialogContent>
            </Dialog>
        </>
      )
}

const ChatDataContent = (props:{ChatData: {id: number, Date: string, Message: string, SenderName: string, Time: string, Type: string}[], previous: string[], Target: string, DeleteMessageFunction: Function, From : string}) =>{
    return (
    <>
        {props.ChatData && props.ChatData.length > 0 &&
            props.ChatData.map((chat, index)=>{
                var Time_With_Zone: Date| string = new Date(chat.Date + ' '+ chat.Time)
                Time_With_Zone.setTime(Time_With_Zone.getTime() - Time_With_Zone.getTimezoneOffset()* 60 * 1000)
                Time_With_Zone = Time_With_Zone.toLocaleString("sv-SE")
                const C_Date = Time_With_Zone.substring(0, 10)
                const C_Time = Time_With_Zone.substring(11, 19)
                const top = props.previous.includes(C_Date)
                if(!top) {props.previous.push(C_Date)}
                if (props.ChatData.length - 1 === index) {props.previous.length = 0}
                if (chat.SenderName === props.Target){
                    return(
                    <React.Fragment key={index}>
                        {top ? null :
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
                                <Chip label={props.From === 'Prev' ?C_Date: 'Now'}/>
                            </div>
                        }
                        <div>
                            <MessageLeft Sender={chat.SenderName} Message={chat.Message} key={index} Time={C_Time} Type={chat.Type} id={chat.id} 
                                        DeleteFunction={props.DeleteMessageFunction} position={index} From={props.From}/>
                        </div>     
                    </React.Fragment>      
                    )
                }else{
                    return(
                    <React.Fragment key={index}>
                        {top ? null :
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
                                <Chip label={props.From === 'Prev' ?C_Date: 'Now'}/>
                            </div>
                        }
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            <MessageRight Message={chat.Message} key={index} Time={C_Time} Type={chat.Type} id={chat.id} Date={C_Date}
                                            DeleteFunction={props.DeleteMessageFunction} position={index} From={props.From}/>
                        </div>
                    </React.Fragment>             
                    )
                }
                })}

    </>)
}


///// This Children Function is to reduce render due to main function useState update
const TypeMessageBox = (props: {Target: string, cookies: {[x: string]: any}, setAlertMessage: Function, SocketSendFunction: Function}) =>{
    const [Message, setMessage] = useState<string>('')
    const inputFileRef = useRef<HTMLInputElement>(null)
    const {t} = useTranslation()

    function SendFiles(Files: FileList ){
        if (Files.length > 5){
            props.setAlertMessage('You can only upload 5 files at once')
            setTimeout(() => props.setAlertMessage(''), 3000);
        }else{
            const FilesInput = Object.values(Files).map((File) => (File))
            Chat_API.FileChat({Access_Token: props.cookies['access'], Files: FilesInput, Target: props.Target})
        }
    }

    function SendMessage(Data: {Message: string,  Target: string}){
        props.SocketSendFunction({message: Data.Message, target: Data.Target, type: 'String'})
        setMessage('')
    }

    return(
        <div style={{display: (props.Target ? "flex": "none") , width: '98%', marginTop: '10px', marginBottom: '10px',  alignItems: 'center', height: '6%'}}>
            <InputBase multiline rows={2} 
                       sx={{ ml: '10px', width: '100%', overflowY: 'scroll', height: '100%', scrollbarWidth: 'none', '&::-webkit-scrollbar':{width:0}}} 
                       inputProps={{style: {marginTop: '20px'}}}
                       placeholder={`${t("Chat.TypeHere")}`} value={Message} onChange={(e) => setMessage(e.target.value)}/>
            <IconButton type="submit" sx={{ padding: '10px' }} onClick={() => {if(Message !== ''){SendMessage({Message: Message, Target: props.Target})}}}>
                <SendIcon />
            </IconButton>
            <IconButton type="submit" sx={{ padding: '10px' }} onClick={() => {inputFileRef.current?.click()}}>
                <input ref={inputFileRef} type="file" id="files" name="files" multiple style={{display: 'none'}} onChange={(e) => {if (e.target.files) {SendFiles(e.target.files)}}} accept="image/*" />
                <ImageIcon />
            </IconButton>
        </div>
    )
}


export {MessageLeft, MessageRight, ChatDataContent, TypeMessageBox}