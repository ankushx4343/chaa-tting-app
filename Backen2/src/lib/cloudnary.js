import {v2 as cloudnary} from 'cloudinary'
import {config} from "dotenv"

config();
cloudnary.config({
    cloud_name:process.env.CLOUD_NARY_NAME,
    api_key:226715776517347,
    api_secret:"Tn7XcyKl-flH3ePH8FrMQIs5evg",
})

export default cloudnary