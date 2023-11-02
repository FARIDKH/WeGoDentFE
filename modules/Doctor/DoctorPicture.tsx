import React, { useState, useEffect } from 'react';
import defaultDentistPic from '../../assets/images/dentist-profile-pic.png'; // Ensure you have a default image in your assets
import avatar from '../../assets/images/avatar.png';
import { storage } from '../../utils/firebase'; // make sure to import your Firebase storage instance
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

const DoctorPicture = ({ file = null, doctor = null, ...rest }) => {
  const [imageUrl, setImageUrl] = useState(avatar?.src); // set initial state to avatar

  useEffect(() => {
    if (file) {
      // If there's a file, use it as the image source
      setImageUrl(URL.createObjectURL(file));
    } else if (doctor?.id) {
      // Otherwise, try to fetch the image from Firebase
      const imageRef = storageRef(storage, `doctor/${doctor.id}/profile-picture`);
      getDownloadURL(imageRef)
        .then((url) => {
          setImageUrl(url);
        })
        .catch((error) => {
          console.error("Error fetching image from Firebase Storage:", error);
          // If an error occurs, set the image to the default dentist picture
          setImageUrl(defaultDentistPic?.src);
        });
    } else {
      // If no file or doctor id, use the default dentist picture
      setImageUrl(defaultDentistPic?.src);
    }
  }, [file, doctor]);

  return (
    <img
      src={imageUrl}
      alt={doctor?.userDTO?.email || 'Default Dentist'}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={({ currentTarget }) => {
        // If there is an error loading the image, set it to the default dentist picture
        currentTarget.onerror = null; // Prevents looping
        currentTarget.src = defaultDentistPic?.src;
      }}
      {...rest}
    />
  );
};

export default DoctorPicture;
