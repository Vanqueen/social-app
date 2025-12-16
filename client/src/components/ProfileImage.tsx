// ProfileImage.tsx
import type { ProfileImageProps } from "../types/profileImageProps"

const ProfileImage = ({image, className}: ProfileImageProps) => {
  return (
    <div className={`profileImage ${className}`}>
        <img src={image || null} alt="" />
    </div>
  )
}

export default ProfileImage;