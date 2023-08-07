import React, { useState } from 'react';
import { Button, ButtonGroup, CardContent, Typography } from '@material-ui/core'

import useUser from '../../lib/useUser'
import MainLayout from '../../layout/admin/MainLayout'
import MainCard from '../../ui-component/cards/MainCard'
import CurrentUser from '../../ui-component/CurrentUser'
import DescriptionGridGenerator from '../../ui-component/DescriptionGridGenerator'
import UpdateDoctor from '../../modules/Doctor/UpdateDoctor'
import UpdatePatient from '../../modules/patients/UpdatePatient'




const ProfilePage = () => {

    const { isDoctor, isPatient, info } = useUser()
    return (
        <CurrentUser>
            {({ info, isDoctor }) => {
                return (
                    <MainLayout>
                        <MainCard content={false}>
                            <CardContent>
                                {isDoctor && (<UpdateDoctor doctor={info}  />)}
                                {/* {isDoctor && (<UpdatePatient doctor={info}  />)} */}
                                {isPatient && (<UpdatePatient patient={info}  />)}
                        

                            </CardContent>
                        </MainCard>
                    </MainLayout>
                )
            }}
        </CurrentUser>
    )
}

export default ProfilePage
