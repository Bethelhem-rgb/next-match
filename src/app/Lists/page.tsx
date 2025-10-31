"use server";
import React from 'react'
import ListsTab from './Liststab'
import { fetchCurrentUserLikeIds, fetchLikeMembers } from '../actions/likeActions'

export default async function ListsPage({searchParams}:{ searchParams: any }){
  const params = await searchParams;
   const type = params?.type || 'source';
  const likeIds = await fetchCurrentUserLikeIds();
  const members= await fetchLikeMembers( type);
  return (
    <div>
      
        <ListsTab members = {members} likeIds = {likeIds}/>
                </div>
              );
             }
      
  

