import { gql, useLazyQuery } from "@apollo/client";
import { Box, Typography, Tabs, Tab, Grid , List, ListItem, Divider, Pagination, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import Chart from 'react-apexcharts'
import { useTranslation } from "react-i18next";

const GetAnalysisData = gql`
query AnalysisProduct($Start: Int!, $End: Int!, $StartDate: String!, $EndDate: String!) {
    AnalysisProduct(Start: $Start, End: $End) {,
      Series(Start: $StartDate, End: $EndDate)
    },
}
`

const GetProductCount = gql`
query ProductCountUser {
    ProductCountUser
}
`

function InitialDate(){
    const End = new Date().toLocaleString("sv-SE").substring(0, 10)
    var Begin : Date| string= new Date()
    Begin.setTime(Begin.getTime() - 1000*60*60*24*7)
    Begin = Begin.toLocaleString("sv-SE").substring(0, 10)
    return {Begin, End}
}

const AnalysisMangementPage = () => {
    const [Type, setType] = useState<string>("All");
    const [Page, setPage] = useState<number>(1);
    const [GetAnalysisFunction] = useLazyQuery<{AnalysisProduct: {Series: string}[]}>(GetAnalysisData);
    const [AnalysisData, setAnalysisData] = useState<{[Title: string]: {[Sub: string]: {[Date: string]: number}}}[]>([]);
    const [GetProductCountFunction] = useLazyQuery(GetProductCount)
    const [ProductCount, setProductCount] = useState<number>(0)
    const [OpenFilter, setOpenFilter] = useState<boolean>(false)
    const {Begin, End} = InitialDate()
    const [StartDate, setStartDate] = useState<string>(Begin)
    const [EndDate, setEndDate] = useState<string>(End)
    const {t} = useTranslation()


    useEffect(() => {
        GetAnalysisFunction({variables: {Start: (Page-1)*5, End: Page*5, StartDate: StartDate, EndDate: EndDate}}).then((res)=>{
            if (res.data){
                setAnalysisData(res.data.AnalysisProduct.map((item)=> JSON.parse(item.Series)))
            }
            
        })
    }, [GetAnalysisFunction, Page, StartDate, EndDate])

    useEffect(() =>{
        GetProductCountFunction().then((res)=>{
            if (res.data){
                setProductCount(res.data.ProductCountUser)
            }
        })
    }, [GetProductCountFunction])

    return (
        <>
            <Box sx={{border: 'solid 1px rgb(220,220,220)', width: '80%', ml: 'auto', mr: 'auto', borderRadius: '10px', 
                                backgroundColor: 'rgb(250,250,250)', marginTop: '150px' ,minWidth: '1200px', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', marginLeft: '2%', marginTop: '50px', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                        <Typography variant="h4" fontWeight='bold' sx={{mr: '10px'}}>{t("Business.Analysis")}</Typography>
                    </div>  
                    <Button variant='contained' sx={{mr: '20px'}} onClick={() => setOpenFilter(true)}>{t("Business.FilterDate")}</Button>
                </div>
                <Box sx={{ ml: '2%' }}>
                    <Tabs value={Type} onChange={(e, value)=> {setType(value)}}>
                        <Tab label={t("Business.AllRecord")} value={'All'} />
                    </Tabs>
                </Box>
                <Grid container>
                    <Grid item xs={12}>
                        <List sx={{ml: '1%', mr: '1%'}}>
                        <ListItem>
                            <Grid container>                                             
                                {AnalysisData?.map((item)=> {
                                    const Title = Object.keys(item)[0]
                                    if (Title === undefined){return(null)}
                                    const Sub = Object.keys(item[Title])
                                    const DateTime = Object.keys(item[Title][Sub[0]])
                                    const ChartData = Sub.map((sub) =>{return({name: sub, data: Object.values(item[Title][sub])})})
                                    return(
                                        <Grid item xs={6} key={Math.random()}>
                                            <Chart options={{chart: {id: "basic-bar"}, xaxis: {categories: DateTime}, title: {text: Title}}} series={ChartData} type="line" width="500" />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </ListItem>
                        <Divider sx={{mb: '5px'}}/>
                        </List> 
                    </Grid>
                    <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                        <Pagination count={Math.ceil(ProductCount/5)} sx={{transform: 'scale(1.2)', mb: '15px'}} size='large' onChange={(e, value) => setPage(value)} page={Page}/>
                    </Grid>
                </Grid>
            </Box>
            <Dialog open={OpenFilter} onClose={() => setOpenFilter(false)}>
                <DialogTitle>{t("Business.FilterDate")}</DialogTitle>
                <DialogContent>
                    <div style={{display:'flex', justifyContent: 'center'}}>
                        <TextField label="Start Date" type="date"  variant="outlined" sx={{mt: '10px'}} 
                                value={StartDate} onChange={(e) => {if(e.target.value < EndDate){setStartDate(e.target.value)}}} focused fullWidth/>
                        <TextField label="End Date" type="date" variant="outlined" sx={{mt: '10px', ml: '10px'}} 
                                value={EndDate} onChange={(e) => {if (e.target.value <= End){setEndDate(e.target.value)}}} focused fullWidth/>
                    </div>
                    <Typography variant='caption' sx={{opacity: 0.7}}>{t("Business.AnalysisStatement")}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => setOpenFilter(false)}>{t("Business.Apply")}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AnalysisMangementPage