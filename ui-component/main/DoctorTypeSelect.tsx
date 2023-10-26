import { MenuItem, Select } from '@material-ui/core'
import { ENUM_DOCTOR_TYPES } from '../../hooks/useDoctors'
import { useTranslation } from 'react-i18next';

import enTrans from '../../public/locales/en/common.json';
import huTrans from '../../public/locales/hu/common.json';


const DoctorTypeSelect = ({ value, curLang, handleChange, ...rest }) => {

    const currentTranslations = curLang === 'hu' ? huTrans : enTrans;
    // console.log(i18n.language)
    const getTranslation = (key) => {
        return currentTranslations.DoctorType[key];
    };

    return (
        <Select name="doctorType" value={value} onChange={handleChange} {...rest}>
            {Object.entries(ENUM_DOCTOR_TYPES).map(([key, val]) => (
                <MenuItem key={key} value={val}>
                    {getTranslation(val)}
                </MenuItem>
            ))}
        </Select>
    );
}

export default DoctorTypeSelect
