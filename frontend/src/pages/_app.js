import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import ChatWrapper from "../Components/ChatWrapper/index"
import Flash from "@/Components/Flash";
import { useState } from "react";



export default function App({ Component, pageProps }) {

  let [flash, setFlash] = useState({
    open: false,
    message: "",
    severity: "",
  });


  return <>

    <Provider store={store}>
      <ChatWrapper>
        <Component {...pageProps} setFlash={setFlash} />

        

      </ChatWrapper>
    </Provider>

    <Flash
      message={flash.message}
      severity={flash.severity}
      open={flash.open}
      onClose={() => setFlash({ ...flash, open: false })}

    />
  </>
}





