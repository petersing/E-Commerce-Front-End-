
import FacebookLogo from '../../assets/signin-assets/Facebook/F-logo.png'
import { useScript } from './Public_Application'

declare global {
    interface Window {
        GoogleResponse: (response: any) => void;
    }
}

const GoogleLogin = (props: {Client_id: string, Redirect_URL: string, onComplete?: (clientId: string, credential: string, select_by: string) => void, Type: string}) => {
    useScript({url: "https://accounts.google.com/gsi/client", async: true, defer: true})

    window.GoogleResponse = (response: {clientId: string, credential: string, select_by: string}) =>{
        if (props.onComplete){
            props.onComplete(response.clientId, response.credential, response.select_by)
        }
    }

    return(
        <>
            <div id="g_id_onload" data-client_id={props.Client_id} data-callback={'GoogleResponse'} data-locale="en_US"/>
            <div className='g_id_signin' data-type="standard"  data-theme="filled_blue" data-width="400" data-locale="en_US"/>
        </>
    )
}

const DefaultLoginComponent = (props: {ButtonTitle: string, CompanyIcon: "*.png", onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void}) => {
    return(
        <div style={{backgroundColor: 'rgb(59,87,157)', 'height': '40px', 'width': '400px', border: '1px solid rgb(210,210,210)', borderRadius: '4px', display: 'flex', cursor: 'pointer', marginTop: '10px'}}
                onMouseEnter={e => {e.currentTarget.style.opacity = '80%'}}
                onMouseLeave={e => {e.currentTarget.style.opacity = '100%'}}
                onClick={props.onClick}>
            <div style={{backgroundColor: 'white', 'height': '36px', 'width': '36px', marginLeft: '2px', marginTop: '2px'}}>
                <img src={props.CompanyIcon} style={{'height': '20px', 'width': '20px', margin: '8px'}} alt="Google Login Logo"/>
            </div>   
            <div style={{color: 'white', fontSize: '14px', fontFamily: 'Roboto', marginLeft: '100px', paddingTop: '12px'}}>
                {props.ButtonTitle}
            </div>
        </div>
    )

}

const FaceBookLogin = (props: {Client_id: string, Redirect_URL: string}) => {
    const FacebookOAuth2URL = 'https://www.facebook.com/v14.0/dialog/oauth'

    const params = {
        client_id: props.Client_id,
        redirect_uri: props.Redirect_URL,
        response_type: 'code',
    };

    const urlParams = new URLSearchParams(params).toString();

    return(
        <DefaultLoginComponent ButtonTitle='Sign in with Facebook' CompanyIcon={FacebookLogo} onClick={() => {window.open(`${FacebookOAuth2URL}?${urlParams}`)}}/>
    )

}

export {GoogleLogin, FaceBookLogin}