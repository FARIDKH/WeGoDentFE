import React, { useState } from 'react';
import { Button, ButtonGroup, CardContent } from '@material-ui/core'

import MainLayout from '../../layout/admin/MainLayout'
import MainCard from '../../ui-component/cards/MainCard'
import CurrentUser from '../../ui-component/CurrentUser'
import DescriptionGridGenerator from '../../ui-component/DescriptionGridGenerator'
import UpdateDoctor from '../../modules/Doctor/UpdateDoctor'




const ProfilePage = () => {

    
    return (
        <CurrentUser>
            {({ info, isDoctor }) => {
                return (
                    <MainLayout>
                        <MainCard content={false}>
                            <CardContent>
                                
                                <UpdateDoctor doctor={info}  />


                            </CardContent>
                        </MainCard>
                    </MainLayout>
                )
            }}
        </CurrentUser>
    )
}

export default ProfilePage
