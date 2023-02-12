import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { ListItem, ListItemAvatar, Avatar, ListItemText , Grid, Box, Typography, List, Button, IconButton} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next';

const NewImage = (props: {Images: File[], RenderList: String[], forceUpdate: Function}) =>{
    const ImageList = props.Images.map((image, index) =>{
        const objectUrl = URL.createObjectURL(image)
        props.RenderList.push(objectUrl) // This Function is to make sure that the image is deleted when the component is unmounted
        return(
            <ListItem key={image.name+ Math.random()}>
                <ListItemAvatar>
                <Avatar>
                    <FolderIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`Image ${index}`} sx={{overflow: 'clip'}}/>
                <img src={objectUrl} alt={'Not Found'} style={{width: '50px', marginLeft: '15px', pointerEvents: 'none'}}/>
                <IconButton onClick={() => {props.Images.splice(index, 1); props.forceUpdate();}}>
                    <DeleteIcon/>
                </IconButton>
            </ListItem>
        )
    })
    return ImageList
}
  
  

const DescriptionImageDialog = (props: {open: boolean, onclose: Function, ImageList: File[], ItemRender: string[], forceUpdate: Function}) => {
    const inputFileRef = useRef<HTMLInputElement>(null)
    const {t} = useTranslation()

    function DropImageFunction(Images: FileList|undefined){   
      if (Images){
        Object.values(Images).forEach((image) =>{
          if (['image/png', 'image/jpeg', 'image/jpg'].includes(image.type)){
            props.ImageList.push(image)
          }
        })
      }
      props.forceUpdate()
    }
    return(
        <Dialog open={props.open} onClose={() => props.onclose(false)} fullWidth maxWidth={'sm'} sx={{minWidth: '1200px'}}>
            <DialogTitle>{t("SellProduct.AddImageStatement")}</DialogTitle>
            <DialogContent>
                <Box onDrop={(e) => {e.nativeEvent.preventDefault(); DropImageFunction(e.nativeEvent.dataTransfer?.files)}} onDragOver={(e) => e.preventDefault()}>
                    <input type="file" ref={inputFileRef} style={{display: 'none'}} onChange={(e) => {if (e.target.files) {props.ImageList.push(e.target.files[0]); props.forceUpdate()}}}/>
                    <Box sx={{width: '90%', border: 'dotted 2px rgb(52, 235, 188)', borderRadius: '15px', height: `${props.ImageList.length > 0? 250 : 500}px`, 
                            backgroundColor : 'rgb(184, 224, 238)', mr: 'auto', ml: 'auto', justifyContent: 'center', alignItems: 'center', 
                            display: 'flex', flexDirection: 'column', opacity: '80%'}}>
                    <AddAPhotoIcon sx={{transform: 'scale(2.0)', mb: '20px'}}/>
                    <Button onClick={() => {inputFileRef.current?.click()}} sx={{backgroundColor: 'rgb(53, 156, 115)', color: 'white', mb: '20px'}}>
                        <Typography sx={{fontSize: '5px'}}>{t("SellProduct.SelectPhotos")}</Typography>
                    </Button>
                    <Typography>{t("SellProduct.DragImageStatement")}</Typography>
                    </Box>
                    <List>{NewImage({Images: props.ImageList, RenderList: props.ItemRender, forceUpdate: props.forceUpdate})}</List>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onclose()} color="primary" variant='contained'>{t("SellProduct.Apply")}</Button>
            </DialogActions>

        </Dialog>
    )
}

export default DescriptionImageDialog