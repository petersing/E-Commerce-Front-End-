import { useTranslation } from "react-i18next"


const ReturnReason = () =>{
    const {t} = useTranslation()
    return (
        [t("Order.OtherReasons")].concat(Object.values(t("Order.ReturnReason", {returnObjects: true})))
    )
}

export {ReturnReason}