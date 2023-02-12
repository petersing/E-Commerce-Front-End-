import {Box, Tabs, Tab , SvgIcon} from "@mui/material"
import { Categories_List } from "../../Public_Data/Categories_List";

const SelectCategoriesList = () => {
  const CategoriesList = Categories_List()

  return (
        <Box sx={{display: 'flex', width: '100%', marginLeft: 'auto', marginRight: 'auto', borderBottom: 'solid 1px rgb(200, 200, 200)'}}>
          <Tabs value={false} variant="scrollable" scrollButtons="auto" sx={{transform: 'scale(0.9)', marginLeft: 'auto', marginRight: 'auto', width: '100%', mb: '10px'}}>
            {CategoriesList.map((item, index) => (
              <Tab key={index} icon={<SvgIcon component={item['Image']}/>} label={item['Category']} onClick={() => (window.location.assign(`Categories/${item['SearchKey']}`))} sx={{":hover": {backgroundColor: 'rgb(230, 230, 230)'}}}/>
            ))}
             {CategoriesList.map((item, index) => (
              <Tab key={index} icon={<SvgIcon component={item['Image']}/>} label={item['Category']} onClick={() => (window.location.assign(`Categories/${item['SearchKey']}`))} sx={{":hover": {backgroundColor: 'rgb(230, 230, 230)'}}}/>
            ))}
             {CategoriesList.map((item, index) => (
              <Tab key={index} icon={<SvgIcon component={item['Image']}/>} label={item['Category']} onClick={() => (window.location.assign(`Categories/${item['SearchKey']}`))} sx={{":hover": {backgroundColor: 'rgb(230, 230, 230)'}}}/>
            ))}
             {CategoriesList.map((item, index) => (
              <Tab key={index} icon={<SvgIcon component={item['Image']}/>} label={item['Category']} onClick={() => (window.location.assign(`Categories/${item['SearchKey']}`))} sx={{":hover": {backgroundColor: 'rgb(230, 230, 230)'}}}/>
            ))}
          </Tabs>
        </Box>
  )
}

export default SelectCategoriesList