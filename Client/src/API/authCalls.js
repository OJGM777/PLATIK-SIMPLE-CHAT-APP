
import { setLogin, setLogOut } from "../store/chatSlice.js";

export const logInfo = async (email, password, dispatch, navigate, ) => {

  try {
    const result = await fetch("http://localhost:3000/auth/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${Token}`
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!result.ok) {
      dispatch(setLogOut());
      return result.json();
      throw new Error("Failed to authenticate user");
    }

    const authorizatedUser = await result.json();

    if (authorizatedUser.success === true) {
      dispatch(
        setLogin({
          userInfo: authorizatedUser.user,
          tokenInfo: authorizatedUser.token,
        })
      );
      navigate("/home");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const SignUp = async ( name, email, password, about, pic) => {
  try {

    const FRMData = new FormData();
    FRMData.append("name", name);
    FRMData.append("email", email);
    FRMData.append("password", password);
    FRMData.append("about", about);
    FRMData.append("profilePicture", pic);

    const savedUserData = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      body: FRMData,
    });

    if (!savedUserData.ok) {
      return savedUserData.json(); /// KEEP DOING THE EMAIL VERIFICATIONS
    }

    const result = await savedUserData.json();

    if (result) {
      return result.status;
    } else {
      return { message: "Something went wrong" };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { message: error.message };
  }
};
