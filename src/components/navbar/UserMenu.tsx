'use client';
import React from 'react'
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import {
     Avatar,
      Dropdown,
       DropdownItem,
        DropdownMenu,
         DropdownSection,
          DropdownTrigger 
        } from '@heroui/react'
import Link from 'next/link'

type Props = {
    user?: Session ['user'];
};
export default function UserMenu({user}: Props) {
    async function signOutUser() {
        await signOut({ callbackUrl: '/'});
    }

  return (
    <Dropdown placement='bottom-end'>
        <DropdownTrigger>
            <Avatar
            isBordered
            as ='button'
            className='transition-transform'
            color='secondary'
            name={user?.name || 'user avatar'}
            size='sm'
            src={user?.image || '/images/user.png'}
            />
        </DropdownTrigger>
        <DropdownMenu variant='flat'aria-label='user actions menu'>
            <DropdownSection showDivider>
                <DropdownItem key ='signInAs'isReadOnly as ='span'className='h-14 flex items-row'aria-label='username'>
                    Signed in as {user?.name}
                </DropdownItem>
            </DropdownSection>
            <DropdownItem key='editprofile' onPress={() => window.location.href = '/members/edit'} > 
            Edit profile
            </DropdownItem>
             <DropdownItem key='logout'color='danger'onPress={ signOutUser}>
            Log out
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>
  );
}
