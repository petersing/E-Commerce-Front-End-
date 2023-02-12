import { useState } from "react";
import { Box, Typography, MenuItem, SvgIcon } from "@mui/material";
import { Categories_List } from "../../Public_Data/Categories_List";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from "react-i18next";

const NestedMenu = (props: {Nested_Data: any, Item_Key: string, ml: number, nest?: string, setCategories: Function, setProductType: Function, setClose: Function}) =>{
    const [Open, setOpen] = useState<boolean>(false);
    const CategoriesList =  Categories_List();
    const {t} = useTranslation()

    const Nest_Data = props.nest ? props.nest + '/' +props.Item_Key: props.Item_Key ; 

    function Check_Last(){
      if (Object.keys(props.Nested_Data).length === 0){
        var Nest_Data_Array = Nest_Data.split('/')
        var Last_Item = Nest_Data_Array.splice(Nest_Data_Array.length-1, 1)[0]
        props.setCategories(Nest_Data_Array)
        props.setProductType(Last_Item)
        props.setClose(false)
      }
    }

    function Check_Icon(){
      if (!Boolean(props.nest)){
        return(
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            {CategoriesList.map((item) => {
                if (item.Category === props.Item_Key){
                    return(
                      <SvgIcon key={item.Category + 'image'} component={item.Image}/>
                    )
                }else{return null}
            })}
            <Typography sx={{ml: '10px'}}>{t(`SellProduct.CategoriesType.${props.Item_Key}`)}</Typography>
          </Box>
        )
      }else{
        return(
          <Box>
            <Typography>{t(`SellProduct.CategoriesType.${props.Item_Key}`)}</Typography>
          </Box>
        )
      }
    }

    return(
      <>
        <MenuItem key={props.Item_Key} onClick={()=> {Check_Last(); setOpen(!Open);}} 
                  sx={{ml: `${props.ml}px`, justifyContent: 'space-between'}} >
                  {Check_Icon()} {Open? <ArrowDropDownIcon/>: <ChevronRightIcon/>}
        </MenuItem>
        {(Open)? Object.keys(props.Nested_Data).map((key: string) => (
          <NestedMenu key={key} Nested_Data={props.Nested_Data[key]} Item_Key={key} ml={props.ml+25} nest={Nest_Data} 
                        setCategories={props.setCategories} setProductType={props.setProductType} setClose={props.setClose}/>    
        )): null}
      </>
    )
  }

export default NestedMenu