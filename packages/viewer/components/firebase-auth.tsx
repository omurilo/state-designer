/* globals window */
import { useEffect, useState } from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import firebase from "firebase/app"
import "firebase/auth"
import cookie from "js-cookie"
import { Flex } from "theme-ui"
import initFirebase from "../auth/initFirebase"

// Init the Firebase app.
initFirebase()

const firebaseAuthConfig = {
  signInFlow: "popup",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: `/user`,
  credentialHelper: "none",
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      // xa is the access token, which can be retrieved through
      // firebase.auth().currentUser.getIdToken()
      const { uid, email, xa } = user
      const userData = {
        id: uid,
        email,
        token: xa,
      }

      firebase.auth().currentUser.getIdToken(true)

      cookie.set("auth", userData, {
        expires: 60 * 60 * 24 * 5 * 1000,
      })
    },
  },
}

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRenderAuth(true)
    }
  }, [])

  return (
    <Flex variant="fullView">
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig as any} // TODO: What type is correct here?
          firebaseAuth={firebase.auth()}
        />
      ) : null}
    </Flex>
  )
}

export default FirebaseAuth