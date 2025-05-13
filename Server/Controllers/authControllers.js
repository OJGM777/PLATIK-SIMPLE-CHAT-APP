import bcrypt from "bcrypt";
import { uploadImage } from "../Middleware/CloudinaryIMGuploader.js";
import { getUser, registerUser } from "../Model/users.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { isValidEmail } from "../utilities/verifyEmailFormat.js";
dotenv.config({ path: "./.env" });

export const register = async (req, res) => {
  try {
    const { name, email, password, profilePicture, about } = req.body;

    if (!name || !email || !password)
      return res.status(500).json({ error: `Incomplete Data` });

    if(name.length > 20){
      return res.status(500).json({ error: `The name must not have more than 30 characters` });
    }

    if(password.length < 10){
      return res.status(500).json({error: "Try A Safer Password"})
    }

    //CHECK IF EMAIL IS VALID
    const emailValidation = isValidEmail(email);
    if(!emailValidation){
     return res.status(500).json({error: "Invalid Email"});
    }

    /////////


    // CHECK IF THE EMAIL ALREADY EXISTS
    const emailAlreadyExists = await getUser({email: email});

    if(emailAlreadyExists || emailAlreadyExists?.length > 1){
      return res.status(409).json({error: "Email Already exists"});
    }
    /////////



    // password encryptation and ID generation
    const salt = await bcrypt.genSalt();
    const passwordhash = await bcrypt.hash(password, salt);
    const id = crypto.randomUUID();
    ///////////

    // IMG UPLOADING
    let uploadedIMG = null;
    const Picture = req.file ? req.file.path : null;
    if (Picture) {
      uploadedIMG = await uploadImage(Picture);
    }
    //////

    //UPLOADING TO MODEL
    const result = await registerUser(
      id,
      name,
      email,
      passwordhash,
      Picture
        ? uploadedIMG.url
        : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      about,
    );
    /////



    res.status(200).json({
      status: 200,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: `from auth: ${error.message}` });
  }
};

export const logIn = async(req, res) => {
    try {
      const {email, password} = req.body;

    if ( !email || !password)
      return res.status(500).json({ error: `Incomplete Data`, data: `${email} ${password}` });

      const user = await getUser({email: email}); // GETS THE USER FROM DB (IF EXISTS)

      if(!user){
        return res.status(400).json({error: "User does not exist"});
      } // RETURNS AN ERROR MESSAGE BECAUSE USER DOES NOT EXIST


      const MatchPword = await bcrypt.compare(password, user[0].password); // VERIFIES THE PASSWORD
      if(!MatchPword) return res.status(400).json({error: "Invalid Password"}) // SENDS PASSWORD ERR

        const jwtSecret = process.env.TSECRET; // GETS SECRET FROM THE ENV FILE

        const token = jwt.sign({id: user[0].id}, jwtSecret);  //SIGNS THE TOKEN TO DO ACTIONS IN THE APP
        delete user[0].password;

        res.status(200).json({token: token, user: user[0], success: true}); // SEND DATA TO CLIENT

    } catch (error) {
      res.status(500).json({ error: `from auth: ${error.message}` });
    }
};
