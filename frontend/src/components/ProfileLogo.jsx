import style from "./ProfileLogo.module.css";


function ProfileLogo({Name}) {
  return (
    <div id={style.mylogo}>
        <h3>{Name}</h3>
    </div>
  )
}

export default ProfileLogo