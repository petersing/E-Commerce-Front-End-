import { Dialog, DialogContent, DialogTitle , Stepper, Step, StepLabel} from "@mui/material"
import { useState } from "react";
import SelectDeliveryMethod from "./SelectDeliveryMethod";
import ReceiverAddress from "./ReceiverAddress";
import SelectPaymentMethod from "./SelectPaymentMethod";
import ConfirmAndPay from "./ConfirmAndPay";
import { Cart_Object} from "../../Public_Data/Interfaces";
import FinishPayment from "./FinishPayment";
import { useTranslation } from "react-i18next";
import { DeliveryMethodLists, PaymentMethodLists } from "../../Public_Data/PaymentMethodList";



const PurchaseDialog = (props: {Open: boolean, setOpen: Function, CartData: Cart_Object[], Clear:boolean}) => {
  const {t} = useTranslation()
  const steps: Array<string> = t('Purchase.Steps', { returnObjects: true });
  const [activeStep, setActiveStep] = useState(0);
  const [DeliveryMethod, setDeliveryMethod] = useState<string>("Free");
  const [ClientInformation, setClientInformation] = useState<{Name: string, Email: string, Phone: string, Address: string}>({Name: '', Email: '', Phone: '', Address: ''});
  const [PaymentMethod, setPaymentMethod] = useState<string>("CreditCard");
  const [Payment_Response_Data, setPayment_Response_Data] = useState<{ID: string, DateCreated: string, URL: string, payment_intent: string}>({ID: '', DateCreated: '', URL: '', payment_intent: ''});

  
  function Control_Page(page: number, setActiveStep: Function){
    switch(page){
      case 0:
        return <SelectDeliveryMethod setActiveStep={setActiveStep} setDeliveryMethod={setDeliveryMethod}/>
      case 1:
        return <ReceiverAddress setActiveStep={setActiveStep} setClientInformation={setClientInformation}/>
      case 2:
        return <SelectPaymentMethod setActiveStep={setActiveStep} setPaymentMethod={setPaymentMethod}/>
      case 3:
        return <ConfirmAndPay setActiveStep={setActiveStep} DeliveryMethod={DeliveryMethod} Clear={props.Clear}
                              Client_Information={ClientInformation} Cart_Items={props.CartData} PaymentMethod={PaymentMethod}
                              setPayment_Response_Data={setPayment_Response_Data}
                              />
      case 4:
        return <FinishPayment onCloseFunction={() => props.setOpen(false)} Payment_Response_Data={{orderID: Payment_Response_Data.ID, Create_Date: Payment_Response_Data.DateCreated, PaymentMethod: PaymentMethod}}/>
    }
  }
  
  return (
    <Dialog open={props.Open} onClose={() => props.setOpen(false)} fullWidth maxWidth='md'>
      <DialogTitle>{t("Purchase.PurchaseOrder")}</DialogTitle>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
        ))}
      </Stepper>
      <DialogContent>
        {Control_Page(activeStep, setActiveStep)} 
      </DialogContent>
    </Dialog>
  )
}

export default PurchaseDialog