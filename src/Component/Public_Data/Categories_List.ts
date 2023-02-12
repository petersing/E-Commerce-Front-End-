import ComputerIcon from '@mui/icons-material/Computer';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import ManIcon from '@mui/icons-material/Man';
import GirlIcon from '@mui/icons-material/Girl';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WeekendIcon from '@mui/icons-material/Weekend';
import BlenderIcon from '@mui/icons-material/Blender';
import { useTranslation } from 'react-i18next';

const Categories_List = () =>{
    const {t} = useTranslation();
    return (
        [
            {Category: t('Selection.Computer'), Image: ComputerIcon, SearchKey: 'Computer'},
            {Category: t('Selection.Phone'), Image: PhoneIphoneIcon, SearchKey: 'Phone'},
            {Category: t('Selection.Vehicle'), Image: DirectionsCarIcon, SearchKey: 'Vehicle'},
            {Category: t('Selection.Food'), Image: LocalPizzaIcon, SearchKey: 'Food'},
            {Category: t('Selection.Man'), Image: ManIcon, SearchKey: "Man"},
            {Category: t('Selection.Lady'), Image: GirlIcon, SearchKey: "Lady"},
            {Category: t('Selection.Childern'), Image: ChildCareIcon, SearchKey: "Childern"},
            {Category: t('Selection.Furniture'), Image: WeekendIcon, SearchKey: "Furniture"},
            {Category: t('Selection.Electronic'), Image: BlenderIcon, SearchKey: "Electronic"}
        
        ]
    )
}

const Categories_Data: {[key: string]: any} = {
    Computer: {"Lenovo": {"Test1": {}}, "HP": {}, "Dell": {}, "Apple": {}, "Asus": {}, "Acer":{}},
    Phone: {"Samsung": {}, "Apple": {}, "Huawei": {}, "Xiaomi": {}, "Oppo": {}, "Vivo": {}},
    Vehicle: {"Honda": {}, "Toyota": {}, "Nissan": {}, "Mazda": {}, "Mitsubishi": {}, "Kia": {}},
    Furniture: {"Chair": {}, "Table": {}, "Bed": {}, "Cupboard": {}, "Wardrobe": {}, "Cabinet": {}},
    Electronic: {"Blender": {}, "Camera": {}, "Laptop": {}, "TV": {}, "Speaker": {}, "Microwave": {}},
    Man: {"T-shirt": {}, 'Shirt': {}, 'Pants': {}, "Shoes": {}, "Bag": {}, "Hat": {}, "Dress": {}, "Skirt": {}, "Jacket": {}, "Coat": {}, "Sweater": {}, "Sweatshirt": {}, "Blouse": {}, "Jeans": {}},
    Lady: {"T-shirt": {}, 'Shirt': {}, 'Pants': {}, "Shoes": {}, "Bag": {}, "Hat": {}, "Dress": {}, "Skirt": {}, "Jacket": {}, "Coat": {}, "Sweater": {}, "Sweatshirt": {}, "Blouse": {}, "Jeans": {} },
    Childern: {"T-shirt": {}, 'Shirt': {}, 'Pants': {}, "Shoes": {}, "Bag": {}, "Hat": {}, "Dress": {}, "Skirt": {}, "Jacket": {}, "Coat": {}, "Sweater": {}, "Sweatshirt": {}, "Blouse": {}, "Jeans": {}},
    Food: {'Pizza':{}, "Chicken": {}, "Beef": {}, "Pork": {}, "Fish": {}, "Rice": {}, "Noodle": {}, "Bread": {}, "Egg": {}, "Vegetable": {}, "Fruit": {}, "Drink": {}, "Snack": {}, "Dessert": {}}
}


export {Categories_List, Categories_Data}