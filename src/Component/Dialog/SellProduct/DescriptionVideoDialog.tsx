import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";



const DescriptionVideoDialog = (props: {open: boolean, onclose: Function, VideoList: string[], forceUpdate: Function}) => {
    const [VideoList, setVideoList] = useState<string[]>([]) 
    const [VideoURL, setVideoURL] = useState<string>('')
    const {t} = useTranslation()

    

    function ParseVideo(VideoURL: string){
        let VideoCode = VideoURL.split('v=')[1]
        if (VideoCode.includes('&')){
            VideoCode = VideoCode.split('&')[0]
        }
        setVideoList((VideoList) => [...VideoList, VideoCode])
    }

    function DeleteVideo(loc: number){
        setVideoList(VideoList.filter((video, code) => code !== loc))
    }
    
    return(
        <Dialog open={props.open} onClose={() => props.onclose(false)} fullWidth maxWidth={'sm'} sx={{minWidth: '1200px'}}>
            <DialogTitle>{t("SellProduct.AddVideoDescription")}</DialogTitle>
            <DialogContent>
                <Paper  component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, borderColor: 'green'}} variant="outlined">
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder={`${t("SellProduct.AddYoutubeVideoCode")}`} inputProps={{ 'aria-label': `${t("SellProduct.AddYoutubeVideoCode")}` }} onChange={(res) => setVideoURL(res.target.value)}/>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => ParseVideo(VideoURL)}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
                {
                    VideoList.map((video, code) => {
                        return(
                            <>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <Typography sx={{mt: '15px', mb: '10px'}}>{`Video ${code+1} Code: ${video}`}</Typography>
                                    <IconButton onClick={() => DeleteVideo(code)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                                <iframe style={{marginLeft: '5%', width: `495px`, height: `275px` , objectFit: 'contain', marginBottom: '20px'}}
                                    src={`https://www.youtube-nocookie.com/embed/${video}`} 
                                    title="YouTube video player" 
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                />
                                <Divider />
                            </>         
                        )
                    })
                }
                <Typography variant='body2' sx={{color: 'rgb(180,180,180)', mt: '15px'}}>{t("SellProduct.AddVideoStatement1")}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onclose(false)} color="primary" variant='contained'>{t("SellProduct.Apply")}</Button>
            </DialogActions>
        </Dialog>
    )

}


export default DescriptionVideoDialog