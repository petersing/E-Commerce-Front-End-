import { useTranslation } from "react-i18next";
import SmallCompany from '../../assets/SmallCompany.png'
import MedianCompany from '../../assets/HighCompany.png'
import CustomCompany from '../../assets/CustomCompany.png'

const PaymentMethodLists =()=>{
    const {t} = useTranslation();
    return(
        {CreditCard: t('Purchase.CreditCard')}
    )
}

const DeliveryMethodLists =()=>{
    const {t} = useTranslation();
    return(
        {Free: t('Purchase.FreeStandardDelivery'), 
         Express: t('Purchase.ExpressStandardDelivery'), 
         Speed: t('Purchase.SpeedStandardDelivery')}
    )
}

const SubscribeMethodLists=()=> {
    const {t} = useTranslation();
    return(
        {
            Basic: {Name: t('AccountInformation.Basic'), 
                    Photo: SmallCompany, 
                    Price: 50,  
                    Sub: Object.values(t('AccountInformation.BasicPlan', {returnObjects: true}))},
            Prime: {Name: t('AccountInformation.Prime'), 
                    Photo: MedianCompany, 
                    Price: 100, 
                    Sub: Object.values(t('AccountInformation.PrimePlan', {returnObjects: true}))},
            Advanced: {Name: t('AccountInformation.Advanced'), 
                       Photo: CustomCompany, 
                       Price: 200, 
                       Sub: Object.values(t('AccountInformation.AdvancedPlan', {returnObjects: true}))}

        }
    )
}

const SubscribeMethodDurationLists = () =>{
    const {t} = useTranslation();
    return(
        {
            36: {Name: t('AccountInformation.3YearPlan'), Offer: 50, Range: 36},
            12: {Name: t('AccountInformation.1YearPlan'), Offer: 25, Range: 12},
            6: {Name: t('AccountInformation.6MonthPlan'), Offer: 12.5, Range: 6},
            3: {Name: t('AccountInformation.3MonthPlan'), Offer: 6, Range: 3},
            1: {Name: t('AccountInformation.1MonthPlan'), Offer: 0, Range: 1}
        }
    )
}


export {DeliveryMethodLists, PaymentMethodLists, SubscribeMethodLists, SubscribeMethodDurationLists}