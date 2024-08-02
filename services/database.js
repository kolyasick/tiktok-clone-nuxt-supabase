// services/database.js
import { supabase } from './supabase'

// Create
export const createItem = async (table, item) => {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
  if (error) throw error
  return data
}

// Read
export const getItems = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
  if (error) throw error
  return data
}

export const getItemById = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
  if (error) throw error
  return data
}

// Update
export const updateItem = async (table, id, item) => {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq('id', id)
  if (error) throw error
  return data
}


// Delete
export const deleteItem = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}

export const uploadVideo = async (file) => {
    const { data, error } = await supabase
      .storage
      .from('video-storage') // replace 'videos' with your bucket name
      .upload(`public/${file.name + Date.now()}`, file)
  
    if (error) throw error
    return data
  }

  export const uploadImg = async (file) => {
    const { data, error } = await supabase
      .storage
      .from('video-storage') // replace 'videos' with your bucket name
      .upload(`avatars/${file.name + Math.random()}`, file)
  
    if (error) throw error
    return data
  }

export const deleteVideo = async (fileName) => {
    const { data, error } = await supabase
      .storage
      .from('video-storage')
      .remove([fileName])
  
    if (error) throw error
    return data
  }